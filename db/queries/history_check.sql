-- Melihat riwayat transaksi untuk akun tertentu
SELECT 
    a.id_account, 
    a.balance, 
    t.transaction_type, 
    t.amount, 
    t.date
FROM 
    accounts a
INNER JOIN 
    transactions t ON a.id_account = t.id_account
WHERE 
    a.id_account = 2;