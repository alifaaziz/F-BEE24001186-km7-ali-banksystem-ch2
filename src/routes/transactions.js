const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Operations about transactions
 */

/**
 * @route POST /transactions
 * @group Transactions - Operations about transactions
 * @param {object} transaction.body.required - Transaction object
 * @param {string} transaction.body.sourceAccountId.required - ID of the source account
 * @param {string} transaction.body.destinationAccountId.required - ID of the destination account
 * @param {number} transaction.body.amount.required - Amount to transfer
 * @returns {object} 201 - Created transaction
 * @returns {Error}  default - Unexpected error
 * @example { "sourceAccountId": "1", "destinationAccountId": "2", "amount": 1000 }
 */
router.post('/', transactionController.createTransaction);

/**
 * @route GET /transactions
 * @group Transactions - Operations about transactions
 * @returns {Array.<object>} 200 - An array of transactions
 * @returns {Error}  default - Unexpected error
 * @example { "transactions": [{ "id": 1, "sourceAccountId": "1", "destinationAccountId": "2", "amount": 1000, "date": "2024-10-29T12:00:00Z", "sourceAccount": { "id": "1", "bankAccountNumber": "123456789" }, "destinationAccount": { "id": "2", "bankAccountNumber": "987654321" } }] }
 */
router.get('/', transactionController.getAllTransactions);

/**
 * @route GET /transactions/{transactionId}
 * @group Transactions - Operations about transactions
 * @param {string} transactionId.path.required - ID of the transaction to fetch
 * @returns {object} 200 - Transaction details
 * @returns {Error}  404 - Transaction not found
 * @returns {Error}  default - Unexpected error
 * @example { "transactionId": "1" }
 * @example { "id": 1, "sourceAccountId": "1", "destinationAccountId": "2", "amount": 1000, "date": "2024-10-29T12:00:00Z", "sourceAccount": { "id": "1", "bankAccountNumber": "123456789" }, "destinationAccount": { "id": "2", "bankAccountNumber": "987654321" } }
 */
router.get('/:transactionId', transactionController.getTransactionById);

module.exports = router;