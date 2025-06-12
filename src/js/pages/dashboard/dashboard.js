document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/auth/login';
        return;
    }

    updateUserInfo();
    updateUserPhoto();

    // Listen for profile updates
    window.addEventListener('profileUpdated', updateUserInfo);

    // Agar update otomatis jika event di-trigger dari halaman lain
    window.addEventListener('profilePhotoUpdated', function(e) {
        updateUserInfo();
        updateUserPhoto();
    });
});

function updateUserInfo() {
    const userData = {
        name: localStorage.getItem('username') || 'User',
        email: localStorage.getItem('userEmail') || '',
        photo: localStorage.getItem('userPhoto') || '/assets/images/guest-profile.png'
    };
    // Pastikan elemen dengan id userName dan userEmail ada di dashboard.html
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    if (userName) userName.textContent = userData.name;
    if (userEmail) userEmail.textContent = userData.email;
}

function updateUserPhoto() {
    const userPhoto = localStorage.getItem('userPhoto') || '/assets/images/guest-profile.png';
    document.querySelectorAll('.user-photo').forEach(img => {
        if (img && img.tagName === 'IMG') {
            img.src = userPhoto;
            img.onerror = function() {
                if (!img.src.endsWith('guest-profile.png')) {
                    img.src = '/assets/images/guest-profile.png';
                }
            };
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/auth/login';
        return;
    }

    updateUserInfo();

    // Tambahan penting: jalankan updateUserPhoto di setTimeout agar setelah DOM stabil
    setTimeout(updateUserPhoto, 100);

    window.addEventListener('profileUpdated', updateUserInfo);
    window.addEventListener('profilePhotoUpdated', function(e) {
        updateUserInfo();
        updateUserPhoto();
    });
});
