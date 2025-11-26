const API_BASE_URL = "https://api.coingecko.com/api/v3";
let coinId; // Manter o ID da moeda acessível

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    coinId = urlParams.get('id');

    if (coinId) {
        fetchCoinDetails(coinId);
    } else {
        const container = document.getElementById('coin-detail-container');
        container.innerHTML = "<p>ID da moeda não especificado.</p>";
    }
});

async function fetchCoinDetails(id) {
    const detailContainer = document.getElementById('coin-detail-container');
    detailContainer.innerHTML = "<p>Carregando detalhes da moeda...</p>";

    try {
        const [detailResponse, chartResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/coins/${id}`),
            fetch(`${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=30`)
        ]);

        if (!detailResponse.ok || !chartResponse.ok) {
            throw new Error(`Erro na API: ${detailResponse.status} ${detailResponse.statusText} | ${chartResponse.status} ${chartResponse.statusText}`);
        }

        const coin = await detailResponse.json();
        const chartData = await chartResponse.json();
        
        displayCoinDetails(coin, detailContainer);
        displayPriceChart(chartData);

    } catch (error) {
        console.error("Erro ao buscar detalhes da moeda:", error);
        detailContainer.innerHTML = `<p>Erro ao buscar detalhes. Verifique o console para mais detalhes.</p>`;
    }
}

function displayCoinDetails(coin, container) {
    const marketData = coin.market_data;
    
    let html = `
        <div class="coin-header">
            <img src="${coin.image.large}" alt="${coin.name}">
            <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>
            <button id="watchlist-btn" class="watchlist-btn"></button>
        </div>
        <div class="coin-description">
            <p>${coin.description.pt || coin.description.en.split('. ')[0] + '.'}</p>
        </div>
        <div class="coin-stats">
            <div class="stat">
                <h4>Preço Atual (USD)</h4>
                <p>$${marketData.current_price.usd.toLocaleString('en-US')}</p>
            </div>
            <div class="stat">
                <h4>Capitalização de Mercado</h4>
                <p>$${marketData.market_cap.usd.toLocaleString('en-US')}</p>
            </div>
            <div class="stat">
                <h4>Volume (24h)</h4>
                <p>$${marketData.total_volume.usd.toLocaleString('en-US')}</p>
            </div>
            <div class="stat">
                <h4>Variação (24h)</h4>
                <p style="color: ${marketData.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
                    ${marketData.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        </div>
    `;
    container.innerHTML = html;

    // Lógica do botão da Watchlist
    const watchlistBtn = document.getElementById('watchlist-btn');
    updateWatchlistButton();

    watchlistBtn.addEventListener('click', () => {
        toggleWatchlist();
    });
}

function displayPriceChart(chartData) {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    const prices = chartData.prices;
    const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
    const data = prices.map(price => price[1]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Preço (USD)',
                data: data,
                borderColor: '#1a2a45',
                backgroundColor: 'rgba(26, 42, 69, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Preço (USD)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Histórico de Preços dos Últimos 30 Dias',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}

// Funções da Watchlist
function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist')) || [];
}

function isInWatchlist(id) {
    const watchlist = getWatchlist();
    return watchlist.includes(id);
}

function updateWatchlistButton() {
    const watchlistBtn = document.getElementById('watchlist-btn');
    if (isInWatchlist(coinId)) {
        watchlistBtn.textContent = 'Remover da Watchlist';
        watchlistBtn.classList.add('in-watchlist');
    } else {
        watchlistBtn.textContent = 'Adicionar à Watchlist';
        watchlistBtn.classList.remove('in-watchlist');
    }
}

function toggleWatchlist() {
    let watchlist = getWatchlist();
    if (isInWatchlist(coinId)) {
        watchlist = watchlist.filter(id => id !== coinId);
    } else {
        watchlist.push(coinId);
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    updateWatchlistButton();
}
