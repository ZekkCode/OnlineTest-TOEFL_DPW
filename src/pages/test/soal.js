document.addEventListener('DOMContentLoaded', async function() {
    // Contoh load soal dari file JSON (ganti sesuai kebutuhan)
    const section = localStorage.getItem('testSection') || 'listening';
    const res = await fetch(`../../data/${section}.json`);
    const questions = await res.json();

    let current = 0;
    let answers = JSON.parse(localStorage.getItem('testAnswers') || '[]');
    if (answers.length !== questions.length) answers = Array(questions.length).fill(null);

    function renderQuestion(idx) {
        const q = questions[idx];
        document.querySelector('.question-title').textContent = q.question;
        const opts = document.querySelector('.options');
        opts.innerHTML = '';
        q.options.forEach((opt, i) => {
            const div = document.createElement('div');
            div.className = 'option' + (answers[idx] === i ? ' selected' : '');
            div.textContent = opt;
            div.onclick = () => {
                answers[idx] = i;
                localStorage.setItem('testAnswers', JSON.stringify(answers));
                renderQuestion(idx);
                renderNavigator();
            };
            opts.appendChild(div);
        });
        document.querySelector('.question-number').textContent = `Question ${idx + 1} of ${questions.length}`;
        document.querySelector('.prev-btn').disabled = idx === 0;
        document.querySelector('.next-btn').disabled = idx === questions.length - 1;
    }

    function renderNavigator() {
        const nav = document.querySelector('.navigator-grid');
        nav.innerHTML = '';
        questions.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.textContent = i + 1;
            btn.className = (i === current ? 'current ' : '') +
                (answers[i] !== null ? 'answered' : 'unanswered');
            btn.onclick = () => {
                current = i;
                renderQuestion(current);
                renderNavigator();
            };
            nav.appendChild(btn);
        });
    }

    document.querySelector('.prev-btn').onclick = () => {
        if (current > 0) {
            current--;
            renderQuestion(current);
            renderNavigator();
        }
    };
    document.querySelector('.next-btn').onclick = () => {
        if (current < questions.length - 1) {
            current++;
            renderQuestion(current);
            renderNavigator();
        }
    };
    document.querySelector('.submit-btn').onclick = () => {
        // Hitung skor
        let score = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.answer) score++;
        });
        localStorage.setItem('testScore', score);
        localStorage.setItem('testTotal', questions.length);
        localStorage.removeItem('testAnswers');
        window.location.href = 'hasil.html';
    };

    // Render awal
    renderQuestion(current);
    renderNavigator();
});