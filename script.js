'use strict';

// function getCountryAndData() {

//   // AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/all`);
//   request.send();

//   request.addEventListener('load', function() {
//     // console.log(JSON.parse(this.responseText));

//     const data = JSON.parse(this.responseText);
//     randomCountry = data[Math.trunc(Math.random() * data.length)];
//     console.log(randomCountry);
//     // Render country 1
//     renderCountry(randomCountry);
  
//   });
// }

// // getCountryAndData('portugal');
// getCountryAndData();



// FETCH


// const btn = document.querySelector('.btn-country');
// const countriesContainer = document.querySelector('.countries'); 

// const renderCountry = function(data, className = '') {

//   const currencyKey = Object.keys(data.currencies)[0];
//   const languageKey = Object.keys(data.languages)[0];

//   const html = `
//   <article class="country ${className}">
//     <img class="country__img" src="${data.flags.svg}" />
//     <div class="country__data">
//       <h3 class="country__name">${data.name.common}</h3>
//       <h4 class="country__region">${data.region}</h4>
//       <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
//       <p class="country__row"><span>🗣️</span>${data.languages[languageKey]}</p>
//       <p class="country__row"><span>💰</span>${data.currencies[currencyKey].name}</p>
//     </div>
//   </article>
//   `;

//   countriesContainer.insertAdjacentHTML('beforeend', html);
//   countriesContainer.style.opacity = 1;
// }

// const renderError = function(msg) {
//   countriesContainer.insertAdjacentText('beforeend', msg);
//   // countriesContainer.style.opacity = 1;
// }

// const getJSON = function(url, errorMessage = 'Something went wrong') {
//   return fetch(url).then(response => {
//     if(!response.ok) {
//       throw new Error(`${errorMessage} (${response.status})`);
//     }

//     return response.json();
//   });
// }

// const getCountryAndData = function(country) {
//   getJSON(`https://restcountries.com/v3.1/name/${country}`, `Country not found`)
//   .then(data => {
//     renderCountry(data[0]);
//     let neighbour;

//     if(data[0].hasOwnProperty('borders')) {
//       neighbour = data[0].borders[0];
//     } else {
//       throw new Error('No neighbour found!')
//     }

//     return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, `Country not found`);
//   })
//   .then(data => renderCountry(data[0], 'neighbour'))
//   .catch(err => {
//     renderError(`Something went wrong 💥💥💥 ${err.message} Try again!`);
//   })
//   .finally(() => {
//     countriesContainer.style.opacity = 1;
//   });
// };

// btn.addEventListener('click', function() {
//   getCountryAndData('usa');
// });

// const btn = document.querySelector('.btn-country');
// const countriesContainer = document.querySelector('.countries'); 

// const whereAmI = function(lat, lng) {
//   fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//   .then(res => {
    
//     if(!res.ok) throw new Error(`Problem with Geocoding ${res.status}`);

//     return res.json();
//   })
//   .then(data => {
//     console.log(data);
//     console.log(`You are in ${data.city}, ${data.country}`);

//     return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
//   })
//   .then(res => {

//     if(!res.ok) throw new Error(`Country not found (${res.status})`);

//     return res.json();

//   })
//   .then(data => renderCountry(data[0]))
//   .catch(err => console.log(`Error ${err.message}`));
// }

// whereAmI(52.508, 13.381);


// const lotteryPromise = new Promise(function(resolve, reject) {

//   console.log(`Lottery draw is happening...`);
//   setTimeout(function() {
//     if(Math.random() >= 0.5) {
//       resolve(`You win 💰`);
//     } else {
//       reject(new Error('You lost your money! 💩'));
//     }
//   }, 2000)

// });

// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err.message));

const btns = document.querySelectorAll('.btn-country');
const btnContainer = document.querySelector('.btn-container');
const btnNext = document.querySelector('.btn-next');
const countriesContainer = document.querySelector('.country');
let data;
let correctCountry;

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
  correctCountry = Math.trunc(Math.random() * data.length - 1);
  let randomCountries = [];

  // Get 4 random country names (1 correct, 3 wrong)
  for(let i = 0; i < 3; i++) {
    randomCountries.push(Math.trunc(Math.random() * data.length - 1));
  }

  randomCountries.push(correctCountry);

  // Get the country names
  console.log(data[correctCountry].name);
  console.log(data[correctCountry].name.common);
  console.log(randomCountries);

  const shuffledArray = shuffleArray(randomCountries);

  answerButton(shuffledArray, correctCountry);

  // Clear wrong/correct style from the buttons
  btns.forEach(btn => {
    btn.classList.remove('wrong', 'correct');
  })

  renderCountry(data[correctCountry]);
  EnableBtns();
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
const EnableBtns = function() {
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

    disableBtns();

    if(target.textContent === data[correctCountry].name.official) {
      console.log('Correct');
      target.classList.remove('wrong');
      target.classList.add('correct');
      target.innerHTML = 'You are correct!';
      showArkyn();
      
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
      })
    }
  }
  
});

btnNext.addEventListener('click', nextQuestion);

whereAmI();