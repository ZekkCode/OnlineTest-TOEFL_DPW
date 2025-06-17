// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/auth/login';
        return;
    }
    
    displayHistory();
    
    // Setup event listeners
    const modeFilter = document.getElementById('modeFilter');
    const typeFilter = document.getElementById('typeFilter');
    const resetAllBtn = document.getElementById('resetAllBtn');
    
    if (modeFilter) modeFilter.addEventListener('change', displayHistory);
    if (typeFilter) typeFilter.addEventListener('change', displayHistory);
    if (resetAllBtn) resetAllBtn.addEventListener('click', resetAllTestHistories);
});

function displayHistory() {
    const historyTableBody = document.getElementById('historyTableBody');
    const histories = JSON.parse(localStorage.getItem('toeflHistory') || '[]');
    const modeFilter = document.getElementById('modeFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    // Filter data
    let filteredHistories = histories.filter(history => {
        const modeMatch = modeFilter === 'all' || history.mode === modeFilter;
        const typeMatch = typeFilter === 'all' || history.type === typeFilter;
        return modeMatch && typeMatch;
    });

    // Update statistics
    updateStats(histories);
    
    // Clear table
    historyTableBody.innerHTML = '';
    
    // Show message if no data
    if (filteredHistories.length === 0) {
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">Tidak ada data riwayat tes.</td>
            </tr>`;
        return;
    }
    
    // Display filtered data
    filteredHistories.forEach((history, index) => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(history.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Create badges
        const modeBadge = `<span class="badge badge-${history.mode === 'ujian' ? 'primary' : 'warning'}">${history.mode || 'Latihan'}</span>`;
        const typeBadge = `<span class="badge badge-${history.type === 'Full' ? 'success' : 'info'}">${history.type}</span>`;
        const statusBadge = history.status ? 
            `<span class="badge badge-${history.status.includes('Lulus') ? 'success' : 'danger'}">${history.status}</span>` : 
            '-';
        
        row.innerHTML = `
            <td>${date}</td>
            <td>${modeBadge}</td>
            <td>${typeBadge}</td>
            <td>${history.skorL || '-'}</td>
            <td>${history.skorS || '-'}</td>
            <td>${history.skorR || '-'}</td>
            <td>${history.skorITP || '-'}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn-action btn-view" onclick="viewCertificate('${index}')" title="Lihat Sertifikat">
                    <i class="fas fa-certificate"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteTestHistory('${index}')" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        historyTableBody.appendChild(row);
    });
}

function updateStats(histories) {
    // Update total tests
    const totalTests = histories.length;
    document.getElementById('totalTests').textContent = totalTests;
    
    // Get full test scores only
    const fullTests = histories.filter(h => h.type === 'Full');
    
    // Calculate highest score
    const highestScore = fullTests.length > 0 
        ? Math.max(...fullTests.map(h => h.skorITP || 0))
        : 0;
    document.getElementById('highestScore').textContent = highestScore;
    
    // Calculate average score
    const avgScore = fullTests.length > 0
        ? Math.round(fullTests.reduce((sum, h) => sum + (h.skorITP || 0), 0) / fullTests.length)
        : 0;
    document.getElementById('averageScore').textContent = avgScore;
}

function deleteTestHistory(index) {
    if (!confirm('Anda yakin ingin menghapus riwayat tes ini?')) {
        return;
    }
    
    let histories = JSON.parse(localStorage.getItem('toeflHistory') || '[]');
    histories.splice(index, 1);
    localStorage.setItem('toeflHistory', JSON.stringify(histories));
    
    displayHistory();
}

function resetAllTestHistories() {
    if (!confirm('PERHATIAN: Semua data riwayat tes akan dihapus. Lanjutkan?')) {
        return;
    }
    
    if (!confirm('Anda yakin? Tindakan ini tidak dapat dibatalkan.')) {
        return;
    }
    
    localStorage.removeItem('toeflHistory');
    displayHistory();
}

function viewCertificate(index) {
    const histories = JSON.parse(localStorage.getItem('toeflHistory') || '[]');
    const history = histories[index];
    
    if (!history) {
        alert('Data tidak ditemukan');
        return;
    }
    
    const modal = document.getElementById('certificateModal');
    const content = document.getElementById('certificateContent');
    
    // Format date
    const testDate = new Date(history.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Get status
    let status = '';
    if (history.type === 'Full') {
        const skorITP = history.skorITP || 0;
        if (skorITP >= 500) {
            status = 'Lulus';
        } else if (skorITP >= 450) {
            status = 'Lulus (Minimal)';
        } else {
            status = 'Belum Lulus';
        }
    }
    const statusClass = status.includes('Lulus') ? 'status-lulus' : 'status-tidak';
    
    content.innerHTML = `
        <div class="certificate">
            <div class="certificate-header">
                <h1 class="certificate-title">Sertifikat TOEFL ${history.type}</h1>
                <div class="certificate-subtitle">TOEL.ID - Platform Simulasi TOEFL Terpercaya</div>
            </div>
            <div class="certificate-content">
                <div style="margin-bottom: 30px; font-size: 20px;">
                    Tanggal Tes: ${testDate}
                </div>
                <div class="certificate-score">
                    ${history.skorITP || history.skor || '-'}
                </div>
                ${history.type === 'Full' ? `
                    <div class="certificate-details">
                        Perincian Skor:<br>
                        Listening Comprehension: ${history.skorL}<br>
                        Structure and Written Expression: ${history.skorS}<br>
                        Reading Comprehension: ${history.skorR}
                    </div>
                    <div class="certificate-status">
                        Status: <span class="${statusClass}">${status}</span>
                    </div>
                ` : ''}
            </div>
            <div class="certificate-footer">
                <p style="font-size: 18px; color: #2471f3; font-weight: bold;">TOEL.ID</p>
                <p style="font-size: 16px; margin: 5px 0;">
                    Platform Pembelajaran dan Simulasi TOEFL Terbaik di Indonesia
                </p>
                <div class="certificate-validation">
                    Sertifikat ini diterbitkan sebagai hasil simulasi TOEFL di platform TOEL.ID.<br>
                    Skor ini mencerminkan kemampuan bahasa Inggris berdasarkan standar penilaian TOEFL ITP.
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('certificateModal');
    modal.style.display = 'none';
}

function printCertificate() {
    window.print();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('certificateModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};