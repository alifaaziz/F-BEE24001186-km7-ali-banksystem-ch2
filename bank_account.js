class BankAccount {
    constructor() {
        this.saldo = 0;
    }

    tambahSaldo() {
        let jumlahTambah = parseFloat(window.prompt("Masukkan jumlah saldo yang ingin ditambahkan:"));

        this.saldo += jumlahTambah;

        alert("Saldo baru Anda adalah: " + this.saldo);
        
        let lagi = window.prompt("Apakah Anda ingin menambah saldo lagi? (ya/tidak)");
        if (lagi.toLowerCase() === "ya") {
            this.tambahSaldo();
        }
    }

    kurangiSaldo() {
        let jumlahKurang = parseFloat(window.prompt("Masukkan jumlah saldo yang ingin dikurangi:"));
        
        this.saldo -= jumlahKurang;

        alert("Saldo baru Anda adalah: " + this.saldo);
        
        let lagi = window.prompt("Apakah Anda ingin mengurangi saldo lagi? (ya/tidak)");
        if (lagi.toLowerCase() === "ya") {
            this.kurangiSaldo();
        }
    }
}

const akunSaya = new BankAccount();

akunSaya.tambahSaldo();
akunSaya.kurangiSaldo();