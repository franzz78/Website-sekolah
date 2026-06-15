import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi Database Firebase Realtime
const firebaseConfig = {
  apiKey: "AIzaSyD9BmV4XKXuMWa4PZHpb7Bbt-rHs61m3lE",
  authDomain: "absensi-polri.firebaseapp.com",
  databaseURL: "https://absensi-polri-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "absensi-polri",
  storageBucket: "absensi-polri.firebasestorage.app",
  messagingSenderId: "19006760644",
  appId: "1:19006760644:web:b7dac0410e47877ded4b91",
  measurementId: "G-82KHRYZBN0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// PASSWORD CONFIGURATION
const PASSWORD_SISTEM = "SDN1SUSUKANAGUNGKABUPATENCIREBON##2026-2027";

// ================= POPUP LOGIN INTERAKSI =================
const btnBukaLogin = document.getElementById('btn-buka-login-admin');
const overlayLogin = document.getElementById('admin-login-overlay');
const btnCloseLogin = document.getElementById('btn-close-login');
const btnSubmitLogin = document.getElementById('btn-submit-login');
const panelDashboard = document.getElementById('admin-panel-dashboard');
const btnLogoutAdmin = document.getElementById('btn-logout-admin');

btnBukaLogin.addEventListener('click', () => overlayLogin.classList.remove('hidden-element'));
btnCloseLogin.addEventListener('click', () => overlayLogin.classList.add('hidden-element'));

btnSubmitLogin.addEventListener('click', () => {
    const inputPass = document.getElementById('admin-password-input').value;
    if(inputPass === PASSWORD_SISTEM) {
        document.getElementById('login-error').style.display = 'none';
        overlayLogin.classList.add('hidden-element');
        panelDashboard.classList.remove('hidden-element');
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

btnLogoutAdmin.addEventListener('click', () => {
    document.getElementById('admin-password-input').value = '';
    panelDashboard.classList.add('hidden-element');
});

// BACKGROUND SETTING (HITAM / PUTIH) PANEL ADMIN
document.getElementById('btn-toggle-theme').addEventListener('click', () => {
    panelDashboard.classList.toggle('dark-mode-active');
});

// ================= READ REALTIME DATA UNTUK HALAMAN DEPAN =================

// Cek Buka Tutup Akses Website
onValue(ref(db, 'status_akses'), snapshot => {
    const status = snapshot.val();
    const lockScreen = document.getElementById('lock-screen');
    if(status === 'tutup') lockScreen.classList.remove('hidden');
    else lockScreen.classList.add('hidden');
});

// Load Teks Profil Utama (Tentang, Sejarah, Operator, Penjaga)
onValue(ref(db, 'profil_sekolah'), snapshot => {
    const data = snapshot.val();
    if(data) {
        document.getElementById('view-tentang').innerText = data.tentang || 'Belum diisi.';
        document.getElementById('view-sejarah').innerText = data.sejarah || 'Belum diisi.';
        document.getElementById('view-operator').innerText = data.operator || '-';
        document.getElementById('view-penjaga').innerText = data.penjaga || '-';
        
        // Pasang isi teks ke Form Input Admin agar mudah di-edit ulang
        document.getElementById('input-admin-tentang').value = data.tentang || '';
        document.getElementById('input-admin-sejarah').value = data.sejarah || '';
        document.getElementById('input-admin-operator').value = data.operator || '';
        document.getElementById('input-admin-penjaga').value = data.penjaga || '';
    }
});

// Load Mata Pelajaran Halaman Depan
onValue(ref(db, 'mapel'), snapshot => {
    const container = document.getElementById('container-mapel'); container.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            container.innerHTML += `<li>${data[key].nama}</li>`;
        });
    }
});

// Load Prestasi Juara Lomba
onValue(ref(db, 'prestasi'), snapshot => {
    const container = document.getElementById('container-prestasi'); container.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            container.innerHTML += `
                <div class="announcement-item" style="border-left: 4px solid #ffc107; margin-bottom: 10px;">
                    <strong><i class="fa fa-trophy" style="color:#ffc107;"></i> ${data[key].lomba}</strong>
                    <p style="font-size:13px; margin-top:2px;">Siswa Juara: ${data[key].pemenang}</p>
                </div>`;
        });
    }
});

// Load Foto Kegiatan & Galeri Utama
onValue(ref(db, 'galeri'), snapshot => {
    const container = document.getElementById('container-galeri'); container.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            container.innerHTML += `
                <div class="gallery-card">
                    <img src="${data[key].gambar}" alt="Galeri">
                    <div style="padding:10px; font-size:12px;"><b>${data[key].judul}</b><br><small style="color:gray;">${data[key].tipe}</small></div>
                </div>`;
        });
    }
});

// Load Struktur Data Guru & Kepala Sekolah beserta Foto Komponen
onValue(ref(db, 'guru'), snapshot => {
    const containerGuru = document.getElementById('container-guru'); containerGuru.innerHTML = '';
    const containerKepsek = document.getElementById('container-kepsek'); containerKepsek.innerHTML = '';
    const data = snapshot.val();
    let totalGuru = 0;
    
    if(data) {
        Object.keys(data).forEach(key => {
            totalGuru++;
            const item = data[key];
            const cardMarkup = `
                <div class="profile-card">
                    <img src="${item.foto || 'https://via.placeholder.com/150'}" style="width:100px; height:100px; object-fit:cover; border-radius:50%; margin-bottom:8px; border:2px solid #8B0000;">
                    <br><strong>${item.nama}</strong><br>
                    <span class="tag-role">${item.peran}</span>
                    <p style="font-size:12px; color:#555; margin-top:5px;">Mapel: <b>${item.mapel || '-'}</b></p>
                </div>`;
            
            if(item.peran === 'Kepala Sekolah') containerKepsek.innerHTML = cardMarkup;
            else containerGuru.innerHTML += cardMarkup;
        });
    }
    document.getElementById('stat-guru').innerText = totalGuru;
});

// Filter Lihat Nilai Per-Kelas (1 s/d 6)
const selectViewKelas = document.getElementById('select-view-kelas');
function fetchNilaiPublic() {
    const kelas = selectViewKelas.value;
    const tbody = document.getElementById('tbody-view-siswa'); tbody.innerHTML = '';
    onValue(ref(db, `kelas/${kelas}`), snapshot => {
        tbody.innerHTML = '';
        const data = snapshot.val();
        let hitungSiswa = 0;
        if(data) {
            Object.keys(data).forEach(key => {
                hitungSiswa++;
                tbody.innerHTML += `
                    <tr>
                        <td>${data[key].nama}</td>
                        <td>${data[key].mapel}</td>
                        <td><b style="color:#8B0000;">${data[key].nilai}</b></td>
                    </tr>`;
            });
        }
    });
}
selectViewKelas.addEventListener('change', fetchNilaiPublic);
fetchNilaiPublic();


// ================= WRITE / MANAJEMEN INPUT PANEL ADMINISTRATOR =================

// 1. Simpan Status Buka Tutup Akses
document.getElementById('save-status-akses').addEventListener('click', () => {
    set(ref(db, 'status_akses'), document.getElementById('select-status-akses').value)
        .then(() => alert('Status operasional web diperbarui!'));
});

// 2. Simpan Tentang & Sejarah Sekolah
document.getElementById('save-profil-teks').addEventListener('click', () => {
    set(ref(db, 'profil_sekolah/tentang'), document.getElementById('input-admin-tentang').value);
    set(ref(db, 'profil_sekolah/sejarah'), document.getElementById('input-admin-sejarah').value)
        .then(() => alert('Teks Informasi Sekolah Berhasil Di-update!'));
});

// 3. Simpan Nama Operator & Penjaga
document.getElementById('save-staff-lain').addEventListener('click', () => {
    set(ref(db, 'profil_sekolah/operator'), document.getElementById('input-admin-operator').value);
    set(ref(db, 'profil_sekolah/penjaga'), document.getElementById('input-admin-penjaga').value)
        .then(() => alert('Nama Staff Selesai Diperbarui!'));
});

// 4. Tambah & Hapus Mapel
document.getElementById('add-admin-mapel').addEventListener('click', () => {
    const nama = document.getElementById('input-admin-mapel').value;
    if(nama) { push(ref(db, 'mapel'), { nama }); document.getElementById('input-admin-mapel').value = ''; }
});
onValue(ref(db, 'mapel'), snapshot => {
    const div = document.getElementById('admin-list-mapel'); div.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            div.innerHTML += `<div class="admin-item-row">${data[key].nama} <button class="btn-danger" onclick="globalDeleteData('mapel/${key}')">Hapus</button></div>`;
        });
    }
});

// 5. Tambah & Hapus Prestasi Siswa
document.getElementById('add-prestasi').addEventListener('click', () => {
    const lomba = document.getElementById('input-prestasi-nama').value;
    const pemenang = document.getElementById('input-prestasi-pemenang').value;
    if(lomba) {
        push(ref(db, 'prestasi'), { lomba, pemenang });
        document.getElementById('input-prestasi-nama').value = '';
        document.getElementById('input-prestasi-pemenang').value = '';
    }
});
onValue(ref(db, 'prestasi'), snapshot => {
    const div = document.getElementById('admin-list-prestasi'); div.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            div.innerHTML += `<div class="admin-item-row">${data[key].lomba} (${data[key].pemenang}) <button class="btn-danger" onclick="globalDeleteData('prestasi/${key}')">Hapus</button></div>`;
        });
    }
});

// 6. Tambah & Hapus Guru / Kepala Sekolah (Kelola Gambar & Nama)
document.getElementById('add-guru').addEventListener('click', () => {
    const nama = document.getElementById('input-guru-nama').value;
    const peran = document.getElementById('select-guru-peran').value;
    const mapel = document.getElementById('input-guru-mapel').value;
    const foto = document.getElementById('input-guru-foto').value;
    if(nama) {
        push(ref(db, 'guru'), { nama, peran, mapel, foto });
        alert('Data guru tersimpan!');
    }
});
onValue(ref(db, 'guru'), snapshot => {
    const div = document.getElementById('admin-list-guru'); div.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            div.innerHTML += `<div class="admin-item-row">${data[key].nama} - ${data[key].peran} <button class="btn-danger" onclick="globalDeleteData('guru/${key}')">Hapus</button></div>`;
        });
    }
});

// 7. Tambah & Hapus Menu Tampilan Gallery / Foto Kegiatan
document.getElementById('add-galeri').addEventListener('click', () => {
    const tipe = document.getElementById('select-galeri-menu').value;
    const judul = document.getElementById('input-galeri-judul').value;
    const gambar = document.getElementById('input-galeri-foto').value;
    if(gambar) {
        push(ref(db, 'galeri'), { tipe, judul, gambar }).then(() => alert('Gambar terkirim ke database!'));
    }
});
onValue(ref(db, 'galeri'), snapshot => {
    const div = document.getElementById('admin-list-galeri'); div.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            div.innerHTML += `<div class="admin-item-row">${data[key].judul} (${data[key].tipe}) <button class="btn-danger" onclick="globalDeleteData('galeri/${key}')">Hapus</button></div>`;
        });
    }
});

// 8. Tambah & Hapus Akses Username Guru
document.getElementById('add-akses-guru').addEventListener('click', () => {
    const user = document.getElementById('input-akses-username').value;
    if(user) { push(ref(db, 'akses_guru'), { username: user }); document.getElementById('input-akses-username').value = ''; }
});
onValue(ref(db, 'akses_guru'), snapshot => {
    const div = document.getElementById('admin-list-akses-guru'); div.innerHTML = '';
    const data = snapshot.val();
    if(data) {
        Object.keys(data).forEach(key => {
            div.innerHTML += `<div class="admin-item-row">${data[key].username} <button class="btn-danger" onclick="globalDeleteData('akses_guru/${key}')">Hapus</button></div>`;
        });
    }
});

// 9. Tambah & Hapus Kelola Nilai Per Kelas (Kelas 1 - Kelas 6)
document.getElementById('add-siswa-nilai').addEventListener('click', () => {
    const kelas = document.getElementById('select-input-kelas').value;
    const nama = document.getElementById('input-siswa-nama').value;
    const mapel = document.getElementById('input-siswa-mapel').value;
    const nilai = document.getElementById('input-siswa-nilai').value;
    if(nama && nilai) {
        push(ref(db, `kelas/${kelas}`), { nama, mapel, nilai });
        document.getElementById('input-siswa-nama').value = '';
    }
});

// Pantau isi tabel nilai di dashboard admin saat dropdown kelas admin berubah
const selectInputKelas = document.getElementById('select-input-kelas');
function renderTabelAdminKelas() {
    const kelas = selectInputKelas.value;
    const divList = document.getElementById('admin-list-siswa');
    onValue(ref(db, `kelas/${kelas}`), snapshot => {
        divList.innerHTML = '';
        const data = snapshot.val();
        if(data) {
            Object.keys(data).forEach(key => {
                divList.innerHTML += `<div class="admin-item-row">${data[key].nama} (${data[key].nilai}) <button class="btn-danger" onclick="globalDeleteData('kelas/${kelas}/${key}')">Hapus</button></div>`;
            });
        }
    });
}
selectInputKelas.addEventListener('change', renderTabelAdminKelas);
renderTabelAdminKelas();

// Fungsi Hapus Global melalui Dashboard Admin
window.globalDeleteData = function(path) {
    if(confirm("Apakah Anda yakin ingin menghapus aset data teks/foto ini?")) {
        remove(ref(db, path));
    }
};

// Pengisi Statik Default Konstan Luar
onValue(ref(db, 'statistik/siswa'), s => document.getElementById('stat-siswa').innerText = s.val() || 120);
onValue(ref(db, 'statistik/staff'), s => document.getElementById('stat-staff').innerText = s.val() || 6);
        
