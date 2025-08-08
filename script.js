//getElements
const initGame = document.querySelector("#play-game");
const mainBoard = document.querySelector(".main-board");
const userBoard = document.querySelector(".user-board");
const gameDashboard = document.querySelector(".game-dashboard");

const userChoices = document.querySelector(".user-choices");

const initRound = document.querySelector("#play-round");

const nextRound = document.querySelector("#next-round");

const buttonsExit = document.querySelectorAll(".exit");
const firstExit = buttonsExit[0];
const secondExit = buttonsExit[1];

const MAX_ROUNDS = 5;

const CHOICES = {
    ROCK: 1, 
    PAPER: 2, 
    SCISSORS: 3,
};

const CHOICES_NAMES = {
    ROCK: "rock",
    PAPER: "paper",
    SCISSORS: "scissors",
}

const NAMES_TRADUZIDOS = {
    [CHOICES.ROCK]: "Pedra",
    [CHOICES.PAPER]: "Papel",
    [CHOICES.SCISSORS]: "Tesoura",
};

const ROUND_RESULT = {
    HUMAN_WIN: "human",
    BOT_WIN: "bot",
    TIE: 'tie',
};

// A variável que armazena a escolha do jogador precisa ser global
let humanChoice = null;
let gameState;

// Adiciona event listener para armazenar a escolha do jogador
userChoices.addEventListener('click', (e) => {
    // Chamamos a função getHumanChoice para validar e pegar o valor
    humanChoice = getHumanChoice(e);
});

// Adiciona um listener para começar o jogo
initGame.addEventListener('click', () => {
    // Mostra o painel de rodada e inicializa o estado do jogo
    showRoundPanel();
    gameState = initializeGameState();
    // Inicia o fluxo do jogo
    handleRoundStartClick();
});

async function handleRoundStartClick() {
    // Essa promise vai esperar o clique no botão "Jogar" ou "Encerrar"
    const shouldContinue = await waitForPlayOrExit();
    
    if (shouldContinue) {
        // Se o jogador clicou em "Jogar"
        if (humanChoice) {
            console.log('Tudo certo! O jogo pode continuar.');
            playRound(humanChoice, gameState);
            showResultsPanel();

            // Await agora para esperar o clique de "Próxima Rodada" ou "Encerrar"
            const shouldGoToNextRound = await waitForNextOrExit();
            
            if (shouldGoToNextRound) {
                humanChoice = null; // Limpa a escolha para a próxima rodada
                showRoundPanel();
                handleRoundStartClick(); // Chama a próxima rodada
            } else{
                displayFinalResult(gameState);
                showInicialPanel();
                return;
            }
        } else {
            alert('Por favor, escolha Pedra, Papel ou Tesoura antes de jogar!');
            // Se o jogador não escolheu, esperamos novamente pelo clique
            handleRoundStartClick(); 
        }
    } else {
        // Se o jogador clicou em "Encerrar"
        displayFinalResult(gameState);
        showInicialPanel();
    }
}

function initializeGameState(){
    return {
        humanScore: 0,
        botScore: 0,
    };
}

function playRound(humanChoice, gameState){
    
    const botChoice = getBotChoice();
    const roundResult = determineRoundWinner(humanChoice, botChoice);

    updateGameState(gameState, roundResult);

    displayRoundResult(humanChoice, botChoice, gameState, 1, roundResult);
}

function getHumanChoice(e){
    let choice = e.target.id;

    switch(choice){
        case CHOICES_NAMES.ROCK: return CHOICES.ROCK;
        case CHOICES_NAMES.PAPER: return CHOICES.PAPER;
        case CHOICES_NAMES.SCISSORS: return CHOICES.SCISSORS;
        default: return null;
    }
}

function getBotChoice(){
    return Math.ceil(Math.random() * 3);
}

function determineRoundWinner(humanChoice, botChoice){
    if(humanChoice === botChoice)
        return ROUND_RESULT.TIE;

    if (humanChoice.ROCK)
        return botChoice.SCISSORS ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;

    if (humanChoice.PAPER)
        return botChoice.ROCK ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
    
    if (humanChoice.SCISSORS)
        return botChoice.PAPER ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
}

function updateGameState(gameState, roundResult){
    if(roundResult === ROUND_RESULT.HUMAN_WIN)
        gameState.humanScore++;
    else if(roundResult === ROUND_RESULT.BOT_WIN)
        gameState.botScore++;
}

function displayRoundResult(humanChoice, botChoice, gameState, round, roundResult){

    const roundMessage = createRoundMessage(humanChoice, botChoice, roundResult);

        document.querySelector("#round-indicator span").textContent = round;
        document.querySelector("#human-choice-name").textContent = NAMES_TRADUZIDOS[humanChoice];
        document.querySelector("#bot-choice-name").textContent =  CHOICE_NAMES[botChoice];
        document.querySelector("#round-message-winner").textContent = roundMessage;
        document.querySelector("#human-score").textContent = gameState.humanScore;
        document.querySelector("#bot-score").textContent = gameState.botScore;

        document.querySelector("#round-counter #round-actual").textContent = round;
        document.querySelector("#round-counter #round-total").textContent = MAX_ROUNDS;
}

function createRoundMessage(humanChoice, botChoice, roundResult){
    switch(roundResult){
        case ROUND_RESULT.HUMAN_WIN:
            return `Você VENCEU nesta rodada! ${CHOICE_NAMES[humanChoice]} ganha de ${CHOICE_NAMES[botChoice]}`;
        case ROUND_RESULT.BOT_WIN:
            return `Você PERDEU nesta rodada! ${CHOICE_NAMES[botChoice]} ganha de ${CHOICE_NAMES[humanChoice]}`;
        case ROUND_RESULT.TIE:
            return "Houve EMPATE"; 
    }
}

function displayFinalResult(gameState){
    const {humanScore, botScore} = gameState;
    let message;
    
    if(humanScore > botScore)
        message = "PARABÉNS, Você VENCEU o jogo!";
    else  if(humanScore < botScore)
        message = "QUE PENA, Você PERDEU o jogo!";
    else
        message = "JOGO EQUILIBRADO, Houve EMPATE!";

    message += `\n \t Seu Score: ${humanScore} \n \t Computador Score: ${botScore}`;
    alert(message);
}

//funções para modificar displays do jogo
function showInicialPanel(){
    mainBoard.classList.remove('block');
    mainBoard.classList.add('none');

    initGame.classList.remove('none');
    
    gameDashboard.classList.remove('flex');
    gameDashboard.classList.add('none');
}

function showRoundPanel(){
    initGame.classList.add('none');

    mainBoard.classList.remove('none');
    mainBoard.classList.add('block');
   
    userBoard.classList.remove('none');
    userBoard.classList.add('flex');

    gameDashboard.classList.remove('flex');
    gameDashboard.classList.add('none');
}

function showResultsPanel(){
    userBoard.classList.remove('flex');
    userBoard.classList.add('none');

    gameDashboard.classList.remove('none');
    gameDashboard.classList.add('flex');
}

async function waitForPlayOrExit(){
    return new Promise((resolve) => {

        function handlePlayOrExit(e){

            initRound.removeEventListener('click', handlePlayOrExit);
            firstExit.removeEventListener('click', handlePlayOrExit);

            if(e.target.id.includes("play")){
                resolve(true);                   
            } else if(e.target.id.includes("exit")){                              
                resolve(false);
            }
        }

        firstExit.addEventListener('click', handlePlayOrExit);
        initRound.addEventListener('click', handlePlayOrExit);
    })
}

async function waitForNextOrExit(){
    return new Promise((resolve) => {

        nextRound.removeEventListener('click', handleNextOrExit);
        secondExit.removeEventListener('click', handleNextOrExit);

        function handleNextOrExit(e){
            if(e.target.id.includes("next")){
                resolve(true);
            } else if(e.target.id.includes("exit")){
                resolve(false);
            }
        }
        secondExit.addEventListener('click', handleNextOrExit);
        nextRound.addEventListener('click', handleNextOrExit);
    })
}
