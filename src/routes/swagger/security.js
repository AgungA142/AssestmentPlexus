/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       schema: bearer
 *       bearerFormat: JWT
 *       name: Authorization
 *       description: |
 *         masukan token JWT pada header Authorization dengan format `Bearer <token>`.
 */