function startTest(mode) {
  localStorage.setItem('testMode', mode);
  document.getElementById('sectionChoice').style.display = 'flex';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}
function chooseSection(section) {
  localStorage.setItem('testSection', section);
  if (section === 'listening') {
    window.location.href = '/test/soal-listening';
  } else if (section === 'structure') {
    window.location.href = '/test/soal-structure';
  } else if (section === 'reading') {
    window.location.href = '/test/soal-reading';
  } else if (section === 'full') {
    window.location.href = '/test/soal';
  }
}