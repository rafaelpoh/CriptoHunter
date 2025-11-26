let debounceTimer;
let allCoins = []; // Cache para todas as moedas

// Função para buscar todas as moedas e armazenar em cache
async function fetchAllCoins() {
    try {
        const response = await fetch(`${API_BASE_URL}/coins/list`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar a lista de moedas: ${response.statusText}`);
        }
        allCoins = await response.json();
        console.log("Lista de moedas carregada:", allCoins.length);
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAllCoins(); // Carrega as moedas quando a página é carregada
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = searchInput.value.trim().toLowerCase();

        if (query.length > 1) {
            searchResults.innerHTML = '<ul><li>Buscando...</li></ul>';
            searchResults.style.display = 'block';
            debounceTimer = setTimeout(() => {
                // Filtra as moedas do cache em vez de fazer uma nova chamada de API
                const filteredCoins = allCoins.filter(coin => 
                    coin.name.toLowerCase().includes(query) || 
                    coin.symbol.toLowerCase().includes(query)
                );
                displaySearchResults(filteredCoins, searchResults);
            }, 300);
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

// A função searchCoins não é mais necessária, pois a busca é feita no cliente
// async function searchCoins(query, searchResults) { ... }

function displaySearchResults(coins, container) {
    if (!coins || coins.length === 0) {
        container.innerHTML = '<ul><li>Nenhum resultado encontrado.</li></ul>';
        container.style.display = 'block';
        return;
    }

    let html = "<ul>";
    // A API /coins/list não fornece imagens, então precisamos ajustar
    coins.slice(0, 10).forEach(coin => {
        html += `
            <li onclick="window.location.href='detail.html?id=${coin.id}'">
                <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
            </li>`;
    });
    html += "</ul>";
    
    container.innerHTML = html;
    container.style.display = 'block';
}