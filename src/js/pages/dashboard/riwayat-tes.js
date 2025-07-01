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
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewCertificate('${index}')" title="Lihat & Cetak Sertifikat">
                        <i class="fas fa-certificate"></i>
                        <span class="btn-text">Sertifikat</span>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteTestHistory('${index}')" title="Hapus Riwayat">
                        <i class="fas fa-trash"></i>
                        <span class="btn-text">Hapus</span>
                    </button>
                </div>
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
                <div class="cert-header-flex">
                    <div class="cert-logo">T</div>
                    <div class="cert-header-text">
                        <h1 class="certificate-title">Sertifikat TOEFL ${history.type}</h1>
                        <div class="certificate-subtitle">TOEL.ID - Platform Simulasi TOEFL Terpercaya</div>
                    </div>
                </div>
            </div>
            <div class="certificate-content">
                <div class="cert-info-box">
                    📅 <strong>Tanggal Tes:</strong> ${testDate}<br>
                    👤 <strong>Platform:</strong> TOEL.ID Simulation<br>
                    🆔 <strong>ID Sertifikat:</strong> TOEL-${Date.now().toString().slice(-8)}-${index}
                </div>
                
                <div class="certificate-score">
                    <div class="score-label">SKOR</div>
                    <div class="score-value">${history.skorITP || history.skor || '-'}</div>
                    <div class="score-type">${history.type === 'Full' ? 'TOEFL ITP' : history.type}</div>
                </div>
                
                ${history.type === 'Full' ? `
                    <div class="certificate-details">
                        <strong>📊 BREAKDOWN SKOR DETAIL</strong><br><br>
                        <div class="score-breakdown">
                            <div class="score-item listening">
                                <div class="item-score">${history.skorL || '-'}</div>
                                <div class="item-label">🎧 Listening</div>
                            </div>
                            <div class="score-item structure">
                                <div class="item-score">${history.skorS || '-'}</div>
                                <div class="item-label">✏️ Structure</div>
                            </div>
                            <div class="score-item reading">
                                <div class="item-score">${history.skorR || '-'}</div>
                                <div class="item-label">📖 Reading</div>
                            </div>
                        </div>
                        <div class="score-range">
                            <strong>📏 Rentang Skor TOEFL ITP:</strong> 310 - 677 points
                        </div>
                    </div>
                    <div class="certificate-status">
                        <strong>🏆 STATUS KELULUSAN</strong><br><br>
                        <span class="${statusClass}">${status}</span>
                        ${status.includes('Lulus') ? '<br><div class="status-message success">✅ Selamat! Anda telah mencapai standar TOEFL yang diperlukan.</div>' : '<br><div class="status-message fail">📚 Tingkatkan kemampuan bahasa Inggris Anda untuk hasil yang lebih baik.</div>'}
                    </div>
                ` : `
                    <div class="certificate-details">
                        <strong>📊 DETAIL HASIL TES</strong><br><br>
                        <div class="test-details">
                            <div class="detail-item">
                                <strong>📝 Tipe Tes:</strong><br>
                                <span class="detail-value">${history.type}</span>
                            </div>
                            <div class="detail-item">
                                <strong>🎯 Skor Anda:</strong><br>
                                <span class="detail-score">${history.skor || '-'}</span>
                            </div>
                        </div>
                        <div class="score-range">
                            <strong>📏 Rentang Skor ${history.type}:</strong> 31 - 68 points
                        </div>
                    </div>
                `}
            </div>
            <div class="certificate-footer">
                <div class="cert-footer-flex">
                    <div class="cert-footer-logo">T</div>
                    <div class="cert-footer-text">
                        <p class="footer-title">🏆 TOEL.ID</p>
                        <p class="footer-subtitle">Platform Simulasi TOEFL Terpercaya</p>
                    </div>
                </div>
                <div class="certificate-validation">
                    ✅ <strong>Sertifikat ini diterbitkan oleh platform TOEL.ID</strong><br>
                    📈 Hasil simulasi berdasarkan standar penilaian TOEFL ITP internasional<br>
                    🔒 Dokumen digital dengan ID unik untuk verifikasi<br>
                    📅 Dikeluarkan pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>
        </div>
    `;
    
    // Add animation class
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function printCertificate() {
    console.log('=== PRINT CERTIFICATE DEBUG ===');
    
    // Show loading state
    const btn = document.querySelector('.btn-cetak');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Menyiapkan...</span>';
    btn.disabled = true;
    
    // Get modal and certificate elements
    const modal = document.getElementById('certificateModal');
    const certificate = modal ? modal.querySelector('.certificate') : null;
    
    console.log('Modal found:', !!modal);
    console.log('Certificate found:', !!certificate);
    
    if (!modal || !certificate) {
        console.error('Modal or Certificate element not found!');
        alert('Error: Sertifikat tidak dapat ditemukan. Silakan coba lagi.');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }
    
    // Ensure modal is visible
    modal.style.display = 'block';
    modal.classList.add('show');
    
    // Force certificate to be visible
    certificate.style.display = 'block';
    certificate.style.visibility = 'visible';
    certificate.style.opacity = '1';
    
    console.log('Modal display:', modal.style.display);
    console.log('Certificate display:', certificate.style.display);
    console.log('Certificate content length:', certificate.innerHTML.length);
    
    // Add print-ready class to body
    document.body.classList.add('print-mode');
    
    // Remove any problematic styles
    certificate.style.animation = 'none';
    certificate.style.transform = 'none';
    certificate.style.transition = 'none';
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Triggering print...');
        
        // Focus window and trigger print
        window.focus();
        
        try {
            const printResult = window.print();
            console.log('Print triggered successfully:', printResult);
        } catch (error) {
            console.error('Print error:', error);
            alert('Error saat mencetak: ' + error.message);
        }
        
        // Clean up after print
        setTimeout(() => {
            document.body.classList.remove('print-mode');
            btn.innerHTML = originalText;
            btn.disabled = false;
            console.log('Print cleanup completed');
        }, 1000);
        
    }, 800);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('certificateModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Handle ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('certificateModal');
        if (modal.style.display === 'block') {
            closeModal();
        }
    }
});