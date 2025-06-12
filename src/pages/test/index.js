function startTest(mode) {
  localStorage.setItem('testMode', mode);
  // Tampilkan pilihan bab setelah pilih mode
  document.querySelector('.test-sections').style.display = 'flex';
}
function chooseSection(section) {
  localStorage.setItem('testSection', section);
  window.location.href = 'soal.html';
}