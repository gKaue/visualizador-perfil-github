// Elementos do DOM --------------
const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');

const searchContainer = document.getElementById('search-container');
const profileResults = document.getElementById('profile-results');

const BASE_URL = 'https://api.github.com';

// Funções ----------

const searchUser = async (username) => {
    try {
        const response = await fetch (`${BASE_URL}/users/${username}`);
        if (!response.ok){
            throw new Error('Usuário não encontrado. Por favor, verifique o nome de usuário e tente novamente.');
            return;
        }
        const data = await response.json();

        const reposResponse = await fetch (`${BASE_URL}/users/${username}/repos?sort=created&direction=desc&per_page=10`);
        if (!reposResponse.ok) {
            throw new Error('Erro ao buscar repositórios do usuário. Por favor, tente novamente mais tarde.');
            return;
        }
        const reposData = await reposResponse.json();

        searchContainer.classList.add('hide');
        profileResults.classList.remove('hide');

        profileResults.innerHTML = `
            <div id="profile-container">
                <div id="profile-info">
                    <img src="${data.avatar_url}" alt="Avatar de ${data.login}" id="profile-avatar">
                    <h1 id="profile-name">${data.name || data.login}</h1>
                    <h2 id="profile-username">${data.login}</h2>
                    <p id="profile-bio">${data.bio || 'Sem biografia disponível.'}</p>
                    <p id="profile-followers">Seguidores: ${data.followers}</p>
                    <p id="profile-following">Seguindo: ${data.following}</p>
                </div>
                <div id="profile-stats">
                    <h3>Repositórios Públicos: ${data.public_repos}</h3>
                    <div id="languages-chart">
                        <p>Linguagens Utilizadas:</p>
                        <canvas id="languagesChart" width="400" height="400"></canvas>
                    </div>
                    <a href="${data.html_url}" target="_blank" id="profile-link">Ver no GitHub</a>
                    <a href="#" id="btn-back">Voltar</a>
                </div>
            </div>
            <div id="repos-container">
                <h2>Repositórios Recentes:</h2>
                <div id="repos-list">
                    ${
                        reposData.length > 0
                        ? reposData.map(repo => `
                            <div class="repo-item">
                                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                                <p class="repo-description">${repo.description || 'Sem descrição disponível.'}</p>
                                <div class="repo-stats">
                                    <p class="repo-stars">⭐ ${repo.stargazers_count}</p>
                                    <p class="repo-forks">🍴 ${repo.forks_count}</p>
                                    <p class="repo-watchers">👀 ${repo.watchers_count}</p>
                                    <p class="repo-language">${repo.language || 'Linguagem não especificada.'}</p>
                                    <p class="repo-updated">Última atualização: ${new Date(repo.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        `).join('')
                        : '<p>Nenhum repositório encontrado.</p>'
                    }
                </div>
            </div>
        `;

        // botao de voltar e limpar resultados
        const btnBack = document.getElementById('btn-back');
        btnBack.addEventListener('click', (e) => {
            e.preventDefault();
            profileResults.classList.add('hide');
            searchContainer.classList.remove('hide');
            inputSearch.value = '';
        });

        // Gerar gráfico de linguagens
        const languageCount = {};
        for (const repo of reposData) {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        };

        const labelLanguages = Object.keys(languageCount);
        const dataLanguages = Object.values(languageCount);

        const ctx = document.getElementById('languagesChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labelLanguages,
                datasets: [{
                    data: dataLanguages,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#999999'
                    ]
                }]
            }
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        alert(`Erro ao buscar usuário: ${error.message}`);
        inputSearch.value = ''; // limpa o campo de busca após um erro
    }
}

// Eventos ---------

// botao de busca
btnSearch.addEventListener('click', (e) => {
    e.preventDefault();

    const inputValue = inputSearch.value.trim();

    if (inputValue) {
        searchUser(inputValue);
    } else {
        alert ('Por favor, digite o nome de um usuário do GitHub para buscar.');
    }
});