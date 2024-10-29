const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Operations about bank accounts
 */

/**
 * @route POST /accounts
 * @group Accounts - Operations about bank accounts
 * @param {object} account.body.required - Account object
 * @param {string} account.body.userId.required - ID of the user owning the account
 * @param {string} account.body.bankName.required - Name of the bank
 * @param {string} account.body.bankAccountNumber.required - Bank account number
 * @returns {object} 201 - Created account
 * @returns {Error}  default - Unexpected error
 * @example { "userId": "1", "bankName": "Bank ABC", "bankAccountNumber": "1234567890" }
 */
router.post('/', accountController.createAccount);

/**
 * @route GET /accounts
 * @group Accounts - Operations about bank accounts
 * @returns {Array.<object>} 200 - An array of bank accounts
 * @returns {Error}  default - Unexpected error
 * @example { "accounts": [{ "id": 1, "userId": "1", "bankName": "Bank ABC", "bankAccountNumber": "1234567890", "balance": 0 }] }
 */
router.get('/', accountController.getAllAccounts);

/**
 * @route GET /accounts/{accountId}
 * @group Accounts - Operations about bank accounts
 * @param {string} accountId.path.required - ID of the account to fetch
 * @returns {object} 200 - Account details
 * @returns {Error}  404 - Account not found
 * @returns {Error}  default - Unexpected error
 * @example { "accountId": "1" }
 * @example { "id": 1, "userId": "1", "bankName": "Bank ABC", "bankAccountNumber": "1234567890", "balance": 0 }
 */
router.get('/:accountId', accountController.getAccountById);

/**
 * @route POST /accounts/deposit
 * @group Accounts - Operations about bank accounts
 * @param {object} deposit.body.required - Deposit object
 * @param {string} deposit.body.accountId.required - ID of the account to deposit into
 * @param {number} deposit.body.amount.required - Amount to deposit
 * @returns {object} 200 - Updated account with new balance
 * @returns {Error}  default - Unexpected error
 * @example { "accountId": "1", "amount": 1000 }
 */
router.post('/deposit', accountController.deposit);

/**
 * @route POST /accounts/withdraw
 * @group Accounts - Operations about bank accounts
 * @param {object} withdraw.body.required - Withdraw object
 * @param {string} withdraw.body.accountId.required - ID of the account to withdraw from
 * @param {number} withdraw.body.amount.required - Amount to withdraw
 * @returns {object} 200 - Updated account with new balance
 * @returns {Error}  default - Unexpected error
 * @example { "accountId": "1", "amount": 500 }
 */
router.post('/withdraw', accountController.withdraw);

module.exports = router;