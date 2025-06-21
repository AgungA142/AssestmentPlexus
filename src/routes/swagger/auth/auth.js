/**]
 * @swagger
 * 
 * /api/auth/register:
 *   post:
 *     tags: ['Authentication and User']
 *     summary: Registrasi akun user
 *     description: Endpoint untuk registrasi akun user baru untuk role name hanya bisa admin dan player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               role_name:
 *                 type: string
 *                 example: player
 *
 *     responses:
 *      201:
 *        description: registrasi akun berhasil
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 * 
 * 
 * 
 * /api/auth/login:
 *   post:
 *     tags: ['Authentication and User']
 *     summary: endpoint untuk login user
 *     description: Endpoint untuk login user dengan email dan password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *      200:
 *        description: login berhasil
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 * 
 *
 * 
 * 
 * /api/auth/logout:
 *   post:
 *     tags: ['Authentication and User']
 *     summary: endpoint untuk logout user
 *     description: Endpoint untuk logout user dengan menghapus token dari header Authorization
 *     security:
 *       - BearerAuth: []
 *     responses:
 *      200:
 *        description: logout berhasil
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 * 
 * 
 * 
 */