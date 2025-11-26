const API_BASE_URL = "https://api.coingecko.com/api/v3";
let debounceTimer;

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = searchInput.value.trim();

        if (query.length > 1) {
            searchResults.innerHTML = '<ul><li>Buscando...</li></ul>';
            searchResults.style.display = 'block';
            debounceTimer = setTimeout(() => {
                searchCoins(query, searchResults);
            }, 300); // 300ms debounce
        } else {
            searchResults.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });
});

async function searchCoins(query, searchResults) {
    try {
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        displaySearchResults(data.coins, searchResults);
    } catch (error) {
        console.error("Erro ao buscar moedas:", error);
        searchResults.innerHTML = `<ul><li>Erro ao buscar: ${error.message}</li></ul>`;
        searchResults.style.display = 'block';
    }
}

function displaySearchResults(coins, container) {
    if (!coins || coins.length === 0) {
        container.innerHTML = '<ul><li>Nenhum resultado encontrado.</li></ul>';
        container.style.display = 'block';
        return;
    }

    let html = "<ul>";
    coins.slice(0, 10).forEach(coin => { // Pega os 10 primeiros resultados
        html += `
            <li onclick="window.location.href='detail.html?id=${coin.id}'">
                <img src="${coin.thumb}" alt="${coin.name}" width="20" height="20">
                <span>${coin.name} (${coin.symbol})</span>
            </li>`;
    });
    html += "</ul>";
    
    container.innerHTML = html;
    container.style.display = 'block';
}