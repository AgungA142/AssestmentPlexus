/**
 * @swagger
 * 
 * /api/shop/getAllShop:
 *   get:
 *     tags: [Shop]
 *     summary: mengambil daftar semua shop
 *     description: endpoint untuk Mengambil daftar semua shop yang ada.
 *     responses:
 *       200:
 *         description: Daftar shop yang berhasil diambil.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data shop.
 * 
 * 
 * /api/shop/getDetailShop/{id}:
 *   get:
 *     tags: [Shop]
 *     summary: mengambil data shop berdasarkan ID
 *     description: endpoint untuk Mengambil data shop berdasarkan ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari shop yang ingin diambil.
 *
 *     responses:
 *       200:
 *         description: Data shop yang berhasil diambil.
 *       404:
 *         description: Shop dengan ID tersebut tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan saat mengambil data shop.
 * 
 * 
 * /api/shop/{shop_id}/items/{item_id}/purchase:
 *   post:
 *     tags: [Shop]
 *     summary: melakukan pembelian item dari shop
 *     description: endpoint untuk melakukan pembelian item dari shop.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         description: ID dari shop yang ingin dibeli itemnya.
 *       - in: path
 *         name: item_id
 *         required: true
 *         description: ID dari item yang ingin dibeli.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Jumlah item yang ingin dibeli.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Pembelian item berhasil dilakukan.
 *       400:
 *         description: Bad request, jika ada kesalahan dalam permintaan.
 *       404:
 *         description: Shop, item, atau profil tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan saat melakukan pembelian item.
 *
 *
 * 
 * 
 */