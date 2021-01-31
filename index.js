const { type } = require("os");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();
//  global variables
let min;
let max;
tries = 1;

async function start() {
  // GAME BEGINS
  console.log(
    "Let's play a game where you (human) make up a number and I (computer) try to guess it."
  );

  // user sets range
  let userRangeMax = await ask(
    "\nFirst lets determine how difficult the game will be by setting the range.\nTell me the HIGHEST number you want me to guess from.... or press ENTER to use the default.\n"
  );
  let userRangeMin = await ask(
    "\nGreat! Now tell me the lowest number you want me to guess from .... or, again, press ENTER to use the default.\n"
  );

  // conditional.. if user presses enter, set max and min default
  //  TODO! if user says something other than numbers then say... i didnt quite get that or .. say, im not sure those were numbers.. i've automatically set your range to 100.... 
  
  userRangeMin && typeof(userRangeMax) === 'number' ? max = +userRangeMax: max = 100;

  userRangeMin && typeof(userRangeMin) === 'number' ? min = +userRangeMin:min = 0;

  // user picks number
  let secretNumber = await ask(
    "What is your secret number?\nI won't peek, I promise...\n"
  );
  while (secretNumber < min || secretNumber > max || secretNumber === '') {
    secretNumber = await ask(
      "Hey! Let's play fair!\nPick a number between " +
        min +
        " and " +
        max +
        " ."
    );
    console.log("Thats better! You entered: " + secretNumber);
  } 
  console.log("\nYou entered: " + secretNumber);
  
  //  set max numbers of tries
  let maxTries = Math.round(Math.log2(max - min) + 1);

  // Instructions
  console.log(
    "\n\nGreat! Now, I'm going to guess your number.  After I show you my guess tell me if I'm right or wrong.\nType 'Y' for right and 'N' for wrong, then hit enter!\nThen I will ask if your number is higher or lower.  Type 'H' for higher and 'L' for lower, then hit enter.\nLets play!!"
  );

  // START GUESSING

  // Generate random number and present to user
  let num = smartGuess(min, max);

  let guess = await ask("\n\n\nIs " + num + " your number?");

  // run for as long as user is inputting y and n or input doesnt = end
  while (guess.toLowerCase() !== "end") {
    
    // dont let people type anything other than y, n or end
    while (guess.toLowerCase() !== "y" && guess.toLowerCase() !== "n") {
      guess = await ask(
        "Please use the key 'Y' for 'yes', 'N' for 'no', or 'end' to end the game now.\n\nIs " +
          num +
          " your number?"
      );
    }
    // if user says number is wrong
    while (guess.toLowerCase() === "n") {
      // ask if higher or lower
      let guessDirection = await ask(
        "Is " + num + " higher or lower than your number?"
      );

      // reset ranges via max and min
      if (guessDirection.toLowerCase() === "h") {
        max = num - 1;
      } else {
        min = num + 1;
      }

      // generate new guess
      num = smartGuess(min, max);
      
      if (num < min){ 
        console.log("Sorry, It seems you must be cheating.\nGOODBYE")
         process.exit();
      }

      // ask if its the number
      guess = await ask("\n\n\nIs " + num + " your number?");

      // update how many tries
      tries++;
      // if tries is over maxtries number exit
      if (tries > maxTries) {
        console.log(
          "Sorry, I can't guess your number.  you must be cheating.\nGOODBYE"
        );
        process.exit();
      }
    }
    
    // if user says number is right:
    // and the guess doesnt match their secret number accuse them of cheating
    while (guess.toLowerCase() === "y" && +num !== +secretNumber) {
      guess = await ask(
        "Are you sure " +
          num +
          " is your number?  It doesn't match what you told me earlier."
      );
      tries++;
      if (tries > maxTries) {
        console.log(
          "Sorry, I can't guess your number.  you must be cheating.\nGOODBYE"
        );
        process.exit();
      }
    }
    
    // if user says number is right:
    // and the guess does match their secret number celebrate and tell them how long it took
    if (guess.toLowerCase() === "y" && +num === +secretNumber) {
      console.log(
        "Yah, I guessed it right!\nI guessed it in " + tries + " tries."
      );
      break;
    }
  
  }
  // if user types 'end
  console.log('Thank for playing!\nGoodbye!')
  process.exit();
}

// random number generator. want to turn this into smart guess

function randomInt(min, max) {
  let range = max - min + 1;
  let randInt = Math.floor(Math.random() * range) + min;

  return randInt;
}

// ToDo - 'D' = done
// D) instead of random number smart guess = mid.. make guess (max - min)/2.rounded the guess.
function smartGuess(amin, bmax) {
  return Math.floor((bmax + amin) / 2);
}
// 2) maybe switch the wording of is it higher or lower, and thus the min and max direction.
// D) allow for user input in the range
// D) if user inputs nothing use default.
// D) include a cheat detector
// 4.5) add option to say end in HorL and correct if anything except Hor L are typed
// 5) role reversal - in separate file
// 6) wanna play again?
// 7) combine games
