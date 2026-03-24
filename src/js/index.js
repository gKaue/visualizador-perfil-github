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

        searchContainer.classList.add('hide');
        profileResults.classList.remove('hide');

        //exibir resultados encontrados (TODO: implementar exibição dos dados do perfil do usuário encontrado)
        console.log(data);
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

// botao de limpar resultados (TODO: implementar funcionalidade de limpar resultados e voltar para a tela de busca)