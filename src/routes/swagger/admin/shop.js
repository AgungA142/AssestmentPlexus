/**
 * @swagger
 * 
 * /api/admin/shop/createShop:
 *   post:
 *     tags: [Admin]
 *     summary: Membuat data shop baru
 *     description: Endpoint untuk membuat data shop baru. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nama shop
 *                   example: "Winter Shop"
 *                 description:
 *                   type: string
 *                   description: Deskripsi shop
 *                   example: "Shop untuk musim dingin dengan berbagai hadiah menarik"
 *                 shop_type:
 *                   type: string
 *                   description: Tipe shop
 *                   enum: [general, equipment, consumable, material]
 *                   example: "general"
 
 *     responses:
 *      201:
 *        description: shop berhasil dibuat
 *      400:
 *        description: Bad Request, data tidak valid atau tidak lengkap
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * /api/admin/shop/updateShop/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Mengupdate data shop
 *     description: Endpoint untuk mengupdate data shop yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID shop yang ingin diupdate
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nama shop
 *                   example: "shop Season 3"
 *                 description:
 *                   type: string
 *                   description: Deskripsi shop
 *                   example: "shop untuk season 3 dengan berbagai hadiah menarik"
 *                 shop_type:
 *                   type: string
 *                   description: Tipe shop
 *                   enum: [general, equipment, consumable, material]
 *                   example: "general"
 *     responses:
 *      201:
 *        description: shop berhasil dibuat
 *      400:
 *        description: Bad Request, data tidak valid atau tidak lengkap
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 *
 * 
 * 
 * /api/admin/shop/deleteShop/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Menghapus data shop
 *     description: Endpoint untuk menghapus data shop yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID shop yang ingin dihapus
 *     responses:
 *      200:
 *        description: shop berhasil dihapus
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      404:
 *        description: Not found, shop tidak ditemukan
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * 
 */