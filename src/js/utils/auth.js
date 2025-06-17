function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('user').value;
    const password = document.getElementById('pw').value;

    // Simple validation
    if (username && password) {
        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userEmail', ''); // Initialize empty email
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
    } else {
        alert('Please fill in all fields');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('user').value;
    const password = document.getElementById('pw').value;
    const confirmPassword = document.getElementById('pw2').value;

    // Simple validation
    if (username && password && confirmPassword) {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userEmail', ''); // Initialize empty email
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
    } else {
        alert('Please fill in all fields');
    }
}

function logout() {
    // Bersihkan info user dari localStorage (kecuali riwayat)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('lastLogin');
    // Redirect ke halaman login
    window.location.href = '/pages/auth/login.html';
}

function redirectIfNotLoggedIn() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '../../pages/auth/login.html';
    }
}