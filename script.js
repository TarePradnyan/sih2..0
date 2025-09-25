document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.querySelector('.login-container');

    // Agar user logged in hai
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const username = localStorage.getItem('username') || "User";

        // Login button replace with welcome + logout
        loginContainer.innerHTML = `
            <span class="nav-link">👋 Welcome, ${username}</span>
            <button id="logoutBtn" class="nav-link login-btn">Logout</button>
        `;

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.reload(); // refresh page
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.querySelector('.login-container');

    // Login check
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const username = localStorage.getItem('username') || "User";
        loginContainer.innerHTML = `
            <span class="nav-link">👋 Welcome, ${username}</span>
            <button id="logoutBtn" class="nav-link login-btn">Logout</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.reload();
        });
    }

    // ----------------------------
    // 🌦 WEATHER DATA (USER LOCATION)
    // ----------------------------
    const weatherInfo = document.getElementById('weatherInfo');
    const apiKey = "fbc9f66afd996e22e5c94a85f5492f7c"; // <-- replace with your OpenWeatherMap API key

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const temp = data.main.temp;
                        const desc = data.weather[0].description;
                        const icon = data.weather[0].icon;
                        const cityName = data.name;

                        weatherInfo.innerHTML = `
                            <p><strong>${cityName}</strong></p>
                            <p>🌡️ ${temp}°C</p>
                            <p>☁️ ${desc}</p>
                            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
                        `;
                    } else {
                        weatherInfo.innerHTML = `<p>⚠️ Unable to load weather.</p>`;
                    }
                })
                .catch(err => {
                    weatherInfo.innerHTML = `<p>⚠️ Error fetching weather.</p>`;
                    console.error(err);
                });
        }, error => {
            weatherInfo.innerHTML = `<p>⚠️ Location access denied. Please enable GPS.</p>`;
        });
    } else {
        weatherInfo.innerHTML = `<p>⚠️ Geolocation not supported.</p>`;
    }
});
