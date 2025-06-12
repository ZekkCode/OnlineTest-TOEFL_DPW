// Contoh: panggil showCertificateModal(data) saat klik tombol cetak di tabel
document.querySelectorAll('.btn-certificate').forEach(btn => {
    btn.addEventListener('click', function() {
        // Ambil data tes dari atribut/data-* atau dari JS
        const testData = {
            name: localStorage.getItem('username') || 'Nama Pengguna',
            email: localStorage.getItem('userEmail') || '-',
            photo: localStorage.getItem('userPhoto') || '/assets/images/guest-profile.png',
            listening: btn.dataset.listening || 0,
            structure: btn.dataset.structure || 0,
            reading: btn.dataset.reading || 0,
            total: btn.dataset.total || 0,
            date: btn.dataset.date || new Date().toLocaleDateString('id-ID')
        };
        showCertificateModal(testData);
    });
});

// Fungsi untuk generate sertifikat
function showCertificateModal(data) {
    const modal = document.getElementById('certificateModal');
    const preview = document.getElementById('certificatePreview');
    preview.innerHTML = `
        <div class="certificate-frame"></div>
        <svg class="certificate-corner top-left" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" stroke="#b5b5b5"/><circle cx="30" cy="30" r="20" stroke="#4a55a2"/></svg>
        <svg class="certificate-corner top-right" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" stroke="#b5b5b5"/><circle cx="30" cy="30" r="20" stroke="#4a55a2"/></svg>
        <svg class="certificate-corner bottom-left" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" stroke="#b5b5b5"/><circle cx="30" cy="30" r="20" stroke="#4a55a2"/></svg>
        <svg class="certificate-corner bottom-right" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" stroke="#b5b5b5"/><circle cx="30" cy="30" r="20" stroke="#4a55a2"/></svg>
        <div class="certificate-content">
            <img src="/assets/images/toefl-logo.png" style="position:absolute;opacity:0.07;z-index:0;left:50%;top:50%;transform:translate(-50%,-50%);width:400px;">
            <div class="certificate-title">SERTIFIKAT PENCAPAIAN</div>
            <div class="certificate-desc">
                Dengan ini menyatakan bahwa<br>
                <span class="certificate-name">${data.name}</span>
                <div class="certificate-photo" style="margin: 18px auto;">
                    <img src="${data.photo}" alt="Foto Profil">
                </div>
                <span class="certificate-email">${data.email}</span>
                <br>telah menyelesaikan simulasi TOEFL ITP dengan skor berikut:
            </div>
            <table class="certificate-table">
                <tr>
                    <th>Listening Comprehension</th>
                    <td>${data.listening}</td>
                </tr>
                <tr>
                    <th>Structure & Written Expression</th>
                    <td>${data.structure}</td>
                </tr>
                <tr>
                    <th>Reading Comprehension</th>
                    <td>${data.reading}</td>
                </tr>
            </table>
            <div class="certificate-total">Total Skor: ${data.total}</div>
            <div style="margin-top:40px; color:#888; font-size:1rem;">
                Tanggal Tes: ${data.date}
            </div>
            <div class="certificate-sign">
                <div class="sign-label">Disahkan oleh:</div>
                <div class="sign-name" style="margin-top:40px;">TOEL.id</div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// Modal close
document.querySelectorAll('.modal .close').forEach(btn => {
    btn.onclick = function() {
        btn.closest('.modal').style.display = 'none';
    };
});

// Cetak Sertifikat
document.getElementById('btnPrintCert').onclick = function() {
    const cert = document.getElementById('certificatePreview').innerHTML;
    const win = window.open('', '', 'width=900,height=1300');
    win.document.write(`
        <html>
        <head>
            <title>Cetak Sertifikat</title>
            <link rel="stylesheet" href="/css/pages/dashboard/riwayat-tes.css">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0;">
            <div class="certificate-preview" style="box-shadow:none;">${cert}</div>
        </body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
};

// Download PDF (opsional, butuh html2pdf.js)
document.getElementById('btnDownloadPDF').onclick = function() {
    import('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js').then(() => {
        const element = document.getElementById('certificatePreview');
        html2pdf().from(element).set({
            margin: 0,
            filename: 'sertifikat-toefl.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { format: 'a4', orientation: 'portrait' }
        }).save();
    });
};

function scaleCertificatePreview() {
    const wrapper = document.querySelector('.certificate-preview-wrapper');
    const cert = document.querySelector('.certificate-preview');
    if (!wrapper || !cert) return;

    // Ukuran asli sertifikat (A4: 794x1123px)
    const certW = 794, certH = 1123;
    // Ukuran wrapper (modal)
    const wrapW = wrapper.clientWidth, wrapH = wrapper.clientHeight;

    // Hitung skala agar fit (tanpa overflow, tidak lebih kecil dari 0.5)
    let scale = Math.min(wrapW / certW, wrapH / certH, 1);
    scale = Math.max(scale, 0.5); // minimal 50% agar tetap terbaca

    cert.style.transform = `scale(${scale})`;
    cert.style.transformOrigin = 'top center';

    // Agar wrapper tetap scrollable jika modal lebih kecil dari sertifikat
    wrapper.scrollTop = 0;
    wrapper.scrollLeft = 0;
}

// Panggil saat modal dibuka & saat window resize
window.addEventListener('resize', scaleCertificatePreview);
document.addEventListener('DOMContentLoaded', scaleCertificatePreview);
// Panggil juga setelah isi sertifikat di-render
setTimeout(scaleCertificatePreview, 200);

// Media print
const style = document.createElement('style');
style.innerHTML = `
@media print {
    .modal, .modal-content, .modal-actions { display: none !important; }
    .certificate-preview {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
    }
}
`;
document.head.appendChild(style);