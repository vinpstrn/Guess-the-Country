'use strict';

const btns = document.querySelectorAll('.btn-country');
const btnContainer = document.querySelector('.btn-container');
const btnNext = document.querySelector('.btn-next');
const countriesContainer = document.querySelector('.country');
const countdownEl = document.querySelector('.countdown');
const questionEl = document.querySelector('.question');
const scoreEl = document.querySelector('.score');
const scorecardEl = document.querySelector('.scorecard');
const finalScoreEl = document.querySelector('.final-score');
let data;
let correctCountry;
let countdownIntervalID;
let countdownSec = 10;
let questionCounter = 1;
let scoreNo = 0;
let ScoreItems = 15;
let answerSelected = false;
let newGame = false;

const renderCountry = function(data) {
  countriesContainer.innerHTML = `<img class="country-img" src="${data.flags.svg}" />`;
  countriesContainer.style.opacity = 1;
}

const showArkyn = function() {
  countriesContainer.innerHTML = `<img class="arkyn-img arkyn-img-correct" src="img/arkyn-correct.png" />`;
}

const hideArkyn = function() {
  countriesContainer.innerHTML = `<img class="arkyn-img arkyn-img-wrong" src="img/arkyn-wrong.png" />`;
}

const whereAmI = async function () {
  
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    data = await res.json();
    console.log(data);
    nextQuestion(data);
  } catch(err) {
    console.log(err);
    renderCountry(`Something went wrong 💥 ${err.message}`)
  }
  
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
}

const nextQuestion = function() {
  resetCountdown();
  questionNo();

  // Call countdown timer
  let countries = [];

  // Get 3 wrong random countries
  while(countries.length < 3) {
    const randomCountry = Math.trunc(Math.random() * data.length);
    
    // Do not push if the random country already exists
    if(!countries.includes(randomCountry)) {
      countries.push(randomCountry);
    }
  }

  // Prevent correct country to generate same country from the 3 wrong countries
  do {
    correctCountry = Math.trunc(Math.random() * data.length);
  } while(countries.includes(correctCountry))

  // Push the final correct country to the wrong countries
  countries.push(correctCountry);

  // Get the country names
  console.log(data[correctCountry].name);
  console.log(data[correctCountry].name.common);
  console.log(countries);

  const shuffledArray = shuffleArray(countries);

  answerButton(shuffledArray, correctCountry);

  // Clear wrong/correct style from the buttons
  btns.forEach(btn => {
    btn.classList.remove('wrong', 'correct');
  });

  renderCountry(data[correctCountry]);
  enableBtns();
  // Increment Question No.
  questionCounter++;
}

const answerButton = function(arr) {

  btns.forEach((name,index) => {
    name.textContent = data[arr[index]].name.official;
  });
}

// Disable all buttons
const disableBtns = function() {
  btns.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('disabled');
    btn.classList.add('disabled');
  })
}


// Enable all buttons
const enableBtns = function() {
  btns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('disabled');
  })
}

btnContainer.addEventListener('click', function(e) {
  e.preventDefault();
  const target = e.target;
  console.log(target);

  if(target.classList.contains('btn-country')) {

    // Indicator that answer is selected
    answerSelected = true;
    disableBtns();

    if(target.textContent === data[correctCountry].name.official) {
      console.log('Correct');
      target.classList.remove('wrong');
      target.classList.add('correct');
      target.innerHTML = 'You are correct!';
      showArkyn();
      score();
      
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(1000, 1500),
        origin: { y: 0.6 },
      });

    } else {
      // console.log('Wrong');
      console.log(`Wrong: ${target.textContent}`);
      target.classList.add('wrong');
      target.innerHTML = 'You are wrong!';
      hideArkyn();

      btns.forEach(btn => {
        if(btn.textContent === data[correctCountry].name.official) {
          
          setTimeout(function() {
            btn.classList.add('correct');
            btn.innerHTML = `${data[correctCountry].name.official} &#x2713;`;
          }, 150)

        }
      });
    }

    gameOver();
  }
  
});


const questionNo = function() {
  questionEl.innerHTML = `Question No.${questionCounter}`;
}

const resetCountdown = function() {
  clearInterval(countdownIntervalID);
  countdownSec = 10;
  countdownEl.innerHTML = countdownSec;
  countdownIntervalID = setInterval(countdown, 1000);
}

const score = function() {
  scoreNo++;
  scoreEl.innerHTML = `Score: ${scoreNo}/${ScoreItems}`;
}

const countdown = function() {

  if(countdownSec > 0) {
    countdownSec--;
    countdownEl.innerHTML = countdownSec;
  } else {
    clearInterval(countdownIntervalID);
    nextQuestion();

    if(!newGame) {
      gameOver();
    }
  }

}

btnNext.addEventListener('click', () => {
  if(newGame) {
    console.log('New game');
    resetGame();
    newGame = false;
  } else if(answerSelected) {
    nextQuestion();
    answerSelected = false;
  }
});

const gameOver = function() {
  if(questionCounter >= 4) {
    console.log('GAME OVER!');
    clearInterval(countdownIntervalID);
    countriesContainer.classList.add('hide');
    countdownEl.classList.add('hide');
    scorecardEl.classList.remove('hide');
    btnNext.textContent = 'TRY AGAIN?';
    finalScoreEl.innerHTML = `Final Score: ${scoreNo}/${ScoreItems}`;
    disableBtns();
    newGame = true;
  }
}

const resetGame = function() {
  questionCounter = 1;
  scoreNo = 0;
  answerSelected = false;

  countriesContainer.classList.remove('hide');
  countdownEl.classList.remove('hide');
  scorecardEl.classList.add('hide');
  finalScoreEl.innerHTML = `Final Score: ${scoreNo}/${ScoreItems}`;
  scoreEl.innerHTML = `Score: ${scoreNo}/${ScoreItems}`;
  btnNext.textContent = 'NEXT';
  resetCountdown();
  whereAmI();
}

questionNo();
resetCountdown();
whereAmI();
