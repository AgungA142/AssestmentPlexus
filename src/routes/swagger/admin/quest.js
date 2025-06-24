/**
 * @swagger
 * 
 * /api/admin/quest/createQuest:
 *   post:
 *     tags: [Admin]
 *     summary: Membuat data quest baru
 *     description: Endpoint untuk membuat data quest baru. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Judul quest
 *                   example: "raih 2000 score"
 *                 description:
 *                   type: string
 *                   description: Deskripsi quest
 *                   example: "raih 2000 score dalam permainan untuk mendapatkan hadiah"
 *                 quest_type:
 *                   type: string
 *                   description: Tipe quest
 *                   enum: [daily, weekly, monthly, battlepass]
 *                   example: "battlepass"
 *                 objective:
 *                   type: string
 *                   description: Tujuan quest
 *                   example: "raih 2000 score"
 *                 reward_type:
 *                   type: string
 *                   description: Tipe hadiah quest
 *                   enum: [game_currency, item]
 *                   example: "game_currency"
 *                 reward_value:
 *                   type: integer
 *                   description: Nilai hadiah quest
 *                   example: 100
 *                 reward_item_name:
 *                   type: string
 *                   description: Nama item hadiah (jika reward_type adalah item)
 *     responses:
 *      201:
 *        description: quest berhasil dibuat
 *      400:
 *        description: Bad Request, data tidak valid atau tidak lengkap
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * /api/admin/quest/updateQuest/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Mengupdate data quest
 *     description: Endpoint untuk mengupdate data quest yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID quest yang ingin diupdate
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Judul quest
 *                   example: "raih 2000 score"
 *                 description:
 *                   type: string
 *                   description: Deskripsi quest
 *                   example: "raih 2000 score dalam permainan untuk mendapatkan hadiah"
 *                 quest_type:
 *                   type: string
 *                   description: Tipe quest
 *                   enum: [daily, weekly, monthly, battlepass]
 *                   example: "battlepass"
 *                 objective:
 *                   type: string
 *                   description: Tujuan quest
 *                   example: "raih 2000 score"
 *                 reward_type:
 *                   type: string
 *                   description: Tipe hadiah quest
 *                   enum: [game_currency, item]
 *                   example: "game_currency"
 *                 reward_value:
 *                   type: integer
 *                   description: Nilai hadiah quest
 *                   example: 100
 *                 reward_item_name:
 *                   type: string
 *                   description: Nama item hadiah (jika reward_type adalah item)
 *     responses:
 *      201:
 *        description: quest berhasil dibuat
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
 * /api/admin/quest/deleteQuest/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Menghapus data quest
 *     description: Endpoint untuk menghapus data quest yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID quest yang ingin dihapus
 *     responses:
 *      200:
 *        description: quest berhasil dihapus
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      404:
 *        description: Not found, quest tidak ditemukan
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * 
 */