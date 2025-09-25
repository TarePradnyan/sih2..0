document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const closeButton = document.querySelector('.close-button');
    const loginContainer = document.querySelector('.login-container');

    // Handle form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Simple validation logic
        if (username === 'demo' && password === '123456') {
            errorMessage.textContent = 'Login successful!';
            errorMessage.style.color = '#28a745';
            // You can add redirection logic here, e.g., window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password.';
            errorMessage.style.color = '#dc3545';
        }
    });

    // Handle close button click
    closeButton.addEventListener('click', () => {
        loginContainer.style.display = 'none';
    });
});