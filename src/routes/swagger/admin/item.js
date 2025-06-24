/**
 * @swagger
 * 
 * /api/admin/item/createItem:
 *   post:
 *     tags: [Admin]
 *     summary: Membuat data item baru
 *     description: Endpoint untuk membuat data item baru. Hanya dapat diakses oleh admin.
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
 *                   description: Nama item
 *                   example: "long Sword"
 *                 description:
 *                   type: string
 *                   description: Deskripsi item
 *                   example: "item untuk season 3 dengan berbagai hadiah menarik"
 *                 type:
 *                   type: string
 *                   description: Tipe item
 *                   enum: [equipment, consumable, material]
 *                   example: "equipment"
 *                 base_price:
 *                   type: integer
 *                   description: Harga dasar item
 *                   example: 10
 *     responses:
 *      201:
 *        description: item berhasil dibuat
 *      400:
 *        description: Bad Request, data tidak valid atau tidak lengkap
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * /api/admin/item/updateItem/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Mengupdate data item
 *     description: Endpoint untuk mengupdate data item yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID item yang ingin diupdate
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nama item
 *                   example: "long Sword"
 *                 description:
 *                   type: string
 *                   description: Deskripsi item
 *                   example: "item untuk season 3 dengan berbagai hadiah menarik"
 *                 type:
 *                   type: string
 *                   description: Tipe item
 *                   enum: [equipment, consumable, material]
 *                   example: "equipment"
 *                 base_price:
 *                   type: integer
 *                   description: Harga dasar item
 *                   example: 10
 *     responses:
 *      201:
 *        description: item berhasil dibuat
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
 * /api/admin/item/deleteItem/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Menghapus data item
 *     description: Endpoint untuk menghapus data item yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID item yang ingin dihapus
 *     responses:
 *      200:
 *        description: item berhasil dihapus
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      404:
 *        description: Not found, item tidak ditemukan
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * 
 */