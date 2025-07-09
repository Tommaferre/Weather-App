// Configurazione globale
const API_BASE_URL = '';
let currentChart = null;

// Elementi DOM
const cityButtons = document.getElementById('cityButtons');
const weatherDisplay = document.getElementById('weatherDisplay');
const currentWeather = document.getElementById('currentWeather');
const currentCity = document.getElementById('currentCity');
const temperature = document.getElementById('temperature');
const weatherInfo = document.getElementById('weatherInfo');
const weatherDescription = document.getElementById('weatherDescription');
const timestamp = document.getElementById('timestamp');
const temperatureChart = document.getElementById('temperatureChart');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

// Codici meteo Open-Meteo e relative descrizioni
const weatherCodes = {
    0: '☀️ Sereno',
    1: '🌤️ Principalmente sereno',
    2: '⛅ Parzialmente nuvoloso',
    3: '☁️ Nuvoloso',
    45: '🌫️ Nebbia',
    48: '🌫️ Nebbia con brina',
    51: '🌦️ Pioggerella leggera',
    53: '🌦️ Pioggerella moderata',
    55: '🌦️ Pioggerella intensa',
    61: '🌧️ Pioggia leggera',
    63: '🌧️ Pioggia moderata',
    65: '🌧️ Pioggia intensa',
    80: '🌦️ Rovesci leggeri',
    81: '🌦️ Rovesci moderati',
    82: '🌦️ Rovesci intensi',
    95: '⛈️ Temporale',
    96: '⛈️ Temporale con grandine leggera',
    99: '⛈️ Temporale con grandine intensa'
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    loadCities();
    weatherDisplay.style.display = 'none';
});

// Carica le città supportate
async function loadCities() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/cities`);
        const cities = await response.json();
        
        cityButtons.innerHTML = '';
        cities.forEach(city => {
            const button = document.createElement('button');
            button.className = 'city-btn';
            button.textContent = getEmoji(city) + ' ' + city;
            button.onclick = () => loadWeatherData(city);
            cityButtons.appendChild(button);
        });
    } catch (error) {
        showError('Errore nel caricamento delle città: ' + error.message);
    }
}

// Ottieni emoji per città
function getEmoji(city) {
    const emojis = {
        'Roma': '🏛️',
        'Milano': '🏢',
        'Napoli': '🌋',
        'Torino': '🏔️',
        'Palermo': '🏝️',
        'Genova': '⚓',
        'Bologna': '🍝',
        'Firenze': '🎨',
        'Venezia': '🚤',
        'Bari': '🌊'
    };
    return emojis[city] || '🏙️';
}

// Carica i dati meteo per una città
async function loadWeatherData(city) {
    showLoading();
    hideError();
    
    try {
        // Aggiorna stato pulsanti
        document.querySelectorAll('.city-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Carica meteo attuale
        const currentResponse = await fetch(`${API_BASE_URL}/api/meteo?city=${encodeURIComponent(city)}`);
        const currentData = await currentResponse.json();
        
        if (currentData.error) {
            throw new Error(currentData.error);
        }
        
        // Carica dati storici
        const historyResponse = await fetch(`${API_BASE_URL}/api/meteo/history?city=${encodeURIComponent(city)}`);
        const historyData = await historyResponse.json();
        
        if (historyData.error) {
            throw new Error(historyData.error);
        }
        
        // Aggiorna UI
        updateCurrentWeather(currentData);
        updateChart(historyData);
        
        weatherDisplay.style.display = 'block';
        
    } catch (error) {
        showError('Errore nel caricamento dati: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Aggiorna il meteo attuale
function updateCurrentWeather(data) {
    currentCity.textContent = getEmoji(data.city) + ' ' + data.city;
    temperature.textContent = Math.round(data.temperature) + '°C';
    weatherDescription.textContent = weatherCodes[data.weatherCode] || '❓ Sconosciuto';
    
    const now = new Date();
    timestamp.textContent = 'Aggiornato: ' + now.toLocaleTimeString('it-IT');
}

// Aggiorna il grafico
function updateChart(historyData) {
    if (!historyData.data || !historyData.data.daily) {
        console.error('Dati storici non disponibili');
        return;
    }
    
    const daily = historyData.data.daily;
    const dates = daily.time || [];
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    
    // Distruggi il grafico precedente se esiste
    if (currentChart) {
        currentChart.destroy();
    }
    
    const ctx = temperatureChart.getContext('2d');
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('it-IT', { 
                    month: 'short', 
                    day: 'numeric' 
                });
            }),
            datasets: [{
                label: 'Temp. Massima',
                data: maxTemps,
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#ff6b6b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Temp. Minima',
                data: minTemps,
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#4ecdc4',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return value + '°C';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Mostra loading
function showLoading() {
    loading.classList.add('show');
}

// Nascondi loading
function hideLoading() {
    loading.classList.remove('show');
}

// Mostra errore
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Nascondi automaticamente dopo 5 secondi
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Nascondi errore
function hideError() {
    errorMessage.classList.remove('show');
}

// Aggiungi effetto pioggia (opzionale)
function createRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    document.body.appendChild(rainContainer);
    
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        rainContainer.appendChild(drop);
    }
}

// Aggiungi gli stili per l'effetto pioggia
const rainStyles = `
.rain-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

.rain-drop {
    position: absolute;
    width: 2px;
    height: 20px;
    background: linear-gradient(transparent, rgba(255, 255, 255, 0.3));
    animation: fall linear infinite;
}

@keyframes fall {
    0% { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
}
`;

// Aggiungi gli stili alla pagina
const styleSheet = document.createElement('style');
styleSheet.textContent = rainStyles;
document.head.appendChild(styleSheet);

// Attiva effetto pioggia in caso di meteo piovoso
function checkWeatherForEffects(weatherCode) {
    const rainyWeatherCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
    
    if (rainyWeatherCodes.includes(weatherCode)) {
        createRainEffect();
    }
}