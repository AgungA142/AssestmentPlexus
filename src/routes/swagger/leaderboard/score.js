/**
 * @swagger
 * 
 * 
 * 
 * /api/score/get-score:
 *  get:
 *    tags: ['Leaderboard and Score']
 *    summary: Mendapatkan skor tertinggi pengguna
 *    description: Mengambil skor tertinggi pengguna berdasarkan ID pengguna
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Berhasil mendapatkan skor tertinggi pengguna
 *      404:
 *        description: Pengguna tidak ditemukan
 *      500:
 *        description: Terjadi kesalahan pada server
 * 
 * 
 * 
 * /api/score/save-highest-score:
 *  post:
 *    tags: ['Leaderboard and Score']
 *    summary: Menyimpan skor tertinggi pengguna
 *    description: Menyimpan skor tertinggi pengguna berdasarkan ID pengguna
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              score:
 *                type: integer
 *                description: Skor tertinggi yang ingin disimpan
 *                example: 100
 * 
 *    responses:
 *      200:
 *        description: Berhasil menyimpan skor tertinggi pengguna
 *      400:
 *        description: Permintaan tidak valid, skor harus berupa angka
 *      404:
 *        description: Pengguna tidak ditemukan
 *      500:
 *        description: Terjadi kesalahan pada server
 * 
 * 
 */