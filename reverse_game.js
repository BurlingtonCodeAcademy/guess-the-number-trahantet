// given don't change
const { type, endianness } = require("os");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

async function start() {
  // INTRO + INSTRUCTIONS

  console.log(
    "Let's play a game where you (human) try to guess my (computer) secret number.  \nI  will tell if your guess is too high or too low, then you can guess again.  \nOK? Ready? \n\n Lets go!!\n\n"
  );
  // 1) generate random number between 1-100
  let compNumber = randomInt(1, 100);

  // 2) ask user for their guess
  let userGuess = await ask("What is your guess?");
  userGuess = +userGuess;
  // 3) is guess same as random number?
  while (userGuess !== compNumber) {
    // 4) print if higher of lower + ask again
    if (compNumber < +userGuess) {
      userGuess = await ask(
        "Nope! " +
          userGuess +
          " is too higher, guess again! This time a little lower."
      );
    }
    if (compNumber > +userGuess) {
      userGuess = await ask(
        "Nope! " +
          userGuess +
          " is too low, guess again! This time a little higher."
      );
    }
    userGuess = +userGuess;
  }
  // 5) celebrate
  console.log(
    "Congratulations! You guessed right! My number was " + compNumber
  );
  process.exit();
}

function randomInt(min, max) {
  let range = max - min + 1;
  let randInt = Math.floor(Math.random() * range) + min;

  return randInt;
}
