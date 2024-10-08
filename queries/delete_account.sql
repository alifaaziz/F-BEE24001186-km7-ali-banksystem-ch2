-- Menghapus akun dan transaksi terkait
WITH deleted_transactions AS (
    DELETE FROM transactions
    WHERE id_account = (SELECT id_account FROM accounts WHERE id_account = 1)
)
DELETE FROM accounts
WHERE id_account = 1;
