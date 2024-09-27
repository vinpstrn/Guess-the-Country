const btns = document.querySelectorAll('.btn-country');
const btnContainer = document.querySelector('.btn-container');
const countriesContainer = document.querySelector('.countries'); 
let data;
let correctCountry; // Make this global to keep track of the correct country

const renderCountry = function(data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
  </article>
  `;
  countriesContainer.innerHTML = html;
  countriesContainer.style.opacity = 1;
}

const whereAmI = async function () {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    data = await res.json();
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

const nextQuestion = function(data) {
  correctCountry = Math.trunc(Math.random() * data.length); // Update to use global variable
  let randomCountries = [correctCountry];

  // Get 3 additional wrong country indices
  while (randomCountries.length < 4) {
    const randomIndex = Math.trunc(Math.random() * data.length);
    if (!randomCountries.includes(randomIndex)) {
      randomCountries.push(randomIndex);
    }
  }

  // Shuffle the array of indices
  const shuffledArray = shuffleArray(randomCountries);
  
  answerButton(data, shuffledArray);
  renderCountry(data[correctCountry]);
}

const answerButton = function(data, arr) {
  btns.forEach((btn, index) => {
    btn.textContent = data[arr[index]].name.official;
  });

  // Remove existing event listeners to avoid duplication
  btnContainer.removeEventListener('click', handleButtonClick);
  btnContainer.addEventListener('click', handleButtonClick);
}

const handleButtonClick = function(e) {
  e.preventDefault();
  const target = e.target;

  if (target.classList.contains('btn-country')) {
    if (target.textContent === data[correctCountry].name.official) {
      console.log('Correct');
      nextQuestion(data);
    } else {
      console.log(`Wrong: ${target.textContent}`);
    }
  }
}

whereAmI();
