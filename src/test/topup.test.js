const request = require('supertest');
const app = require('../app');
const { user, profile, transaction, sequelize } = require('../models');
const { generateToken } = require('../common/utils/jwt');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Mock payment service dengan kemungkinan gagal
jest.mock('../common/utils/payment', () => ({
  simulatePaymentGateway: jest.fn()
}));

const paymentService = require('../common/utils/payment');

describe('Top-up Concurrency Stress Test', () => {
  let testUser;
  let testProfile;
  let authToken;
  let roleId;

  beforeAll(async () => {
    await sequelize.authenticate();
    const [roles] = await sequelize.query("SELECT id FROM roles WHERE name = 'player'");
    roleId = roles[0]?.id;
    
    if (!roleId) {
      throw new Error('Player role not found. Please run seeders first.');
    }
  });

  beforeEach(async () => {
    // membuat user dan profile untuk testing
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    testUser = await user.create({
      id: uuidv4(),
      email: `test-${Date.now()}-${Math.random()}@example.com`,
      password: hashedPassword,
      role_id: roleId
    });

    testProfile = await profile.create({
      id: uuidv4(),
      user_id: testUser.id,
      username: `testuser-${Date.now()}-${Math.random()}`,
      game_currency: 10000, // Starting balance
      score: 0
    });

    // membuat token untuk user
    authToken = generateToken({ 
      id: testUser.id, 
      role_name: 'player' 
    });
  });

  afterEach(async () => {
    try {
      await transaction.destroy({ where: { profile_id: testProfile.id } });
      await profile.destroy({ where: { id: testProfile.id } });
      await user.destroy({ where: { id: testUser.id } });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should handle 100 concurrent top-up requests with payment failures', async () => {
    const CONCURRENT_REQUESTS = 100;
    const TOPUP_AMOUNT = 100;
    const TOTAL_PRICE = 10000;
    const FAILURE_RATE = 0.8; 
    
    paymentService.simulatePaymentGateway.mockImplementation(() => {
      const isSuccess = Math.random() < FAILURE_RATE;
      return Promise.resolve({
        success: isSuccess,
        message: isSuccess ? 'Payment successful' : 'Payment failed - insufficient balance'
      });
    });
    
    // Generate semua request
    const requests = Array(CONCURRENT_REQUESTS).fill().map(() => 
      request(app)
        .post('/api/shop/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: TOPUP_AMOUNT,
          payment_method: 'credit_card',
          total_price: TOTAL_PRICE
        })
    );

    console.time(`Executing ${CONCURRENT_REQUESTS} concurrent requests`);
    const responses = await Promise.allSettled(requests);
    console.timeEnd(`Executing ${CONCURRENT_REQUESTS} concurrent requests`);

    // Kategorisasi response
    const successfulRequests = responses.filter(
      r => r.status === 'fulfilled' && r.value.status === 200
    );
    
    const failedRequests = responses.filter(
      r => r.status === 'fulfilled' && r.value.status === 400 // Payment failed
    );
    
    const erroredRequests = responses.filter(
      r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status >= 500)
    );

    // Debug logging untuk melihat jenis error yang terjadi
    console.log(`Successful: ${successfulRequests.length}`);
    console.log(`Payment Failed: ${failedRequests.length}`);
    console.log(`System Errored: ${erroredRequests.length}`);
    console.log(`Success Rate: ${(successfulRequests.length / CONCURRENT_REQUESTS * 100).toFixed(2)}%`);

    // Log detail error untuk debugging
    if (erroredRequests.length > 0) {
      console.log('Error details:');
      erroredRequests.slice(0, 5).forEach((err, index) => {
        if (err.status === 'rejected') {
          console.log(`  ${index + 1}. Rejected: ${err.reason?.message || err.reason}`);
        } else {
          console.log(`  ${index + 1}. Status ${err.value.status}: ${err.value.body?.message || 'Unknown error'}`);
        }
      });
    }

    // Verifikasi total request 
    expect(successfulRequests.length + failedRequests.length + erroredRequests.length).toBe(CONCURRENT_REQUESTS);

    // Verifikasi payment gateway
    expect(paymentService.simulatePaymentGateway).toHaveBeenCalled();

    // Tunggu hingga semua operasi database selesai
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verifikasi data konsistensi
    const updatedProfile = await profile.findByPk(testProfile.id);
    const allTransactions = await transaction.findAll({
      where: { profile_id: testProfile.id }
    });

    // Pisahkan transaksi berdasarkan status
    const completedTransactions = allTransactions.filter(t => t.status === 'completed');
    const failedTransactions = allTransactions.filter(t => t.status === 'failed');

    console.log(` Total transactions in DB: ${allTransactions.length}`);
    console.log(` Completed transactions: ${completedTransactions.length}`);
    console.log(` Failed transactions: ${failedTransactions.length}`);

    // Verifikasi jumlah transaksi yang berhasil masuk ke database
    expect(allTransactions.length).toBeGreaterThan(0);
    expect(allTransactions.length).toBeLessThanOrEqual(CONCURRENT_REQUESTS);
    
    // Verifikasi tidak ada duplikat order_id jika ada transaksi
    if (allTransactions.length > 0) {
      const orderIds = allTransactions.map(t => t.order_id);
      const uniqueOrderIds = new Set(orderIds);
      expect(uniqueOrderIds.size).toBe(allTransactions.length);
    }
    
    // Verifikasi semua amount dan total_price benar untuk transaksi yang ada
    if (allTransactions.length > 0) {
      const allAmountsCorrect = allTransactions.every(
        t => t.amount === TOPUP_AMOUNT && t.total_price === TOTAL_PRICE
      );
      expect(allAmountsCorrect).toBe(true);
    }
    
    // Verifikasi konsistensi balance - hanya transaksi completed yang menambah saldo
    const totalSuccessfulAmount = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expectedBalance = 10000 + totalSuccessfulAmount;
    expect(updatedProfile.game_currency).toBe(expectedBalance);
    
    // Verifikasi format order_id yang benar untuk semua transaksi yang ada
    if (allTransactions.length > 0) {
      const validOrderIds = allTransactions.filter(t => 
        t.order_id && t.order_id.startsWith('TOPUP-') && t.order_id.includes(testProfile.id)
      );
      expect(validOrderIds.length).toBe(allTransactions.length);
    }
    
 // Log hasil verifikasi
    console.log(`Final balance: ${updatedProfile.game_currency}`);
    console.log(`Expected balance: ${expectedBalance}`);
    console.log(`Balance from completed transactions: ${totalSuccessfulAmount}`);
    console.log(`All consistency checks passed`);
    
    // verifikasi jumlah transaksi db yang berhasil dengan jumlah request yang berhasil
    expect(successfulRequests.length).toBe(completedTransactions.length);
    
    console.log(`HTTP vs DB Status Analysis:`);
    console.log(`HTTP Success: ${successfulRequests.length}`);
    console.log(`HTTP Failed: ${failedRequests.length}`);
    console.log(`HTTP Errored: ${erroredRequests.length}`);
    console.log(`DB Completed: ${completedTransactions.length}`);
    console.log(`DB Failed: ${failedTransactions.length}`);
    
    // verifikasi error http dengan transaksi db yang berhasil harus sama dengan jumlah total transaksi
    expect(completedTransactions.length + erroredRequests.length).toBe(allTransactions.length);
    
    // verifikasi jumlah transaksi yang berhasil dan gagal harus sama dengan jumlah transaksi di db
    expect(completedTransactions.length + failedTransactions.length).toBe(allTransactions.length);
    
    // Verifikas saldo game currency user harus sesuai dengan saldo yang diharapkan
    expect(updatedProfile.game_currency).toBe(expectedBalance);
    
    // Verifikasi tidak ada transaksi yang duplikat
    if (allTransactions.length > 0) {
      const orderIds = allTransactions.map(t => t.order_id);
      const uniqueOrderIds = new Set(orderIds);
      expect(uniqueOrderIds.size).toBe(allTransactions.length);
    }
    
    //verifikasi ada transaksi yang berhasil
    if (erroredRequests.length < CONCURRENT_REQUESTS) {
      expect(allTransactions.length).toBeGreaterThan(0);
    } 
    
    // Log success rate dan konsistensi data
    const dbSuccessRate = allTransactions.length > 0 ? 
      (completedTransactions.length / allTransactions.length * 100).toFixed(2) : '0.00';
    const httpSuccessRate = (successfulRequests.length / CONCURRENT_REQUESTS * 100).toFixed(2);
    
    console.log(`DB Success Rate: ${dbSuccessRate}%`);
    console.log(`HTTP Success Rate: ${httpSuccessRate}%`);
    console.log(`Data Consistency: PASSED`);
    console.log(`Balance Integrity: PASSED`);
    console.log(`Race Conditions: NONE DETECTED`);
    
    // Verifikasi jumlah transaksi yang gagal sesuai dengan jumlah request yang gagal
    expect(erroredRequests.length).toBe(failedTransactions.length);
    
    // Verifikasi tidak ada transaksi yang pending
    const pendingTransactions = allTransactions.filter(t => t.status === 'pending');
    expect(pendingTransactions.length).toBe(0);
    
    // Verifikasi jumlah total transaksi di database harus sama dengan jumlah request yang berhasil dan gagal
    expect(successfulRequests.length + erroredRequests.length).toBe(allTransactions.length);
  }, 60000);
});