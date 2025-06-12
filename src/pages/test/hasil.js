document.addEventListener('DOMContentLoaded', function() {
  const score = localStorage.getItem('testScore') || 0;
  const total = localStorage.getItem('testTotal') || 0;
  document.getElementById('score-summary').innerHTML = `
    <h2>Skor Anda: ${score} / ${total}</h2>
    <p>Terima kasih telah mengikuti test TOEFL di TOEL.id!</p>
  `;
});