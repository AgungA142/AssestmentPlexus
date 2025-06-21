/**
 * @swagger
 * 
 * 
 * /api/leaderboard/get-leaderboard:
 *   get:
 *     tags: ['Leaderboard and Score']
 *     summary: mengambil data leaderboard
 *     description: mengambil data leaderboard dengan pagination
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: n
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *           description: Jumlah data yang ingin ditampilkan pada leaderboard
 *     responses:
 *       200:
 *         description: Berhasil mengambil data leaderboard
 *       404:
 *         description: Leaderboard tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 * 
 * 
 */