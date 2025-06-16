function hitungSkorTOEFL(section, benar, total) {
  // Semua section skala 31-68, rumus: (benar/total)*37+31
  if (total === 0) return 0;
  const skor = (benar / total) * 37 + 31;
  return Math.round(skor);
}

function hitungSkorTOEFLFull(listening, structure, reading) {
  // Rumus ITP: ((L+S+R)*10)/3
  const total = listening + structure + reading;
  return Math.round((total * 10) / 3);
}

function simpanRiwayatTOEFL(data) {
  // Simpan ke localStorage (array of objects)
  const key = 'toeflHistory';
  const riwayat = JSON.parse(localStorage.getItem(key) || '[]');
  riwayat.unshift(data); // terbaru di depan
  localStorage.setItem(key, JSON.stringify(riwayat));
}