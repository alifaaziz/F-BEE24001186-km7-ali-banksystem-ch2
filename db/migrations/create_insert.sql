-- Menghapus tabel jika sudah ada
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers;

-- Membuat tabel customers dengan first_name dan last_name
CREATE TABLE customers (
    id_customer SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

-- Membuat tabel accounts
CREATE TABLE accounts (
    id_account SERIAL PRIMARY KEY,
    id_customer INT NOT NULL,
    account_type VARCHAR(10) CHECK (account_type IN ('invest', 'regular')),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (id_customer) REFERENCES customers(id_customer) ON DELETE CASCADE
);

-- Membuat tabel transactions
CREATE TABLE transactions (
    id_transaction SERIAL PRIMARY KEY,
    id_account INT NOT NULL,
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('deposit', 'withdraw', 'interest')),
    amount DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_account) REFERENCES accounts(id_account) ON DELETE CASCADE
);

-- Menambahkan beberapa data ke tabel customers dengan first_name dan last_name
INSERT INTO customers (first_name, last_name) VALUES
('Andi', 'Saputra'),
('Budi', 'Santoso'),
('Cindy', 'Lestari'),
('Diana', 'Puspita'),
('Eko', 'Prabowo'),
('Fani', 'Indira'),
('Gilang', 'Ramadhan'),
('Hanafi', 'Maulana'),
('Intan', 'Putri'),
('Joko', 'Widodo');

-- Menambahkan beberapa data ke tabel accounts dengan password sesuai format firstname123
INSERT INTO accounts (id_customer, account_type, username, password, balance) VALUES
(1, 'regular', 'andi123', 'andi123', 500),
(1, 'invest', 'andi_invest', 'andi123', 500),
(2, 'regular', 'budi123', 'budi123', 500),
(2, 'invest', 'budi_invest', 'budi123', 500),
(3, 'regular', 'cindy123', 'cindy123', 500),
(3, 'invest', 'cindy_invest', 'cindy123', 500),
(4, 'regular', 'diana123', 'diana123', 500),
(5, 'regular', 'eko123', 'eko123', 500),
(6, 'invest', 'fani123', 'fani123', 500),
(7, 'regular', 'gilang123', 'gilang123', 500),
(8, 'invest', 'hanafi123', 'hanafi123', 500),
(9, 'regular', 'intan123', 'intan123', 500),
(10, 'invest', 'joko123', 'joko123', 500);

-- Menambahkan beberapa data ke tabel transactions
INSERT INTO transactions (id_account, transaction_type, amount) VALUES
(1, 'deposit', 500),
(1, 'withdraw', 200),
(2, 'deposit', 1000),
(3, 'withdraw', 100),
(4, 'deposit', 300),
(5, 'withdraw', 150),
(6, 'deposit', 600),
(7, 'withdraw', 50),
(8, 'deposit', 200),
(9, 'withdraw', 100),
(10, 'deposit', 700);