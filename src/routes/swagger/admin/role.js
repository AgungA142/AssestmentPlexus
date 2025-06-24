/**
 * @swagger
 * 
 * /api/admin/role/createRole:
 *   post:
 *     tags: [Admin]
 *     summary: Membuat data role baru
 *     description: Endpoint untuk membuat data role baru. Hanya dapat diakses oleh admin.
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
 *                   description: Nama role
 *                   example: "guest"
 *     responses:
 *      201:
 *        description: role berhasil dibuat
 *      400:
 *        description: Bad Request, data tidak valid atau tidak lengkap
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * /api/admin/role/updateRole/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Mengupdate data role
 *     description: Endpoint untuk mengupdate data role yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID role yang ingin diupdate
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nama role
 *                   example: "guest"
 *     responses:
 *      201:
 *        description: role berhasil dibuat
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
 * /api/admin/role/deleteRole/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Menghapus data role
 *     description: Endpoint untuk menghapus data role yang sudah ada. Hanya dapat diakses oleh admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID role yang ingin dihapus
 *     responses:
 *      200:
 *        description: role berhasil dihapus
 *      401:
 *        description: Unauthorized, token tidak valid atau tidak ada atau role tidak memiliki akses
 *      404:
 *        description: Not found, role tidak ditemukan
 *      500:
 *        description: Internal server error, terjadi kesalahan pada server
 * 
 * 
 * 
 */