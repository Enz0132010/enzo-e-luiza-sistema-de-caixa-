// ==========================================
// CONFIGURAÇÕES DO CAIXA
// ==========================================

let saldo = 1000;

const notasDisponiveis = [100, 50, 20, 10, 5, 2];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const inputValor = document.getElementById("valor");
const botaoSacar = document.getElementById("sacar");

const elementoSaldo = document.getElementById("saldo");
const mensagem = document.getElementById("mensagem");

const resultado = document.getElementById("resultado");
const notasContainer = document.getElementById("notas");
const valorSacado = document.getElementById("valorSacado");


// ==========================================
// FORMATAÇÃO DE MOEDA
// ==========================================

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ==========================================
// ATUALIZAR SALDO
// ==========================================

function atualizarSaldo() {
    elementoSaldo.textContent = formatarMoeda(saldo);
}


// ==========================================
// MENSAGENS
// ==========================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = "mensagem " + tipo;
}


function limparMensagem() {

    mensagem.textContent = "";

    mensagem.className = "mensagem";
}


// ==========================================
// LIMPAR RESULTADO
// ==========================================

function limparResultado() {

    notasContainer.innerHTML = "";

    resultado.style.display = "none";
}


// ==========================================
// CALCULAR NOTAS
// ==========================================

function calcularNotas(valor) {

    let restante = valor;

    const notas = [];

    for (const nota of notasDisponiveis) {

        const quantidade = Math.floor(restante / nota);

        if (quantidade > 0) {

            notas.push({
                valor: nota,
                quantidade: quantidade
            });

            restante -= nota * quantidade;
        }
    }

    // Se sobrar algum valor, significa
    // que não foi possível montar o saque.
    if (restante !== 0) {
        return null;
    }

    return notas;
}


// ==========================================
// MOSTRAR NOTAS NA TELA
// ==========================================

function mostrarNotas(notas) {

    notasContainer.innerHTML = "";

    notas.forEach(item => {

        const elemento = document.createElement("div");

        elemento.classList.add("nota");

        elemento.innerHTML = `
            <span class="nota-valor">
                R$ ${item.valor},00
            </span>

            <span class="nota-quantidade">
                ${item.quantidade}x
            </span>
        `;

        notasContainer.appendChild(elemento);
    });
}


// ==========================================
// REALIZAR SAQUE
// ==========================================

function realizarSaque() {

    limparMensagem();
    limparResultado();

    const valor = Number(inputValor.value);


    // ------------------------------
    // VALOR VAZIO
    // ------------------------------

    if (inputValor.value.trim() === "") {

        mostrarMensagem(
            "Digite o valor que deseja sacar.",
            "erro"
        );

        inputValor.focus();

        return;
    }


    // ------------------------------
    // VALOR INVÁLIDO
    // ------------------------------

    if (!Number.isInteger(valor) || valor <= 0) {

        mostrarMensagem(
            "Digite um valor inteiro maior que zero.",
            "erro"
        );

        inputValor.focus();

        return;
    }


    // ------------------------------
    // SALDO INSUFICIENTE
    // ------------------------------

    if (valor > saldo) {

        mostrarMensagem(
            `Saldo insuficiente. Seu saldo é ${formatarMoeda(saldo)}.`,
            "erro"
        );

        inputValor.focus();

        return;
    }


    // ------------------------------
    // CALCULAR NOTAS
    // ------------------------------

    const notas = calcularNotas(valor);


    // ------------------------------
    // VALOR NÃO DISPONÍVEL
    // ------------------------------

    if (notas === null) {

        mostrarMensagem(
            "Esse valor não pode ser formado com as notas disponíveis.",
            "erro"
        );

        inputValor.focus();

        return;
    }


    // ------------------------------
    // ATUALIZAR SALDO
    // ------------------------------

    saldo -= valor;

    atualizarSaldo();


    // ------------------------------
    // MOSTRAR RESULTADO
    // ------------------------------

    valorSacado.textContent = formatarMoeda(valor);

    mostrarNotas(notas);

    resultado.style.display = "block";


    mostrarMensagem(
        "Saque realizado com sucesso!",
        "sucesso"
    );


    // ------------------------------
    // LIMPAR INPUT
    // ------------------------------

    inputValor.value = "";

    inputValor.focus();
}


// ==========================================
// EVENTOS
// ==========================================

botaoSacar.addEventListener(
    "click",
    realizarSaque
);


inputValor.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            realizarSaque();
        }
    }
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarSaldo();