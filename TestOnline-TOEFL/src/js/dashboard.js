// filepath: /TestOnline-TOEFL/TestOnline-TOEFL/src/js/dashboard.js

// Function to display user data
function displayUserData(userData) {
    const userDataContainer = document.getElementById('user-data');
    userDataContainer.innerHTML = `
        <h2>User Profile</h2>
        <p>Name: ${userData.name}</p>
        <p>Email: ${userData.email}</p>
        <p>Test History: ${userData.testHistory.join(', ')}</p>
    `;
}

// Function to handle profile editing
function editProfile() {
    const nameInput = document.getElementById('name-input').value;
    const emailInput = document.getElementById('email-input').value;

    // Update user data (this should ideally be done through an API)
    const updatedUserData = {
        name: nameInput,
        email: emailInput,
        testHistory: [] // This would be fetched from a database or API
    };

    displayUserData(updatedUserData);
}

// Event listener for the edit profile button
document.getElementById('edit-profile-btn').addEventListener('click', editProfile);

// Sample user data (this would typically come from a server)
const sampleUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    testHistory: ['TOEFL - 2023', 'IELTS - 2022']
};

// Display the sample user data on page load
window.onload = function() {
    displayUserData(sampleUserData);
};