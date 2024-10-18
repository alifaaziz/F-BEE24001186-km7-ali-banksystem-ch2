-- Fungsi untuk menambah nasabah + auto buat akun
INSERT INTO customers (first_name, last_name)
VALUES ('John', 'Doe');

-- Mengambil id_customer yang baru saja ditambahkan
WITH new_customer AS (
    SELECT id_customer
    FROM customers
    ORDER BY id_customer DESC
    LIMIT 1
)
INSERT INTO accounts (id_customer, account_type, username, password, balance, created_at, updated_at)
VALUES (
    (SELECT id_customer FROM new_customer),
    'regular',
    'johndoe123',
    'johndoe123',
    0,
    NOW(),
    NOW()
);
