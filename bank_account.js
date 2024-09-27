class BankAccount {
    constructor(owner, balance = 0) {
        this.owner = owner;
        this.balance = balance;
    }

    async deposit(amount) {
        return new Promise((resolve, reject) => {
            if (amount <= 0) {
                reject(new Error("Jumlah yang disetor harus lebih dari 0"));
            } else {
                console.log(`Menyetor ${amount} ke akun ${this.owner}...`);
                setTimeout(() => {
                    this.balance += amount;
                    console.log(`Setoran berhasil! Saldo baru: ${this.balance}`);
                    resolve(this.balance);
                }, 2000);
            }
        });
    }

    async withdraw(amount) {
        return new Promise((resolve, reject) => {
            console.log(`Menarik ${amount} dari akun ${this.owner}...`);
            setTimeout(() => {
                if (amount > this.balance) {
                    reject(new Error('Saldo tidak mencukupi!'));
                } else if (amount <= 0) {
                    reject(new Error('Jumlah penarikan harus lebih dari 0'));
                } else {
                    this.balance -= amount;
                    console.log(`Penarikan berhasil! Saldo baru: ${this.balance}`);
                    resolve(this.balance);
                }
            }, 2000);
        });
    }

    checkBalance() {
        return `Saldo akun untuk ${this.owner}: ${this.balance}`;
    }
}

module.exports = BankAccount;