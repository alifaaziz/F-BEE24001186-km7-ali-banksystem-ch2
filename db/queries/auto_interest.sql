-- Fungsi untuk menambahkan bunga ke akun investasi
WITH updated_balance AS (
    UPDATE accounts
    SET balance = balance + (balance * 0.02)
    WHERE account_type = 'invest'
)
INSERT INTO transactions (id_account, transaction_type, amount, date)
SELECT id_account, 'interest', (balance * 0.02), NOW()
FROM updated_balance;