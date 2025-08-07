const MAX_ROUNDS = 5;
const EXIT_CODE = 9;

const CHOICES = {
    rock: 1, 
    paper: 2, 
    scissors: 3,
};

const CHOICE_NAMES = {
    [CHOICES.rock]: "Pedra",
    [CHOICES.paper]: "Papel",
    [CHOICES.scissors]: "Tesoura",
};

const ROUND_RESULT = {
    HUMAN_WIN: "human",
    BOT_WIN: "bot",
    TIE: 'tie',
};



async function playGame(){

    const gameState = initializeGameState();

    let shouldContinue;

    for(let round = 1; round <= MAX_ROUNDS; round++){
        
        shouldContinue = await playOrExit();
        if(!shouldContinue) return;

        playRound(gameState, round);
        
        shouldContinue = await nextOrExit();
        if(!shouldContinue) return;
    }
    
    displayFinalResult(gameState);
}

function initializeGameState(){
    return {
        humanScore: 0,
        botScore: 0,
    };
}

function playRound(gameState, round){
    const humanChoice = getHumanChoice();
    //if (humanChoice === EXIT_CODE) return false;

    const botChoice = getBotChoice();
    const roundResult = determineRoundWinner(humanChoice, botChoice);

    updateGameState(gameState, roundResult);

    displayRoundResult(humanChoice, botChoice, gameState, round, roundResult);

    //return true;  
}

function getHumanChoice(){
    return 1     
}

function isChoiceValid(choice){
    return Object.values(CHOICES).includes(choice);
}

function getBotChoice(){
    return Math.ceil(Math.random() * 3);
}

function determineRoundWinner(humanChoice, botChoice){
    if(humanChoice === botChoice)
        return ROUND_RESULT.TIE;

    if (humanChoice === CHOICES.rock)
        return botChoice === CHOICES.scissors ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;

    if (humanChoice === CHOICES.paper)
        return botChoice === CHOICES.rock ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
    
    if (humanChoice === CHOICES.scissors)
        return botChoice === CHOICES.paper ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
}

function updateGameState(gameState, roundResult){
    if(roundResult === ROUND_RESULT.HUMAN_WIN)
        gameState.humanScore++;
    else if(roundResult === ROUND_RESULT.BOT_WIN)
        gameState.botScore++;
}

function displayRoundResult(humanChoice, botChoice, gameState, round, roundResult){

    const roundMessage = createRoundMessage(humanChoice, botChoice, roundResult);
        let messageAlert;

        messageAlert =`Round ${round}:`;
        messageAlert += `\n \t Sua Escolha: ${CHOICE_NAMES[humanChoice]}`;
        messageAlert += `\n \t Escolha do Computador: ${CHOICE_NAMES[botChoice]}\n`;
        messageAlert += `${roundMessage}`;
        messageAlert += `\n \t Seu Score: ${gameState.humanScore}`;
        messageAlert += `\n \t Computador Score: ${gameState.botScore}`;
    
    alert(messageAlert);
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

async function playOrExit(){
    return new Promise((resolve) => {

        function handlePlayOrExit(e){
            if(e.target.id.includes("play")){
                initRound.removeEventListener('click', handlePlayOrExit);
                resolve(true);
            } else if(e.target.id.includes("exit")){
                firstExit.removeEventListener('click', handlePlayOrExit);
                resolve(false);
            }
        }
        firstExit.addEventListener('click', handlePlayOrExit);
        initRound.addEventListener('click', handlePlayOrExit);
    })
}

async function nextOrExit(){
    return new Promise((resolve) => {

        function handleNextOrExit(e){
            if(e.target.id.includes("next")){
                initRound.removeEventListener('click', handleNextOrExit);
                resolve(true);
            } else if(e.target.id.includes("exit")){
                secondExit.removeEventListener('click', handleNextOrExit);
                resolve(false);
            }
        }
        secondExit.addEventListener('click', handleNextOrExit);
        initRound.addEventListener('click', handleNextOrExit);
    })
}


initGame.addEventListener('click', playGame);
initGame.addEventListener('click', showRoundPanel);

initRound.addEventListener('click', showResultsPanel);
nextRound.addEventListener('click', showRoundPanel);

buttonsExit.forEach(buttonExit => buttonExit.addEventListener('click', showInicialPanel));

/*
userChoices.addEventListener('click', (e) => {
    console.log(e.target);
})

*/

