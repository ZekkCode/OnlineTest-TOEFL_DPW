document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/auth/login';
        return;
    }

    const profileForm = document.getElementById('profileForm');
    const photoInput = document.getElementById('photoInput');
    const profilePreview = document.getElementById('profilePreview');
    const uploadBtn = document.querySelector('.btn-upload');

    // Load existing data
    loadUserData();

    // Handle photo upload button click
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            photoInput.click();
        });
    }

    // Handle photo file selection
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('File harus berupa gambar!');
                return;
            }
            if (file.size > 5000000) {
                alert('File terlalu besar. Maksimal 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                // Update preview di form
                profilePreview.src = e.target.result;
                // Simpan ke localStorage
                localStorage.setItem('userPhoto', e.target.result);

                // Update semua elemen foto profil di halaman (sidebar/dsb)
                document.querySelectorAll('.user-photo').forEach(img => {
                    img.src = e.target.result;
                });

                // Dispatch event untuk halaman lain jika perlu
                const event = new CustomEvent('profilePhotoUpdated', {
                    detail: { photo: e.target.result }
                });
                window.dispatchEvent(event);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validation
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Save to localStorage
        localStorage.setItem('username', name);
        localStorage.setItem('userEmail', email);

        // Dispatch event for other components
        const event = new CustomEvent('profileUpdated', {
            detail: { name, email }
        });
        window.dispatchEvent(event);

        // Show success message
        alert('Profile updated successfully!');
        window.location.replace('/dashboard');
    });
});

function loadUserData() {
    const userData = {
        name: localStorage.getItem('username') || '',
        email: localStorage.getItem('userEmail') || '',
        photo: localStorage.getItem('userPhoto') || '/assets/images/guest-profile.png'
    };

    document.getElementById('name').value = userData.name;
    document.getElementById('email').value = userData.email;

    const profilePreview = document.getElementById('profilePreview');
    const defaultPhoto = profilePreview.parentElement.querySelector('.default-photo');
    if (profilePreview) {
        profilePreview.style.display = 'block';
        if (defaultPhoto) defaultPhoto.style.display = 'none';
        profilePreview.src = userData.photo;

        profilePreview.onerror = function() {
            // Hanya ganti src jika bukan default
            if (!profilePreview.src.endsWith('guest-profile.png')) {
                profilePreview.src = '/assets/images/guest-profile.png';
            } else {
                profilePreview.style.display = 'none';
                if (defaultPhoto) defaultPhoto.style.display = 'flex';
            }
        };
        profilePreview.onload = function() {
            profilePreview.style.display = 'block';
            if (defaultPhoto) defaultPhoto.style.display = 'none';
        };
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}