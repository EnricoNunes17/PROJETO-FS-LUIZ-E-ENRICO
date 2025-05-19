// Seleciona o elemento do canvas (onde o jogo acontece) e o elemento de pontos
const canvas = document.getElementById("canvas");
const points = document.getElementById("points");

// Cria 225 quadrados (15x15) para formar a grade do jogo
for (let i = 0; i < 225; i++) {
    let quadrado = document.createElement("div");
    canvas.appendChild(quadrado);
}

// Seleciona todos os quadrados criados dentro do canvas
const quadrados = document.querySelectorAll("#canvas div");

// Define as posições iniciais dos OVNIs (índices dos quadrados)
const ovnis = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

// Define a posição inicial do tanque (embaixo da tela)
let posicao_do_tanque = 202;
// Medida do lado do grid (15x15)
let medida = 15;
// Direção inicial dos OVNIs (1 = direita, -1 = esquerda)
let direcao = 1;
// Flag para os OVNIs devem descerem
let descer = true;
// ID do intervalo dos OVNIs (para parar depois)
let ovnisid;
// Pontuação do jogador
let pontos = 0;

// Adiciona a classe "tanque" ao quadrado onde o tanque está
quadrados[posicao_do_tanque].classList.add("tanque");

//adiciona a classe "ovnis" para todos os OVNIs no início do jogo
ovnis.forEach(ovni => {
    quadrados[ovni].classList.add("ovnis");
});

// Adiciona eventos de teclado para mover o tanque e disparar o laser
document.addEventListener("keydown", movertanque);
ovnisid = setInterval(moverovni, 300); // Move os OVNIs a cada 300ms
document.addEventListener("keydown", raio_lazer); // Dispara o laser ao pressionar espaço

// Função para mover o tanque para esquerda/direita
function movertanque(e) {
    // Remove a classe "tanque" da posição atual
    quadrados[posicao_do_tanque].classList.remove("tanque");

    // Se seta esquerda e não está na borda esquerda, move para a esquerda
    if (e.keyCode === 37) {
        if (posicao_do_tanque % medida !== 0) {
            posicao_do_tanque--;
        }
    // Se seta direita e não está na borda direita, move para a direita
    } else if (e.keyCode === 39) {
        if (posicao_do_tanque % medida !== medida - 1) {
            posicao_do_tanque++;
        }
    }

    // Adiciona a classe "tanque" na nova posição
    quadrados[posicao_do_tanque].classList.add("tanque");
}

// Função para mover os OVNIs
function moverovni() {
    // Checa se algum OVNI está na borda esquerda ou direita
    const ladoEsquerdo = ovnis[0] % medida === 0;
    const ladoDireito = ovnis[ovnis.length - 1] % medida === medida - 1;

    // Remove a classe "ovnis" de todos os quadrados atuais dos OVNIs
    ovnis.forEach(i => {
        quadrados[i].classList.remove("ovnis");
    });

    // Se chegou na borda, muda a direção e faz os OVNIs descerem
    if (ladoEsquerdo && direcao === -1) {
        direcao = 1;
        descer = true;
    } else if (ladoDireito && direcao === 1) {
        direcao = -1;
        descer = true;
    }

    // Move cada OVNI para a próxima posição (horizontal ou descendo)
    for (let i = 0; i < ovnis.length; i++) {
        ovnis[i] += descer ? medida : direcao;
    }
    descer = false;

    // Adiciona a classe "ovnis" nas novas posições
    ovnis.forEach(i => {
        quadrados[i].classList.add("ovnis");
    });

    // Se algum OVNI chegou na última linha, mostra imagem de game over e para o jogo
    if (ovnis[ovnis.length - 1] > quadrados.length - medida) {
        mostrarImagemFinal('gameover.jpg');
        clearInterval(ovnisid);
    }

    // Se um OVNI colidiu com o tanque, mostra explosão e game over
    if (quadrados[posicao_do_tanque].classList.contains('ovnis')) {
        quadrados[posicao_do_tanque].classList.add('explosion');
        mostrarImagemFinal('gameover.jpg');
        clearInterval(ovnisid);
    }

    // Se todos os OVNIs foram destruídos, mostra imagem de vitória
    if (ovnis.length === 0) {
        mostrarImagemFinal('youwin.jpg');
        clearInterval(ovnisid);
    }

    // Função para mostrar imagem final (game over ou vitória)
    function mostrarImagemFinal(caminho) {
        const div = document.getElementById("resultado");
        const img = document.getElementById("img-resultado");
        img.src = caminho;
        div.style.display = "flex";

        setTimeout(() => {
            location.reload();
        }, 3000); // Recarrega a página após 3 segundos
    }
}

// Função para disparar o laser
function raio_lazer(e) {
    let lazerid;
    let posicaolazer = posicao_do_tanque;

    // Se pressionou espaço (código 32), dispara o laser
    if (e.keyCode === 32) {
        lazerid = setInterval(moverlazer, 100);
    }

    // Função para mover o laser para cima
    function moverlazer() {
        // Remove a classe "lazer" da posição anterior
        quadrados[posicaolazer].classList.remove('lazer');
        // Move o laser uma linha para cima
        posicaolazer -= medida;

        // Se saiu do topo, para o laser
        if (posicaolazer < 0) {
            clearInterval(lazerid);
            return;
        }

        // Adiciona a classe "lazer" na nova posição
        quadrados[posicaolazer].classList.add('lazer');

        // Se acertou um OVNI - (Usamos o auxilio da Inteligência artificial a partir daqui)
        if (quadrados[posicaolazer].classList.contains("ovnis")) {
            quadrados[posicaolazer].classList.remove('lazer');
            quadrados[posicaolazer].classList.remove('ovnis');
            quadrados[posicaolazer].classList.add('explosion');

            // Remove a explosão após 300ms
            setTimeout(() => {
                quadrados[posicaolazer].classList.remove('explosion');
            }, 300);

            clearInterval(lazerid);

            // Remove o OVNI atingido da lista - (Terminamos de usar o auxilio da Inteligência artificial aqui)
            const index = ovnis.indexOf(posicaolazer);
            if (index !== -1) {
                ovnis.splice(index, 1);
            }

            // Atualiza a pontuação
            pontos++;
            points.innerHTML = pontos;
        }
    }
}
 
