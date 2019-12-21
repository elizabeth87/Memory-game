const icons = ['fa-angellist', 'fa-angrycreative', 'fa-gratipay','fa-linux', 'fa-behance', 'fa-earlybirds', 'fa-laravel', 'fa-reddit-alien','fa-angellist', 'fa-angrycreative', 'fa-gratipay','fa-linux', 'fa-behance', 'fa-earlybirds', 'fa-laravel', 'fa-reddit-alien']

let cardOne = null, cardTwo = null;
let revealedCards = [];
let score = 0;
let timer = 0;
let clock = null;
renderNewGameboard();

function renderNewGameboard() {
    revealedCards = [];
    let grid = document.querySelector('.game-cards');
    score = 0;
    setScoreScreen();
    timer = 0;
    setTimerScreen();
    grid.innerHTML = '';
    let iconList = shuffleIcons(icons);
    for (let i=0; i < iconList.length; i++) {
        createNewCard(grid, iconList[i]);
    }
}

function setScoreScreen() {
    let scoreScreen = document.querySelector('.score');
    scoreScreen.textContent = score;
}

function setTimerScreen() {
    let timerScreen = document.querySelector('.timer');
    timerScreen.textContent = timer;
}

function startClock() {
    clock = setInterval(function(){
        timer++;
        setTimerScreen();
    }, 1000);
}

function stopClock() {
    clearInterval(clock);
    clock = null;
}

function createNewCard(grid, icon) {
  let li = document.createElement('li');
  li.classList.add('game-card');
  let div = document.createElement('div');
  div.classList.add('inner-card');
  let fa = document.createElement('i');
  fa.classList.add('fab', icon);
  div.appendChild(fa);
  li.appendChild(div);
  li.addEventListener('click', function(){
      handleCardClick(this);
  });
  grid.appendChild(li);
}


function shuffleIcons(arr) {
  let shuffledArray = arr.map(card => card);
  for (let i=0; i<shuffledArray.length; i++) {
    let rnd = Math.floor(Math.random()*shuffledArray.length);
    let temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[rnd];
    shuffledArray[rnd] = temp;
  }
  return shuffledArray;
}

/* Handling Each Card Click */
function handleCardClick(card) {
    if (clock === null) startClock();
    if (revealedCards.indexOf(card) !== -1) return;
    if (cardOne === null) {
        cardOne = card;
        revealClickedCard(card);
        score++;
        setScoreScreen();
        return;
    }
     if ( cardOne !== card && cardTwo === null ) {
        cardTwo = card;
        revealClickedCard(card);
        score++;
        setScoreScreen();
        //We have two selected cards stored, so now we'll need to compare them:
        compareCards();
    }
}

function revealClickedCard(card) {
    let innerCard = card.querySelector('.inner-card');
    innerCard.classList.add('show');
}

function flipRevealedCards() {
    let innerCard = cardOne.querySelector('.inner-card');
    innerCard.classList.remove('show', 'no-match');
    innerCard = cardTwo.querySelector('.inner-card');
    innerCard.classList.remove('show', 'no-match');
    cardOne = null;
    cardTwo = null;
}

function handleMatchedCards() {
    let innerCard = cardOne.querySelector('.inner-card');
    innerCard.classList.add('match');
    innerCard = cardTwo.querySelector('.inner-card');
    innerCard.classList.add('match');
    revealedCards.push(cardOne);
    revealedCards.push(cardTwo);
    cardOne = null;
    cardTwo = null;
    checkForWin();
}

function handleNoMatchCards() {
    let innerCard = cardOne.querySelector('.inner-card');
    innerCard.classList.add('no-match');
    innerCard = cardTwo.querySelector('.inner-card');
    innerCard.classList.add('no-match');
    setTimeout(function() {
        flipRevealedCards();
    }, 1000)
}



//function to compare the two selected cards and see if they match
function compareCards() {
    //Each "card" is really an li element with the click event listener attached. In order to 'compare' 
    //values, we'll need to use each card's child i element. 
    const firstCard = cardOne.querySelector('i');
    const secondCard = cardTwo.querySelector('i');
    //with both cards' i elements in hand, we can check for a match by comparing their class names since they are using
    //font awesome styling. The second class name in every i is the value we'll be comparing:
    if (firstCard.classList[1] === secondCard.classList[1]) {//i.classList[0] == fab, i.classList[1] == fa-mandalorian (example)
        handleMatchedCards();
    } else {
        handleNoMatchCards();
    }
}

function checkForWin() {
    if (revealedCards.length >= 16) {
        gameOver();
    }
}

function gameOver() {
    stopClock();
    document.querySelector('.game-over').classList.remove('hide');
}

function restartGame() {
    document.querySelector('.game-over').classList.add('hide');
    renderNewGameboard();
}

document.querySelector('.game-over button').addEventListener('click', restartGame);

