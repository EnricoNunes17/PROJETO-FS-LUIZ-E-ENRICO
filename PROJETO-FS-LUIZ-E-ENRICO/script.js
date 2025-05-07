const canvas = document.getElementById("canvas");
const points = document.getElementById("points");

// Cria 225 quadrados (15x15)
for (let i = 0; i < 225; i++) {
    let quadrado = document.createElement("div");
    canvas.appendChild(quadrado);
}
const quadrados = document.querySelectorAll("#canvas div"); // corrigido: ID com # e não tag

const ovnis = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

let posicao_do_tanque = 202;
let medida = 15;
let direcao = 1;
let descer = true;
let ovnisid;

quadrados[posicao_do_tanque].classList.add("tanque");

// Corrigido nome da classe para coincidir com .ovnis
ovnis.forEach(i => {
    quadrados[i].classList.add("ovnis");
});

document.addEventListener("keydown", movertanque);
ovnisid = setInterval(moverovni, 300); 
document.addEventListener("keydown", raio_lazer);

// ⛔ Corrigido: uso de 'p' para 'e' (evento)
function movertanque(e) {
    quadrados[posicao_do_tanque].classList.remove("tanque");

    if (e.keyCode === 37) {
        if (posicao_do_tanque % medida !== 0) {
            posicao_do_tanque--;
        }
    } else if (e.keyCode === 39) {
        if (posicao_do_tanque % medida !== medida - 1) {
            posicao_do_tanque++;
        }
    }

    quadrados[posicao_do_tanque].classList.add("tanque");
}

function moverovni() {
    // ⛔ Corrigido: 'tamanho' para 'medida'
    const ladoEsquerdo = ovnis[0] % medida === 0;
    const ladoDireito = ovnis[ovnis.length - 1] % medida === medida - 1;

    // Remover todos os OVNIs antes de mover
    ovnis.forEach(i => {
        quadrados[i].classList.remove("ovnis");
    });

    // Mudar direção se estiver na borda
    if (ladoEsquerdo && direcao === -1) {
        direcao = 1;
        descer = true;
    } else if (ladoDireito && direcao === 1) {
        direcao = -1;
        descer = true;
    }

    for (let i = 0; i < ovnis.length; i++) {
        ovnis[i] += descer ? medida : direcao;
    }
    descer = false;

    // Adiciona OVNIs nas novas posições
    ovnis.forEach(i => {
        quadrados[i].classList.add("ovnis");
    });
}

// ⛔ Corrigido: função de disparar laser não estava sendo usada, e tinha erro com 'p'
function raio_lazer(e) {
    let lazerid;
    let posicaolazer = posicao_do_tanque;

    if (e.keyCode === 32) {
        lazerid = setInterval(moverlazer, 100);
    }

    function moverlazer() {
        quadrados[posicaolazer].classList.remove('lazer');
        posicaolazer -= medida;

        if (posicaolazer < 0) {
            clearInterval(lazerid);
            return;
        }

        quadrados[posicaolazer].classList.add('lazer');
    }
}