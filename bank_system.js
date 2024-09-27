const BankAccount = require('./bank_account');
const prompt = require('prompt-sync')();

(async function simulateBankingSystem() {
    const myAccount = new BankAccount('Binar', 500);

    console.log(myAccount.checkBalance());

    let continueTransaction = true;

    while (continueTransaction){
    try {
        // Tanya pengguna mau deposit atau withdraw
        const action = prompt("Apakah Anda ingin melakukan deposit atau withdraw? (d/w): ");

        // Validasi pilihan pengguna
        if (action !== 'd' && action !== 'w') {
            console.log("Pilihan tidak valid! Masukkan 'd' untuk setoran atau 'w' untuk penarikan.");
            return;
        }

        // Masukkan nominal uang
        const amount = parseFloat(prompt("Masukkan jumlah uang: "));

        if (isNaN(amount) || amount <= 0) {
            console.log("Masukkan jumlah yang valid lebih dari 0.");
            return;
        }

        // Proses transaksi sesuai input pengguna
        if (action === 'd') {
            await myAccount.deposit(amount);
        } else if (action === 'w') {
            await myAccount.withdraw(amount);
        }

        console.log(myAccount.checkBalance());
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
    const anotherTransaction = prompt("Apakah Anda ingin melakukan transaksi lain? (y/n): ");
        if (anotherTransaction.toLowerCase() !== 'y') {
            continueTransaction = false;
            console.log("Terima kasih telah menggunakan layanan kami.");
        }
    }
})();