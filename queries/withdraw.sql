-- Fungsi untuk menarik dana
UPDATE accounts
SET balance = balance - 50
WHERE id_account = 1;

INSERT INTO transactions (id_account, transaction_type, amount)
VALUES (1,'withdraw', 50);