let scrollingInterval; // Variável para armazenar o intervalo da rolagem
let audio; // Declarar a variável do áudio global
let isSpeaking = false; // Estado do leitor de voz
let isScrolling = false; // Estado da rolagem automática

// Função para inicializar o áudio
function initAudio() {
    if (!audio) { // Inicializa o áudio apenas se não estiver inicializado
        audio = new Audio('sound/sound.mp3'); // Substitua pelo caminho correto da sua música
        audio.loop = true; // Repetir a música
        audio.play().catch(error => {
            console.error("Erro ao tentar reproduzir a música: ", error);
        });
    }
}

// Função para rolagem automática
function autoScroll() {
    const container = document.querySelector('.container');
    if (container.scrollTop + container.clientHeight < container.scrollHeight) {
        container.scrollTop += 1; // Mover um pixel para baixo
    } else {
        container.scrollTop = 0; // Reiniciar a rolagem
    }
}

// Função para iniciar a rolagem
function startScrolling() {
    isScrolling = true;
    scrollingInterval = setInterval(autoScroll, 100); // Ajuste a velocidade aqui (100ms)
}

// Função para parar a rolagem
function stopScrolling() {
    isScrolling = false;
    clearInterval(scrollingInterval);
}

// Função para iniciar o leitor de voz
function startVoice(container) {
    const text = container.innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'pt-BR'; // Defina o idioma como Português
    speech.volume = 1; // Volume máximo
    speech.rate = 1; // Velocidade normal
    speech.pitch = 1; // Tom normal

    window.speechSynthesis.speak(speech); // Começa a falar
    startScrolling(); // Inicia a rolagem

    // Para de rolar e de falar ao finalizar
    speech.onend = function () {
        stopScrolling(); // Para a rolagem ao terminar a fala
    };
}

// Função principal de inicialização
window.onload = function () {
    // Inicializar áudio
    initAudio();

    // Configurar rolagem automática
    const container = document.querySelector('.container');

    // Criar botão de play/pause
    const playPauseButton = document.createElement('button');
    playPauseButton.innerText = '►'; // Símbolo de play
    playPauseButton.className = 'voice-button'; // Adiciona a classe para estilização
    document.body.appendChild(playPauseButton);

    // Controlar play e pause
    playPauseButton.onclick = function () {
        if (isSpeaking) {
            window.speechSynthesis.cancel(); // Para a fala
            stopScrolling(); // Para a rolagem
            playPauseButton.innerText = '►'; // Muda para play
            isSpeaking = false;
        } else {
            startVoice(container); // Começa a falar
            playPauseButton.innerText = '❚❚'; // Muda para pause
            isSpeaking = true;
        }
    };

    // Cancelar fala ao mudar de página
    window.onbeforeunload = function () {
        window.speechSynthesis.cancel(); // Para a fala ao sair da página
        stopScrolling(); // Para a rolagem ao sair da página
    };
};
