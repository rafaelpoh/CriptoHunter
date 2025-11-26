const API_BASE_URL = "https://api.coingecko.com/api/v3";

document.addEventListener("DOMContentLoaded", () => {
    fetchCryptoData();
});

async function fetchCryptoData() {
    const top5Container = document.getElementById("top-5-container");
    const positiveChangesContainer = document.getElementById("positive-changes-container");
    const negativeChangesContainer = document.getElementById("negative-changes-container");

    top5Container.innerHTML = "<p>Carregando dados...</p>";
    positiveChangesContainer.innerHTML = "<p>Carregando dados...</p>";
    negativeChangesContainer.innerHTML = "<p>Carregando dados...</p>";

    try {
        const [top5Data, marketData] = await Promise.all([
            fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1`),
            fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1`)
        ]);

        if (!top5Data.ok || !marketData.ok) {
            throw new Error(`Erro na API: ${top5Data.status} ${top5Data.statusText} | ${marketData.status} ${marketData.statusText}`);
        }

        const top5Assets = await top5Data.json();
        const marketAssets = await marketData.json();

        displayTop5(top5Assets, top5Container);
        displayChanges(marketAssets, positiveChangesContainer, negativeChangesContainer);

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        top5Container.innerHTML = `<p>Erro ao buscar dados. Verifique o console para mais detalhes.</p>`;
        positiveChangesContainer.innerHTML = `<p>Erro ao buscar dados.</p>`;
        negativeChangesContainer.innerHTML = `<p>Erro ao buscar dados.</p>`;
    }
}

function displayTop5(assets, container) {
    let html = "<h2>Principais 5 Criptomoedas (por capitalização)</h2>";
    html += "<ul>";
    assets.forEach(asset => {
        html += `<li onclick="window.location.href='detail.html?id=${asset.id}'">
            <img src="${asset.image}" alt="${asset.name}" width="24" height="24">
            <strong>${asset.name} (${asset.symbol.toUpperCase()})</strong>: 
            Preço: $${asset.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
}

function displayChanges(assets, positiveContainer, negativeContainer) {
    const positiveChanges = assets.filter(asset => asset.price_change_percentage_24h >= 0);
    const negativeChanges = assets.filter(asset => asset.price_change_percentage_24h < 0);

    positiveChanges.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    negativeChanges.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);

    const top7Positive = positiveChanges.slice(0, 7);
    const top7Negative = negativeChanges.slice(0, 7);

    let positiveHtml = "<h2>Top 7 - Maiores Altas (24h)</h2>";
    positiveHtml += "<ul>";
    top7Positive.forEach(asset => {
        const change = asset.price_change_percentage_24h;
        positiveHtml += `<li onclick="window.location.href='detail.html?id=${asset.id}'">
            <img src="${asset.image}" alt="${asset.name}" width="24" height="24">
            <strong>${asset.name} (${asset.symbol.toUpperCase()})</strong>: 
            <span style="color: green;">+${change.toFixed(2)}%</span>
        </li>`;
    });
    positiveHtml += "</ul>";
    positiveContainer.innerHTML = positiveHtml;

    let negativeHtml = "<h2>Top 7 - Maiores Baixas (24h)</h2>";
    negativeHtml += "<ul>";
    top7Negative.forEach(asset => {
        const change = asset.price_change_percentage_24h;
        negativeHtml += `<li onclick="window.location.href='detail.html?id=${asset.id}'">
            <img src="${asset.image}" alt="${asset.name}" width="24" height="24">
            <strong>${asset.name} (${asset.symbol.toUpperCase()})</strong>: 
            <span style="color: red;">${change.toFixed(2)}%</span>
        </li>`;
    });
    negativeHtml += "</ul>";
    negativeContainer.innerHTML = negativeHtml;
}

