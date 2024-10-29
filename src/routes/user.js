const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations about users
 */

/**
 * @route GET /users
 * @group Users - Operations about users
 * @returns {Array.<object>} 200 - An array of users
 * @returns {Error}  default - Unexpected error
 * @example { "users": [{ "id": 1, "name": "John Doe", "email": "john.doe@example.com" }] }
 */
router.get('/', userController.getUsers);

/**
 * @route GET /users/{userId}
 * @group Users - Operations about users
 * @param {string} userId.path.required - ID of the user to fetch
 * @returns {object} 200 - User details
 * @returns {Error}  404 - User not found
 * @returns {Error}  default - Unexpected error
 * @example { "userId": "1" }
 * @example { "id": 1, "name": "John Doe", "email": "john.doe@example.com" }
 */
router.get('/:userId', userController.getUserById);

module.exports = router;