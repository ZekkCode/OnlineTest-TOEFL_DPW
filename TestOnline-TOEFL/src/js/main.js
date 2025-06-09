// filepath: /TestOnline-TOEFL/TestOnline-TOEFL/src/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    const dashboardLink = document.getElementById('dashboard-link');
    const testLink = document.getElementById('test-link');

    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'pages/dashboard.html';
        });
    }

    if (testLink) {
        testLink.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'pages/test.html';
        });
    }
});