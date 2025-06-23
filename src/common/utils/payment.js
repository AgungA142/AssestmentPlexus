const simulatePaymentGateway = async (amount, payment_method)  => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const isSuccess = Math.random() < 0.9;
    if (isSuccess) {
        return {
            success: true,
            status: 'completed',
            amount,
            payment_method,
        };
    } else {
        return {
            success: false,
            status: 'failed',
            message: 'gagal melakukan pembayaran',
            amount,
            payment_method,
        };
    }
}

module.exports = {
    simulatePaymentGateway
};