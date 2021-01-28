const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();


let min = 0 
let max = 100
tries = 0

async function start() {
  console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.")
  let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  console.log('You entered: ' + secretNumber);

  // Instructions
  console.log("Great! Now, I'm going to guess your number.  After I show you my guess tell me if I'm right or wrong.\nType 'Y' for right and 'N' for wrong, then hit enter!\nThen I will ask if your number is higher or lower.  Type 'H' for higher and 'L' for lower, then hit enter.\nLets play!!")

  // Generate random number and present to user
  num = randomInt(min,max)
  let guess = await ask('\n\n\nIs ' + num + " your number?");

  while (guess.toLowerCase() === 'n') {
    // ask if higher or lower
    let guessDirection = await ask('Is ' + num + " higher or lower than your number?");
    
    // reset randomInt ranges
    if (guessDirection.toLowerCase() === 'h') {
      max = num - 1
    } else {
      min = num + 1
    }

    // generate new guess
    num = randomInt(min,max)
    
    // ask if its the number
    guess = await ask('\n\n\nIs ' + num + " your number?");

    // update how many tries 
    tries ++ 
  } 

  //
 console.log("Yah, I guessed it right!\nI guessed it in " + tries + " tries.")

  process.exit();
}

// random number generator. want to turn this into smart guess 

function randomInt(min, max) {
  let range = max - min + 1
  let randInt = Math.floor(Math.random() * range) + min

  return randInt
}



/* 
ToDo
1) instead of random number smart guess = mid.. make guess (max - min)/2.rounded the guess.
2) maybe switch the wording of is it higher or lower, and thus the min and max direction.
3) allow for user input in the range
4) include a cheat detector
*/
