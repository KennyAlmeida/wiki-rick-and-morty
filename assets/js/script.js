var container = document.getElementById('rick');

function getPersonagens (){
    fetch('https://rickandmortyapi.com/api/character/')
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        criarCards(data);
        paginacao(data.info, 1);
    })
}

getPersonagens();

function criarCards(data){
    var card = document.createElement('div');

    data.results.forEach(function(personagem){
        var card = document.createElement('div');

        var idPersonagem = personagem.id;
        card.classList.add('card');
        card.id = "personagem-" + idPersonagem;


        card.innerHTML = `
        <a href="#" onclick="getPerfil(${personagem.id})">
            <img src="${personagem.image}" alt="${personagem.name}">
            <h2>${personagem.name}</h2>
            <p>${personagem.species}</p>
        </a>
        `;
        container.appendChild(card);
    })
}


function getPerfil(id){
    fetch('https://rickandmortyapi.com/api/character/'+id)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        criarPerfil(data);
    })
}

function criarPerfil(data){
    container.innerHTML = '';

    var perfil = document.createElement('div');
    perfil.classList.add('perfil');
    perfil.innerHTML = `
    <a href="#" onclick="voltarIncio()">Voltar</a>
        <img src="${data.image}" alt="${data.name}">
        <h2>${data.name}</h2>
        <p>${data.species}</p>
    `;
    container.appendChild(perfil);
}

function voltarIncio(){
    container.innerHTML = '';
    getPersonagens();
}

var search = document.getElementById('search');

search.addEventListener('keyup', function(){
    var cards = document.querySelectorAll('.card');
    var searchValue = search.value.toLowerCase();

    if(searchValue.length > 0){
        getPesquisa(searchValue);
    }else{
        container.innerHTML = '';
        getPersonagens();
    }

    
})

function getPesquisa(searchValue){
    fetch('https://rickandmortyapi.com/api/character/?name='+searchValue)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        container.innerHTML = '';
        criarCards(data);
        paginacao(data.info, 1, searchValue);
    })
}

function paginacao(info, pagina, searchValue){
    var paginacao = document.getElementById('paginacao');

    paginacao.innerHTML = '';
    
    var paginaAnterior = document.createElement('a');
    paginaAnterior.classList.add('anterior');
    paginaAnterior.innerHTML = 'Anterior';

    var paginaProxima = document.createElement('a');
    paginaProxima.classList.add('proxima');
    paginaProxima.innerHTML = 'Próxima';

    var inputPagina = document.createElement('input');
    inputPagina.type = 'number';
    inputPagina.value = pagina;
    inputPagina.min = 1;
    inputPagina.max = info.pages;

    inputPagina.addEventListener('change', function(){
        if(searchValue){
            getPagina(inputPagina.value, searchValue);
        }else{
            getPagina(inputPagina.value);
        }
    })

    if(info.prev == null){
        paginaAnterior.classList.add('disabled');
    }else{
        paginaAnterior.href = '#';
        paginaAnterior.addEventListener('click', function(){
            getPagina(pagina-1, searchValue);
        })
    }

    if(info.next == null){
        paginaProxima.classList.add('disabled');
    }else{
        paginaProxima.href = '#';
        paginaProxima.addEventListener('click', function(){
            getPagina(pagina+1, searchValue);
        })
    }
    

    paginacao.appendChild(paginaAnterior);
    paginacao.appendChild(inputPagina);
    paginacao.appendChild(paginaProxima);   


}

function getPagina(pagina, searchValue){
    if(searchValue){

    fetch(`https://rickandmortyapi.com/api/character/?page=${pagina}&name=${searchValue}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        container.innerHTML = '';
        criarCards(data);
        paginacao(data.info, pagina, searchValue);
    })

    }else{
        fetch('https://rickandmortyapi.com/api/character/?page='+pagina)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            container.innerHTML = '';
            criarCards(data);
            paginacao(data.info, pagina);
        })
    }
}