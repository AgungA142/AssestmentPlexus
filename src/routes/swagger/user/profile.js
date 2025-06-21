/**
 * @swagger
 * 
 * /api/user/get-profile:
 *   get:
 *     tags: ['Authentication and User']
 *     summary: Mendapatkan profil user
 *     description: Endpoint untuk mendapatkan data profil user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *      200:
 *        description: Berhasil mendapatkan profil user
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 * 
 * /api/user/create-profile:
 *   post:
 *     tags: ['Authentication and User']
 *     summary: Membuat profil user
 *     description: Endpoint untuk membuat profil user baru
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 * 
 *     responses:
 *      201:
 *        description: Berhasil membuat profil user
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 * 
 */