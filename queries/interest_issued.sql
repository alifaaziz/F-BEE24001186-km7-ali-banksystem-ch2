SELECT 
    a.id_account,
    a.username,
    t.transaction_type,
    t.amount,
    t.date
FROM 
    accounts a
INNER JOIN 
    transactions t ON a.id_account = t.id_account
WHERE 
    t.transaction_type = 'interest'
ORDER BY 
    t.date DESC;