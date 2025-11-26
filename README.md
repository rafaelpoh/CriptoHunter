# CriptoHunter

CriptoHunter é uma aplicação web para rastreamento de criptomoedas que permite aos usuários visualizar informações de mercado, pesquisar criptomoedas, ver detalhes e manter uma lista de observação pessoal.

## Funcionalidades

- **Página Inicial**: Exibe as 5 principais criptomoedas por capitalização de mercado, bem como as 7 principais moedas com maiores ganhos e perdas nas últimas 24 horas.
- **Pesquisa de Criptomoedas**: Permite aos usuários pesquisar criptomoedas por nome ou símbolo.
- **Página de Detalhes**: Mostra informações detalhadas sobre uma criptomoeda específica, incluindo:
  - Preço atual
  - Capitalização de mercado
  - Volume de negociação em 24h
  - Variação de preço em 24h
  - Descrição da moeda
  - Um gráfico com o histórico de preços dos últimos 30 dias.
- **Watchlist**: Os usuários podem adicionar ou remover moedas de uma lista de observação pessoal, que é salva no armazenamento local do navegador.

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **API**: [CoinGecko API](https://www.coingecko.com/en/api) para dados de criptomoedas.
- **Bibliotecas**: [Chart.js](https://www.chartjs.org/) para a exibição de gráficos de preços.

## Estrutura do Projeto

```
/
├── css/
│   └── style.css         # Folha de estilos principal
├── img/
│   ├── Cripto.jpg        # Imagem do logo
│   └── criptowide.jpg    # Imagem do logo wide
│   └── criptohunter.mp4  # Vídeo de fundo
├── js/
│   ├── header.js         # Lógica para a barra de pesquisa no cabeçalho
│   ├── script.js         # Lógica para a página inicial
│   ├── detail.js         # Lógica para a página de detalhes da moeda
│   └── watchlist.js      # Lógica para a página da watchlist
├── index.html            # Página inicial
├── detail.html           # Página de detalhes da moeda
└── watchlist.html        # Página da watchlist
└── README.md             # Este arquivo
```

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/CriptoHunter.git
   ```
2. Abra o arquivo `index.html` em seu navegador de preferência.

Não é necessário instalar nenhuma dependência, pois todas as bibliotecas são carregadas via CDN.
