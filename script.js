const MAX_ROUNDS = 5;
const EXIT_CODE = 9;

const CHOICES = {
    ROCK: 1, 
    PAPER: 2, 
    SCISSORS: 3,
};

const CHOICE_NAMES = {
    [CHOICES.ROCK]: "Pedra",
    [CHOICES.PAPER]: "Papel",
    [CHOICES.SCISSORS]: "Tesoura",
};

const ROUND_RESULT = {
    HUMAN_WIN: "human",
    BOT_WIN: "bot",
    TIE: 'tie',
};

function playGame(){

    const gameState = initializeGameState();

    for(let round = 1; round <= MAX_ROUNDS; round++){
        const shouldContinue = playRound(gameState, round);
        if (!shouldContinue) return;
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
    if (humanChoice === EXIT_CODE) return false;

    const botChoice = getBotChoice();
    const roundResult = determineRoundWinner(humanChoice, botChoice);

    updateGameState(gameState, roundResult);

    displayRoundResult(humanChoice, botChoice, gameState, round, roundResult);

    return true;  
}

function getHumanChoice(){
    let isInputValid = false;

    while(!isInputValid){
        const userInput = parseInt(prompt(
            "Vamos jogar, siga as instruções: Escolha:\n" +
            "1- Pedra\n" +
            "2- Papel\n" +
            "3- Tesoura\n" +
            `${EXIT_CODE}- Sair`
        ));
        
        if(isChoiceValid(userInput)){
            isInputValid = true;
            return userInput;
        }

        if(userInput === EXIT_CODE){
            isInputValid = true;
            return EXIT_CODE;
        } 

        alert("Escolha inválida, tente novamente");     
    }
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

    if (humanChoice === CHOICES.ROCK)
        return botChoice === CHOICES.SCISSORS ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;

    if (humanChoice === CHOICES.PAPER)
        return botChoice === CHOICES.ROCK ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
    
    if (humanChoice === CHOICES.SCISSORS)
        return botChoice === CHOICES.PAPER ? ROUND_RESULT.HUMAN_WIN : ROUND_RESULT.BOT_WIN;
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

//playGame();