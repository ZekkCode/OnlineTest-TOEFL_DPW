function hitungSkorTOEFL(section, benar, total) {
  if (total === 0) return 0;
  return Math.round((benar / total) * 37 + 31);
}

function hitungSkorTOEFLFull(listening, structure, reading) {
  return Math.round(((listening + structure + reading) * 10) / 3);
}

function getStatusKeterangan(skor) {
  if (skor >= 450 && skor <= 499) {
    return 'Lulus (Standar Minimal - S1/CPNS)';
  } else if (skor < 450) {
    return 'Belum Lulus';
  } else {
    return 'Lulus';
  }
}

function simpanRiwayatTOEFL(data) {
  const key = 'toeflHistory';
  const testMode = localStorage.getItem('testMode') || 'latihan';
  const riwayat = JSON.parse(localStorage.getItem(key) || '[]');
  
  // Add more info to data
  const newData = {
    ...data,
    mode: testMode,
    status: data.type === 'Full' ? getStatusKeterangan(data.skorITP) : '-',
    id: Date.now() // unique ID for each entry
  };

  riwayat.unshift(newData);
  localStorage.setItem(key, JSON.stringify(riwayat));
}