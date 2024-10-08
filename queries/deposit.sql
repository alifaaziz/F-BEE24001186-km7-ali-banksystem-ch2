UPDATE accounts
SET balance = balance + 200 
WHERE id_account = 1;

INSERT INTO transactions (id_account, transaction_type, amount)
VALUES (1,'deposit', 200);