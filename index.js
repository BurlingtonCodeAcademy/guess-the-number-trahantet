const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

// change or delete any of the code below
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

    tries ++ 
  } 

  //
 console.log("Yah, I guessed it right!\nI guessed it in " + tries + " tries.")

  process.exit();
}

// need to turn this into a loop....

function randomInt(min, max) {
  let range = max - min + 1
  let randInt = Math.floor(Math.random() * range) + min

  return randInt
}



/* 
D- ask user what they entered..
D- instructions
D- generate random num between min and max.  we can do this using random number generator.  
D- present to user 
D- ask if correct.. wait for input
D- user inputs Y or N
D- if Y "I got it right"
D- if N ask new question: "Higher or lower", wait for answer
D- user inputs H or L
D- if H make num new min  
D- if L make num new max 

ToDo
1) instead of random number smart guess = mid.. make guess (max - min)/2.rounded the guess.
2) maybe switch the wording of is it higher or lower, and thus the min and max direction.
3) allow for user input in the range
4) include a cheat detector
*/


/* if guess = Y print Congrats
  if (guess.toLowerCase() === 'y') {
    console.log("YAH! I guessed it right!!!") // later i can put in a safety check to see if guess and secretNumber match.
  } else {
    // if guess = N resent range
    */