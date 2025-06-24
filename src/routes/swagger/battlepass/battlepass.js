/**
 * @swagger
 * 
 * /api/battlepass/available:
 *   get:
 *     summary: mengambil daftar battlepass yang tersedia 
 *     description: Mengambil daftar battlepass yang tersedia untuk user beli
 *     tags: [Battlepass]
 *     responses:
 *       200:
 *         description: Daftar battlepass berhasil diambil
 *       404:
 *         description: Tidak ada battlepass yang tersedia
 *       500:
 *         description: Terjadi kesalahan saat mengambil data battlepass
 * 
 * 
 * /api/battlepass/{battlepass_id}/activate:
 *   post:
 *     summary: mengaktifkan battlepass untuk user
 *     description: Mengaktifkan battlepass untuk user tertentu berdasarkan ID battlepass
 *     security:
 *      - BearerAuth: []
 *     tags: [Battlepass]
 *     parameters:
 *       - in: path
 *         name: battlepass_id
 *         required: true
 *         description: ID battlepass yang ingin diaktifkan
 * 
 *     responses:
 *       200:
 *         description: Battlepass berhasil diaktifkan
 *       404:
 *         description: Battlepass tidak ditemukan atau tidak tersedia
 *       409:
 *         description: Profile sudah memiliki battlepass yang sama
 *       500:
 *         description: Terjadi kesalahan saat mengaktifkan battlepass
 * 
 * 
 * /api/battlepass/active/quests:
 *   get:
 *     summary: mengambil daftar quest aktif battlepass
 *     description: Mengambil daftar quest aktif battlepass untuk user
 *     security:
 *      - BearerAuth: []
 *     tags: [Battlepass]
 *     responses:
 *       200:
 *        description: Daftar quest aktif battlepass berhasil diambil
 *       404:
 *         description: Tidak ada quest aktif battlepass yang ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil data quest aktif battlepass
 *       
 *
 * 
 *
 * 
 * 
 */