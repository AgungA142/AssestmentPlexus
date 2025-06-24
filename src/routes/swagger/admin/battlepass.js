/**
 * @swagger
 * 
 * /api/admin/battlepass/createBattlepass:
 *   post:
 *     tags: [Admin]
 *     summary: Membuat data battlepass baru
 *     description: Endpoint untuk membuat data battlepass baru. Hanya dapat diakses oleh admin.
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
 *                   description: Nama battlepass
 *                   example: "Battlepass Season 3"
 *                 description:
 *                   type: string
 *                   description: Deskripsi battlepass
 *                   example: "Battlepass untuk season 3 dengan berbagai hadiah menarik"
 *                 start_date:
 *                   type: string
 *                   format: date
 *                   description: Tanggal mulai battlepass
 *                   example: "2023-10-01"
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   description: Tanggal selesai battlepass
 *                   example: "2023-12-31"
 *                 price:
 *                   type: integer
 *                   description: Harga battlepass
 *                   example: 1000
 *                 quest_pool_value:
 *                   type: integer
 *                   description: Nilai untuk banyak quest yang akan ditambahkan ke battlepass
 *                   example: 30
 *                 status:
 *                   type: string
 *                   description: Status battlepass
 *                   enum: [upcoming, in_season, ended]
 *                   example: "upcoming"
 *     responses:
 *      201:
 *        description: Battlepass berhasil dibuat
 *      400:
 *        description: Bad Request, data tidak valid atau tidak lengkap
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * /api/admin/battlepass/updateBattlepass/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Mengupdate data battlepass
 *     description: Endpoint untuk mengupdate data battlepass yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID battlepass yang ingin diupdate
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nama battlepass
 *                   example: "Battlepass Season 3"
 *                 description:
 *                   type: string
 *                   description: Deskripsi battlepass
 *                   example: "Battlepass untuk season 3 dengan berbagai hadiah menarik"
 *                 start_date:
 *                   type: string
 *                   format: date
 *                   description: Tanggal mulai battlepass
 *                   example: "2023-10-01"
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   description: Tanggal selesai battlepass
 *                   example: "2023-12-31"
 *                 price:
 *                   type: integer
 *                   description: Harga battlepass
 *                   example: 1000
 *                 quest_pool_value:
 *                   type: integer
 *                   description: Nilai untuk banyak quest yang akan ditambahkan ke battlepass
 *                   example: 30
 *                 status:
 *                   type: string
 *                   description: Status battlepass
 *                   enum: [upcoming, in_season, ended]
 *                   example: "upcoming"
 *     responses:
 *      201:
 *        description: Battlepass berhasil dibuat
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
 * /api/admin/battlepass/deleteBattlepass/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Menghapus data battlepass
 *     description: Endpoint untuk menghapus data battlepass yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID battlepass yang ingin dihapus
 *     responses:
 *      200:
 *        description: Battlepass berhasil dihapus
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      404:
 *        description: Not found, battlepass tidak ditemukan
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * 
 */