-- Melihat total saldo setiap customer
SELECT 
    c.id_customer, 
    c.first_name, 
    c.last_name,
    SUM(a.balance) AS total_balance
FROM 
    customers c
INNER JOIN 
    accounts a ON c.id_customer = a.id_customer
GROUP BY 
    c.id_customer;