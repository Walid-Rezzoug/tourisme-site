"use strict";

/**
 * Mzab Experience - Main Script
 * Handles navigation, animations, and API integrations.
 */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------------
       1. Navigation & UI
    ----------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Sticky Navbar transparency toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(250, 250, 247, 0.98)';
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(250, 250, 247, 0.9)';
            navbar.style.padding = '1.5rem 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.right = '0'; // Ensure full width
            navLinks.style.background = '#fff';
            navLinks.style.padding = '2rem';
            navLinks.style.gap = '1.5rem';
            navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            navLinks.style.zIndex = '999';
        }
    });

    // Reset Nav on Resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            navLinks.style = ''; // Clear inline styles
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth < 992) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    /* -----------------------------------------------------------
       2. Scroll Animations (Intersection Observer)
    ----------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    /* -----------------------------------------------------------
       3. Leaflet Map API (OpenStreetMap)
    ----------------------------------------------------------- */
    // Ghardaïa Coordinates
    const lat = 32.4909;
    const lng = 3.6735;

    if (document.getElementById('map')) {
        const map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, lng]).addTo(map)
            .bindPopup('<b>Vallée du Mzab</b><br>Le cœur du désert.')
            .openPopup();
    }

    /* -----------------------------------------------------------
       4. Weather API (OpenWeatherMap)
    ----------------------------------------------------------- */
    const weatherWidget = document.getElementById('weather-widget');
    // NOTE: In a real production app, API keys should be hidden/proxied. 
    // This is a public demo key or placeholder logic.
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // User should replace this
    const CITY = 'Ghardaia';

    async function fetchWeather() {
        try {
            // Using a demo call or mocking if key is invalid needed for this static demo to work immediately
            // Since we don't have a valid key, we will simulate a successful response for the user to see the UI.
            // If the user inserts a key, they can uncomment the fetch.

            // SIMULATED DATA FOR DEMO PURPOSES
            const mockData = {
                main: { temp: 28, humidity: 45 },
                weather: [{ description: "ensoleillé", icon: "01d" }],
                name: "Ghardaïa"
            };

            updateWeatherUI(mockData);

            /*
            // REAL FETCH IMPLEMENTATION (Uncomment to use with real key)
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=fr`);
            if (!response.ok) throw new Error('Weather data unavailable');
            const data = await response.json();
            updateWeatherUI(data);
            */

        } catch (error) {
            weatherWidget.innerHTML = '<p>Météo actuellement indisponible.</p>';
            console.error(error);
        }
    }

    function updateWeatherUI(data) {
        // Icon mapping (simple generic icons based on description)
        let iconClass = 'fa-sun';
        const desc = data.weather[0].description.toLowerCase();

        if (desc.includes('cloud') || desc.includes('nuage')) iconClass = 'fa-cloud';
        else if (desc.includes('rain') || desc.includes('pluie')) iconClass = 'fa-cloud-rain';
        else if (desc.includes('clear') || desc.includes('dégagé') || desc.includes('ensoleillé')) iconClass = 'fa-sun';
        else if (desc.includes('sand') || desc.includes('dust') || desc.includes('sable')) iconClass = 'fa-wind';

        weatherWidget.innerHTML = `
            <i class="fas ${iconClass}" style="font-size: 4rem; margin-bottom: 1rem; color: #fff;"></i>
            <div class="weather-temp">${Math.round(data.main.temp)}°C</div>
            <div class="weather-desc">${data.weather[0].description}</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8">
                <i class="fas fa-tint"></i> Humidité: ${data.main.humidity}%
            </div>
        `;
        // Dynamic background based on temp
        if (data.main.temp > 30) {
            weatherWidget.style.background = 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'; // Hot
        } else {
            weatherWidget.style.background = 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)'; // Mild
        }
    }

    fetchWeather();

    /* -----------------------------------------------------------
       5. Dynamic Image Gallery
    ----------------------------------------------------------- */
    const galleryGrid = document.getElementById('gallery-grid');
    const imageKeywords = ['sahara', 'desert', 'market', 'palm', 'arabic architecture', 'camel'];

    // Unsplash Source is deprecated/unreliable, using specific reliable IDs or keywords
    const localImages = [
        'images.jpg',
        'images (1).jpg',
        'images (2).jpg',
        'téléchargé.jpg',
        'téléchargé (1).jpg',
        'ghardaia.png'
    ];

    if (galleryGrid) {
        localImages.forEach((fileName, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item fade-in-up';
            imgContainer.style.animationDelay = `${index * 0.1}s`;

            const img = document.createElement('img');
            img.src = fileName;
            img.alt = 'Gallery Image';
            img.loading = 'lazy';

            imgContainer.appendChild(img);
            galleryGrid.appendChild(imgContainer);

            // Observer needs to observe these new elements
            observer.observe(imgContainer);
        });
    }

});
