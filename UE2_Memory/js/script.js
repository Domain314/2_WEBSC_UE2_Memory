/*
 * SETUP
 */

// get player name
function askName() {
  let input = prompt('Please enter your name:');
  document.getElementById('userName').innerHTML = input;
}

// create 16 cards and add all needed attributes
// card = parent of card2
function spawnCards(nums) {
  for (var i = 0; i < 16; i++) {
    let card = document.createElement('div');
    card.id = 'card' + (nums[i]);
    card.classList.add('karte');
    document.getElementById('spielbereich').appendChild(card);
    let card2 = document.createElement('div');
    card2.classList.add('karte-pic');
    let name = 'card' + (nums[i]) + '.png';
    card2.style.backgroundImage = 'url(./pics/card'+(nums[i])+'.png)';
    card2.id = (nums[i]);
    card2.setAttribute("onclick", "openCard(" + nums[i] + ", this)");
    document.getElementById('card' + (nums[i])).appendChild(card2);
  }
}

// generate random number
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// foreach card => swap card[i] with card[rnd]
function shuffleCards(nums) {
  for (var c = 0; c < nums.length; c++) {
    let rnd = getRandomInt(16);
    let temp = nums[c];
    nums[c] = nums[rnd];
    nums[rnd] = temp;
  }
}

// set global ID to disrupt interval
var intervalID;
// setup timer and start interval
function setTimer() {
  let start = Date.now();
  let diff, secs;
  function timer() {
    diff = ((Date.now() - start) / 1000 );
    document.getElementById('timer').innerHTML = parseInt(diff);
  }
  timer();
  intervalID = setInterval(timer, 1000);
}

// initialize game, spawn and shuffle cards, set timer..
function setupGame() {
  let nums = new Array(16);
  for (let i = 0; i < nums.length; i++) {
    nums[i] = i+1;
  }
  for (var i = 0; i < 20; i++) {
    shuffleCards(nums);
  }
  spawnCards(nums);
  document.getElementById("try").innerHTML = 0;
  setTimer();
}

// initialize setup
askName();
setupGame();

/*
 * END OF SETUP
 */

/*
 * GAME FUNCTIONALITIES
 */

// clear board, stop timer-interval, display win-text
function endGame() {
  let cards = document.getElementsByClassName("karte");
  for (var i = cards.length; i > 0; i--) {
    cards[i-1].remove();
  }
  clearInterval(intervalID);
  let winText = document.createElement('div');
  winText.classList.add("labels");
  winText.innerHTML = "YOU WIN !"
  document.getElementById('spielbereich').appendChild(winText);
  document.getElementById('spielbereich').style.display = "flex";
}

// async card closing, after 0,8 sec
async function waitToCloseCard() {
  await new Promise(resolve => setTimeout(resolve, 800));
  let opened = document.getElementsByClassName("open");
  for (var i = opened.length; i > 0; i--) {
    opened[i-1].classList.remove("open");
  }
}

// add a try to the try-counter
function addTry() {
  let div = document.getElementById("try");
  let old = div.innerHTML;
  div.innerHTML = parseInt(old) + 1;
}

// async change card-pic to "solved-BG", after pair was found
async function removeCards() {
  await new Promise(resolve => setTimeout(resolve, 800));
  let opened = document.getElementsByClassName("solved");
  for (var i = opened.length; i > 0; i--) {
    opened[i-1].style.backgroundImage = "url(./pics/memoryBgI.png)"
  }
}

// check if all cards marked as "solved"
function checkWin() {
  if (document.getElementsByClassName("solved").length == 16) {
    console.log("you win");
    endGame();
  }
}

// onclick function of every card.
// adds "open"-class to a card, if 2 cards open, check if right pair.
// if right, replace "open", with "solved"
// and initialize removeCards() and checkWin().
function openCard(cardNum, thisObj) {
  let opened = document.getElementsByClassName("open");
  if (!thisObj.classList.contains("solved") && opened.length <= 1) {
    thisObj.classList.add("open");

    if (opened.length == 2) {
      addTry();
      if (parseInt(opened[0].id) + parseInt(opened[1].id) == 17) {
        opened[1].classList.replace("open", "solved");
        opened[0].classList.replace("open", "solved");
        removeCards();
        checkWin();
      } else {
        waitToCloseCard();
      }
    }
  }
}

/*
 * END OF GAME FUNCTIONALITIES
 */
