const API_BASE_URL = "https://api.coingecko.com/api/v3";

document.addEventListener("DOMContentLoaded", () => {
    const watchlistContainer = document.getElementById("watchlist-container");
    displayWatchlist(watchlistContainer);
});

function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist')) || [];
}

async function displayWatchlist(container) {
    const watchlist = getWatchlist();
    container.innerHTML = "<h2>Minha Watchlist</h2>";

    if (watchlist.length === 0) {
        container.innerHTML += "<p>Sua watchlist está vazia. Adicione moedas a partir da página de detalhes.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${watchlist.join(',')}`);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }
        const assets = await response.json();

        let html = "<ul>";
        assets.forEach(asset => {
            const change = asset.price_change_percentage_24h;
            const color = change >= 0 ? 'green' : 'red';
            html += `
                <li data-id="${asset.id}">
                    <img src="${asset.image}" alt="${asset.name}" width="24" height="24">
                    <strong onclick="window.location.href='detail.html?id=${asset.id}'" style="cursor: pointer; flex-grow: 1;">
                        ${asset.name} (${asset.symbol.toUpperCase()})
                    </strong>
                    <span>$${asset.current_price.toLocaleString('en-US')}</span>
                    <span style="color: ${color}; margin-left: 15px;">${change.toFixed(2)}%</span>
                    <button class="remove-from-watchlist" data-id="${asset.id}">&times;</button>
                </li>`;
        });
        html += "</ul>";
        container.innerHTML += html;

        // Adiciona event listeners para os botões de remover
        document.querySelectorAll('.remove-from-watchlist').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o clique no botão dispare o clique no 'li'
                const coinId = e.target.getAttribute('data-id');
                removeFromWatchlist(coinId);
            });
        });

    } catch (error) {
        console.error("Erro ao buscar dados da watchlist:", error);
        container.innerHTML += "<p>Erro ao carregar a watchlist.</p>";
    }
}

function removeFromWatchlist(coinId) {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(id => id !== coinId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Remove o item da UI e recarrega a seção da watchlist
    const itemToRemove = document.querySelector(`#watchlist-container li[data-id="${coinId}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
    }
    // Se a watchlist ficar vazia, mostra a mensagem
    if (getWatchlist().length === 0) {
        const container = document.getElementById('watchlist-container');
        container.innerHTML = "<h2>Minha Watchlist</h2><p>Sua watchlist está vazia. Adicione moedas a partir da página de detalhes.</p>";
    }
}
