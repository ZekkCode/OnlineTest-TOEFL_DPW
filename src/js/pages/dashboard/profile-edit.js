document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/auth/login';
        return;
    }

    const profileForm = document.getElementById('profileForm');
    const uploadBtn = document.querySelector('.btn-upload');

    // Load existing data
    loadUserData();

    // Handle photo upload button click
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            photoInput.click();
        });
    }

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

// Profile Photo Handling
function initProfilePhoto() {
    const photoInput = document.getElementById('photoInput');
    const profilePhoto = document.querySelector('.profile-photo img.user-photo');
    const defaultPhoto = document.querySelector('.profile-photo .default-photo');

    // Load existing photo from localStorage
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
        profilePhoto.style.display = 'block';
        if (defaultPhoto) defaultPhoto.style.display = 'none';
    }

    // Handle photo upload
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                profilePhoto.src = event.target.result;
                profilePhoto.style.display = 'block';
                if (defaultPhoto) defaultPhoto.style.display = 'none';
                
                // Save to localStorage
                try {
                    localStorage.setItem('userPhoto', event.target.result);
                } catch (e) {
                    console.error('Error saving photo:', e);
                    alert('Failed to save photo. The image might be too large.');
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Delete Profile Photo
function deleteProfilePhoto() {
    const profilePhoto = document.querySelector('.profile-photo img.user-photo');
    const defaultPhoto = document.querySelector('.profile-photo .default-photo');
    
    localStorage.removeItem('userPhoto');
    profilePhoto.src = '';
    profilePhoto.style.display = 'none';
    if (defaultPhoto) defaultPhoto.style.display = 'flex';
}

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

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initProfilePhoto();
    
    // Add event listener for delete photo button if exists
    const deletePhotoBtn = document.getElementById('deletePhotoBtn');
    if (deletePhotoBtn) {
        deletePhotoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to remove your profile photo?')) {
                deleteProfilePhoto();
            }
        });
    }
});