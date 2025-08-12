//getElements
const playGameBtn = document.querySelector("#play-game");
const mainBoard = document.querySelector(".main-board");
const userBoard = document.querySelector(".user-board");
const userChoices = document.querySelector(".user-choices");
const initRound = document.querySelector("#play-round");
const buttonsExit = document.querySelectorAll(".exit");
const firstExit = buttonsExit[0];
const secondExit = buttonsExit[1];
const gameDashboard = document.querySelector(".game-dashboard");
const nextRound = document.querySelector("#next-round");
const controlGameButtons = document.querySelector(".game-dashboard .control-game");
const finalResult = document.querySelector(".final-result");
const resetBtn = document.querySelector("#reset-button");

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

const CHOICES_NAMES_PT = {
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
let gameState = {
        round: 1,
        maxRounds: 5,
        humanChoice: null,
        humanScore: 0,
        botScore: 0,
    };

// Adiciona event listener para armazenar a escolha do jogador
userChoices.addEventListener('click', (e) => {
    // Chamamos a função getHumanChoice para validar e pegar o valor
    gameState.humanChoice = getHumanChoice(e);
});

// Adiciona um listener para começar o jogo
playGameBtn.addEventListener('click', () => {
    // Mostra o painel de rodada e inicializa o estado do jogo
    showRoundPanel();
    initNewGame(gameState);
});

resetBtn.addEventListener('click', showInicialPanel);

function initNewGame(gameState){
    resetGame(gameState); //Reseta variáveis do Jogo
    handleRoundStartClick(gameState);// Inicia o fluxo principal do jogo
}

function resetGame(gameState){
    gameState.round = 1;
    gameState.maxRounds = 5;
    gameState.humanChoice = null;
    gameState.humanScore = 0;
    gameState.botScore = 0;
}

async function handleRoundStartClick(gameState) {

    displayRoundCounter(gameState);
    
    while(gameState.round <= gameState.maxRounds){
        // Essa promise vai esperar o clique no botão "Jogar" ou "Encerrar"
        const shouldContinue = await waitForPlayOrExit();
        
        if (!shouldContinue) {
            encerrarJogo(gameState);
            return;
        }

        // Se o jogador clicou em "Jogar"
        if(!gameState.humanChoice){
        // Se o jogador não escolheu, esperamos novamente pelo clique 
            alert('Por favor, escolha Pedra, Papel ou Tesoura antes de jogar!');
            continue;
        }
        
        playRound(gameState);
        showResultsPanel();       

        // Await agora para esperar o clique de "Próxima Rodada" ou "Encerrar"
        if(gameState.round != gameState.maxRounds){ 
            const shouldGoToNextRound = await waitForNextOrExit();
            
            if (!shouldGoToNextRound){
                encerrarJogo(gameState);
                return;
            }
            
            startNextRound( gameState)  
        } else{
            finalizeGame(gameState);
        }
    }
}

function finalizeGame(gameState){
     handleDisplayFinalResult(gameState);
     advanceRound(gameState); 
}

function handleDisplayFinalResult(gameState){
    //Remover botões de Próximo Round e Encerrar da tela
    controlGameButtons.classList.add("none");

    const finalMessage = defineFinalMessage(gameState);
    displayFinalResult(gameState, finalMessage);
    setTimeout(showFinalResultsPanel, 2000);
}

function startNextRound(gameState){
    resetHumanChoice(gameState); // Limpa a escolha para a próxima rodada
    advanceRound(gameState);
    displayRoundCounter(gameState);
    showRoundPanel();
}

function encerrarJogo(gameState){
    displayFinalResult(gameState);
    showInicialPanel();
}

function resetHumanChoice(gameState){
    gameState.humanChoice = null;
}

function advanceRound(gameState){
    gameState.round++;
}

function playRound(gameState){
    
    const botChoice = getBotChoice();
    const roundResult = determineRoundWinner(gameState, botChoice);

    updateScore(gameState, roundResult);

    displayRoundResult(gameState, botChoice, roundResult);
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

function determineRoundWinner(gameState, botChoice){
    if(gameState.humanChoice === botChoice)
        return ROUND_RESULT.TIE;

    if (gameState.humanChoice === CHOICES.ROCK)
        return botChoice === CHOICES.SCISSORS ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;

    if (gameState.humanChoice === CHOICES.PAPER)
        return botChoice === CHOICES.ROCK ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
    
    if (gameState.humanChoice === CHOICES.SCISSORS)
        return botChoice === CHOICES.PAPER ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
}

function updateScore(gameState, roundResult){
    if(roundResult === ROUND_RESULT.HUMAN_WIN)
        gameState.humanScore++;
    else if(roundResult === ROUND_RESULT.BOT_WIN)
        gameState.botScore++;
}

function displayRoundResult(gameState, botChoice, roundResult){

    const roundMessage = createRoundMessage(gameState, botChoice, roundResult);

        document.querySelector("#human-choice-name").textContent = CHOICES_NAMES_PT[gameState.humanChoice];
        document.querySelector("#bot-choice-name").textContent =  CHOICES_NAMES_PT[botChoice];
        document.querySelector("#round-message-winner").textContent = roundMessage;
        document.querySelector("#human-score").textContent = gameState.humanScore;
        document.querySelector("#bot-score").textContent = gameState.botScore;
}

function createRoundMessage(gameState, botChoice, roundResult){
    switch(roundResult){
        case ROUND_RESULT.HUMAN_WIN:
            return `Você VENCEU nesta rodada! ${CHOICES_NAMES_PT[gameState.humanChoice]} ganha de ${CHOICES_NAMES_PT[botChoice]}`;
        case ROUND_RESULT.BOT_WIN:
            return `Você PERDEU nesta rodada! ${CHOICES_NAMES_PT[botChoice]} ganha de ${CHOICES_NAMES_PT[gameState.humanChoice]}`;
        case ROUND_RESULT.TIE:
            return "Houve EMPATE"; 
    }
}

function displayFinalResult(gameState, finalMessage){
    document.querySelector(".display #final-message-winner").textContent = finalMessage;
    document.querySelector(".display #final-human-score").textContent = gameState.humanScore;
    document.querySelector(".display #final-bot-score").textContent = gameState.botScore;
}

function defineFinalMessage(gameState){
    const {humanScore, botScore} = gameState;
    let message;
    
    if(humanScore > botScore)
        message = "PARABÉNS, Você VENCEU o jogo!";
    else  if(humanScore < botScore)
        message = "QUE PENA, Você PERDEU o jogo!";
    else
        message = "JOGO EQUILIBRADO, Houve EMPATE!";

    return message;
}

//funções para modificar displays do jogo
function showInicialPanel(){
    playGameBtn.classList.remove('none');
    mainBoard.classList.add('none');
    gameDashboard.classList.add('none');
    finalResult.classList.add("none");
}

function showRoundPanel(){
    playGameBtn.classList.add('none');

    mainBoard.classList.remove('none');
    userBoard.classList.remove('none');

    gameDashboard.classList.add('none');
}

function showResultsPanel(){
    userBoard.classList.add('none');
    gameDashboard.classList.remove('none');
    controlGameButtons.classList.remove("none");
}

function showFinalResultsPanel(){
    mainBoard.classList.add("none");
    finalResult.classList.remove("none");
}

function displayRoundCounter(gameState){
    document.querySelector("#round-indicator span").textContent = gameState.round;
    document.querySelector("#round-counter #round-actual").textContent = gameState.round;
    document.querySelector("#round-counter #round-total").textContent = gameState.maxRounds;
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

        function handleNextOrExit(e){

            nextRound.removeEventListener('click', handleNextOrExit);
            secondExit.removeEventListener('click', handleNextOrExit);
            
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