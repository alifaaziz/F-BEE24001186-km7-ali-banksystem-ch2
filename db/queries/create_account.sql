-- Fungsi untuk menambah akun baru
INSERT INTO accounts (id_customer, account_type, username, password, balance, created_at, updated_at)
VALUES (
    11,
    'invest',
    'john_invest',
    'johndoeinvest123',
    0,
    NOW(),
    NOW()
);
