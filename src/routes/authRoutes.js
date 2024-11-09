const express = require('express');
const router = express.Router();
const { register, login, whoAmI } = require('../controllers/authController');
const restrict = require('../middlewares/restrict');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operations about user authentication
 */

/**
 * @route POST /auth/register
 * @group Auth - Operations about user authentication
 * @param {object} user.body.required - User registration object
 * @param {string} user.body.name.required - Name of the user
 * @param {string} user.body.email.required - Email of the user
 * @param {string} user.body.password.required - Password of the user
 * @param {object} user.body.profile.required - User profile details
 * @param {string} user.body.profile.identityType.required - Identity type (e.g., ID card)
 * @param {string} user.body.profile.identityNumber.required - Identity number
 * @param {string} user.body.profile.address.required - User address
 * @returns {object} 201 - Created user object
 * @returns {Error}  default - Unexpected error
 * @example { 
 *   "name": "John Doe", 
 *   "email": "johndoe@example.com", 
 *   "password": "password123", 
 *   "profile": { 
 *     "identityType": "ID Card", 
 *     "identityNumber": "1234567890", 
 *     "address": "123 Main St, City" 
 *   } 
 * }
 */
router.post('/register', register);

/**
 * @route POST /auth/login
 * @group Auth - Operations about user authentication
 * @param {object} user.body.required - User login object
 * @param {string} user.body.email.required - Email of the user
 * @param {string} user.body.password.required - Password of the user
 * @returns {object} 200 - JWT token for authenticated user
 * @returns {Error}  default - Unexpected error
 * @example { "email": "johndoe@example.com", "password": "password123" }
 */
router.post('/login', login);

/**
 * @route GET /auth/whoami
 * @group Auth - Operations about user authentication
 * @returns {object} 200 - Authenticated user details
 * @returns {Error}  404 - User not found
 * @returns {Error}  default - Unexpected error
 */
router.get('/whoami', restrict, whoAmI);

module.exports = router;