import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi Firebase milikmu
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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 1. COUNTER STATISTIK LIVE
function loadStatistics() {
    onValue(ref(db, 'statistik'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('stat-siswa').innerText = data.siswa || 0;
            document.getElementById('stat-guru').innerText = data.guru || 0;
            document.getElementById('stat-staff').innerText = data.staff || 0;
            document.getElementById('stat-ekskul').innerText = data.ekskul || 0;
        }
    });
}

// 2. DATA ARTIKEL & SIDEBAR POPULER
function loadArticles() {
    const containerArtikel = document.getElementById('container-artikel');
    const containerPopuler = document.getElementById('container-populer');

    onValue(ref(db, 'artikel'), (snapshot) => {
        containerArtikel.innerHTML = '';
        containerPopuler.innerHTML = '';
        const data = snapshot.val();
        
        if (data) {
            Object.keys(data).forEach((key) => {
                const item = data[key];
                containerArtikel.innerHTML += `
                    <div class="article-card">
                        <img src="${item.gambar || 'https://via.placeholder.com/600x400'}" alt="Gambar">
                        <div class="article-info">
                            <span style="color:red; font-size:12px; font-weight:bold;">${item.kategori || 'Berita'}</span>
                            <h3 style="margin:5px 0; font-size:16px;">${item.judul}</h3>
                            <p style="font-size:13px; color:#666; line-height:1.4;">${item.ringkasan || ''}</p>
                        </div>
                    </div>
                `;

                containerPopuler.innerHTML += `
                    <li>
                        <a href="#" style="text-decoration:none; color:#333; font-weight:500; font-size:14px;">${item.judul}</a>
                        <div style="font-size:11px; color:#aaa; margin-top:3px;"><i class="fa fa-calendar"></i> ${item.tanggal || ''}</div>
                    </li>
                `;
            });
        } else {
            containerArtikel.innerHTML = '<p class="loading">Belum ada artikel terbaru.</p>';
        }
    });
}

// 3. DATA PENGUMUMAN
function loadAnnouncements() {
    const container = document.getElementById('container-pengumuman');
    onValue(ref(db, 'pengumuman'), (snapshot) => {
        container.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((key) => {
                const item = data[key];
                container.innerHTML += `
                    <div class="announcement-item">
                        <h4 style="color:#8B0000; font-size:16px;">${item.judul}</h4>
                        <small style="color:#999;"><i class="fa fa-calendar"></i> ${item.tanggal}</small>
                        <p style="margin-top:8px; font-size:13px; color:#444;">${item.isi}</p>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p class="loading">Belum ada pengumuman.</p>';
        }
    });
}

// 4. DATA GALERI FOTO
function loadGallery() {
    const container = document.getElementById('container-galeri');
    onValue(ref(db, 'galeri'), (snapshot) => {
        container.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((key) => {
                const item = data[key];
                container.innerHTML += `
                    <div class="gallery-card">
                        <img src="${item.gambar || 'https://via.placeholder.com/400x300'}" alt="Event">
                        <div class="gallery-meta">
                            <strong>${item.judul}</strong>
                            <div style="color:#bbb; font-size:11px; margin-top:4px;">${item.tanggal}</div>
                        </div>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p class="loading">Belum ada galeri foto.</p>';
        }
    });
}

// 5. DATA GURU & STAFF
function loadProfiles() {
    const containerGuru = document.getElementById('container-guru');
    const containerStaff = document.getElementById('container-staff');

    // Load Guru
    onValue(ref(db, 'guru'), (snapshot) => {
        containerGuru.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((key) => {
                const item = data[key];
                containerGuru.innerHTML += `
                    <div class="profile-card">
                        <div class="avatar-circle"><i class="fa fa-user"></i></div>
                        <strong>${item.nama}</strong><br>
                        <span class="tag-role">guru</span>
                        <div class="profile-details">
                            <p><b>Nomor Induk:</b> ${item.nip || '-'}</p>
                            <p><b>Tgl Lahir:</b> ${item.tanggal_lahir || '-'}</p>
                            <p><b>Jenis Kelamin:</b> ${item.jk || '-'}</p>
                            <p><b>Alamat:</b> ${item.alamat || '-'}</p>
                            <p><b>No HP:</b> ${item.hp || '-'}</p>
                        </div>
                    </div>
                `;
            });
        }
    });

    // Load Staff
    onValue(ref(db, 'staff'), (snapshot) => {
        containerStaff.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((key) => {
                const item = data[key];
                containerStaff.innerHTML += `
                    <div class="profile-card">
                        <div class="avatar-circle"><i class="fa fa-user-gear"></i></div>
                        <strong>${item.nama}</strong><br>
                        <span class="tag-role" style="background:#edf2f7; color:#4a5568;">staff</span>
                        <div class="profile-details">
                            <p><b>Nomor Induk:</b> ${item.nip || '-'}</p>
                            <p><b>Tgl Lahir:</b> ${item.tanggal_lahir || '-'}</p>
                            <p><b>Jenis Kelamin:</b> ${item.jk || '-'}</p>
                            <p><b>Alamat:</b> ${item.alamat || '-'}</p>
                            <p><b>No HP:</b> ${item.hp || '-'}</p>
                        </div>
                    </div>
                `;
            });
        }
    });
}

// 6. DATA EKSTRAKURIKULER
function loadEkskul() {
    const container = document.getElementById('container-ekskul');
    onValue(ref(db, 'ekskul'), (snapshot) => {
        container.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((key) => {
                const item = data[key];
                container.innerHTML += `
                    <div class="ekskul-card">
                        <img src="${item.gambar || 'https://via.placeholder.com/150'}" class="ekskul-img" alt="Logo Ekskul">
                        <div class="ekskul-info">
                            <h3 style="color:var(--primary-color);">${item.nama}</h3>
                            <p style="font-size:13px; color:#666; margin-top:5px;">${item.deskripsi}</p>
                            <div class="ekskul-grid-meta">
                                <p><b>Pembina:</b> ${item.pembina}</p>
                                <p><b>Ketua:</b> ${item.ketua}</p>
                                <p><b>Jadwal:</b> ${item.jadwal}</p>
                                <p><b>Lokasi:</b> ${item.lokasi}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    });
}

// DAFTARKAN PWA SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(res => console.log('PWA Service Worker aktif!'))
            .catch(err => console.log('Service Worker gagal', err));
    });
}

// Inisialisasi saat Web Siap
window.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadArticles();
    loadAnnouncements();
    loadGallery();
    loadProfiles();
    loadEkskul();
});
          
