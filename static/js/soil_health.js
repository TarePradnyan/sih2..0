document.addEventListener('DOMContentLoaded', () => {
    const freeBtn = document.querySelector('.free-btn');
    const paidBtn = document.querySelector('.paid-btn');
    const contentArea = document.getElementById('content-area');

    freeBtn.addEventListener('click', () => {
        contentArea.innerHTML = `
            <h3>Free Version: DIY Soil Testing</h3>
            <p>Watch these videos to learn how to test your soil's health at home.</p>
            <div class="video-grid">
                <img src="https://via.placeholder.com/200x120?text=Video+1" alt="Video thumbnail">
                <img src="https://via.placeholder.com/200x120?text=Video+2" alt="Video thumbnail">
            </div>
        `;
    });

    paidBtn.addEventListener('click', () => {
        contentArea.innerHTML = `
            <h3>Paid Version: Professional Soil Analysis</h3>
            <p>Book a professional soil sampling test from our partnered university.</p>
            <form id="bookingForm">
                <label for="name">Name:</label><input type="text" id="name" required><br>
                <label for="phone">Phone:</label><input type="tel" id="phone" required><br>
                <button type="submit">Book a Test</button>
            </form>
        `;
        // Add form submission logic here
    });

    console.log('Soil health page loaded.');
});