function novoElemento(tagName, className){
    const elemento = document.createElement(tagName)
    elemento.className = className

    return elemento
}

//criando barreira
function criarBarreira(reversa = false, posicao){
    this.elemento = novoElemento('div', `barreira ${posicao}`)

    const corpo = novoElemento('div', 'corpo')
    const borda = novoElemento('div', 'borda')

    this.elemento.appendChild(reversa ? borda : corpo )
    this.elemento.appendChild(reversa ? corpo : borda)
    
    this.setAltura = altura => corpo.style.height = `${altura}px`  
}

//par de barreiras (inferior e superior)

function criarParDeBarreiras(abertura, posInicialX){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    const superior = new criarBarreira(false, 'superior')
    const meio = novoElemento('div', 'meio')
    const inferior = new criarBarreira(true, 'inferior')

    this.elemento.appendChild(superior.elemento)
    this.elemento.appendChild(meio)
    this.elemento.appendChild(inferior.elemento)

    this.posicaoInicial = () => this.elemento.style.left = `${posInicialX}px`

    this.getPosX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = (novoX) => this.elemento.style.left = `${novoX}px` 

    // gera abertura aleatoria dos canos
    this.randomAbertura = () => {
        const alturaSuperior = Math.random() * (500 - abertura) // altura da tela game - abertura
        const alturaInferior = 500 - abertura - alturaSuperior

        superior.setAltura(alturaSuperior)
        inferior.setAltura(alturaInferior)
    }
    this.randomAbertura()
 
    this.coordenadasMeio = () => meio.getBoundingClientRect()

    this.coordenadasCanoSuperior = () => superior.elemento.getBoundingClientRect()
    this.coordenadasCanoInferior = () => inferior.elemento.getBoundingClientRect()
}


// todas as barreiras do game
function barreiras(abertura, posicaoInicial) {
     this.pares = [
        new criarParDeBarreiras(abertura,posicaoInicial),
        new criarParDeBarreiras(abertura, posicaoInicial + 400),
        new criarParDeBarreiras(abertura, posicaoInicial  + 800),
        new criarParDeBarreiras(abertura, posicaoInicial + 1200 )
    ]   
}

function passaro(){
    this.passaro = novoElemento('img', 'passaro')
    this.passaro.src = 'passaro.png'

    this.y = 350 //posicao vertical
    this.vy = 0 //velocidade vertical

    this.setY = novoY => this.passaro.style.top = `${novoY}px` 
    this.salto = () => this.vy = -8

    this.coordenadasPassaro = () => this.passaro.getBoundingClientRect()
}

///////////////////////////////////////////////
function progresso() {
    this.progresso = novoElemento('h1', 'progresso')
    this.novaPontuacao = pontuacao => this.progresso.innerHTML = `${pontuacao}`

}


function flappy() {
    const tela = document.querySelector('.tela-game')
        
    //-----------------------------barreira-----------------------------------------
    const cano = new barreiras(170, 1000)        
    cano.pares.forEach(par => {
        tela.appendChild(par.elemento)
        par.posicaoInicial()
    })

    function animarBarreira(){
        cano.pares.forEach(par => {
            //movimento das barreiras
            let x = par.getPosX()
            let vx = -5
            par.setX(x + vx)

            //voltando a pos inicial
            if (x === -150){
                par.setX(1500)
                par.randomAbertura()
            }
                
        })
        
    }
 //---------------------------------passaro---------------------------------
    const bird = new passaro()
    bird.passaro.style.top = '350px'
    tela.appendChild(bird.passaro)
    window.onkeydown = e => bird.salto()
    window.onclick = e => bird.salto( )

    function animarPassaro(){
    
        bird.vy += 0.5 //gravidade
        bird.y += bird.vy  // efeito do passaro caindo ou subindo
        bird.setY(bird.y)

        
    }
    
    const barraProgresso = new progresso
    tela.appendChild(barraProgresso.progresso)

// ----------------------------------------- pontuaçao -----------------------------------------
    let pontuacao = 0
    barraProgresso.novaPontuacao(0)
    function PassouNoMeio() {
        let coordenadasPassaro = bird.coordenadasPassaro()
        cano.pares.forEach(par => {
        let coordenadasMeio = par.coordenadasMeio()
        
        if ((coordenadasPassaro.x === coordenadasMeio.x) && (coordenadasPassaro.top >= coordenadasMeio.top) && (coordenadasPassaro.bottom <= coordenadasMeio.bottom)) {
                pontuacao = pontuacao + 1
                barraProgresso.novaPontuacao(pontuacao)
        }
        })
         

    }
    
//---------------------------------------colisao--------------------------------------------

    const colisao = () => {
        let colidiu = false
        let p = bird.coordenadasPassaro()
        cano.pares.forEach( par => {
            let s = par.coordenadasCanoSuperior()
            let i = par.coordenadasCanoInferior()

            if(
                ((p.left + p.width >= s.left 
                && s.left + s.width >= p.left) 
                && (p.top + p.height >= i.top         //colisao barreira inferior
                && i.top + i.height >= p.top)))
                    colidiu = true
    
            else if ((p.left + p.width >= i.left 
                && i.left + i.width >= p.left)        // colisao barreira superior
                && (p.top + p.height >= s.top 
                && s.top + s.height >= p.top))
                    colidiu = true
            
            else if (parseInt(bird.passaro.style.top.split('px')[0]) >= 550 ||
            parseInt(bird.passaro.style.top.split('px')[0]) <= 0) // colisao com o chao
                    colidiu = true
        }) 
        return colidiu
    }
    
    const animacoes = setInterval(()=> {
        animarBarreira()
        animarPassaro()
        PassouNoMeio()

        if(colisao() == true)
            clearInterval(animacoes)
        
    },15)
    
} 


flappy()
document.querySelector('.content').style.height = window.innerHeight 