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
  //  global variables
  let gameContinue = "y";
  while (gameContinue === "y") {
    // variables
    let tries = 1;
    let min;
    let max;

    // GAME BEGINS
    console.log(
      "Let's play a game where you (human) make up a number and I (computer) try to guess it."
    );

    // user sets range
    let userRangeMax = await ask(
      "\nFirst lets determine how difficult the game will be by setting the range.\nTell me the HIGHEST number you want me to guess from.... or press ENTER to use the default.\n"
    );

    // string to number
    userRangeMax = +userRangeMax;

    // so only numbers can be set as max, all others use 100
    userRangeMax && typeof userRangeMax == "number"
      ? (max = +userRangeMax)
      : (max = 100);
    console.log("\nYou set the max to " + max + " .");

    let userRangeMin = await ask(
      "\nGreat! Now tell me the lowest number you want me to guess from .... or, again, press ENTER to use the default.\n"
    );

    // string to number
    userRangeMin = +userRangeMin;
    // so only numbers can be set as min, all others use 100
    userRangeMin && typeof userRangeMin == "number"
      ? (min = +userRangeMin)
      : (min = 0);
    console.log("\nYou set the min to " + min + " .");

    // user picks number
    let secretNumber = await ask(
      "What is your secret number?\nI won't peek, I promise...\n"
    );
    while (secretNumber < min || secretNumber > max || secretNumber === "") {
      secretNumber = await ask(
        "Hey! Let's play fair!\nPick a number between " +
          min +
          " and " +
          max +
          "."
      );
      console.log("Thats better! You entered: " + secretNumber);
    }
    console.log("\nYou entered: " + secretNumber);

    //  set max numbers of tries possible.  this is based on range
    let maxTries = Math.round(Math.log2(max - min) + 1);

    // Instructions
    console.log(
      "\n\nGreat! Now, I'm going to try and guess your number.  After I show you my guess tell me if I'm right or wrong.\nType 'Y' for right and 'N' for wrong, then hit enter!\nThen I will ask if your number is higher or lower.  Type 'H' for higher and 'L' for lower, then hit enter.\nLets play!!"
    );

    // START GUESSING

    // Generate guess number and present to user
    let num = smartGuess(min, max);

    let guess = await ask("\n\nIs " + num + " your number?");

    // run for as long as user is inputting y and n or input doesn't = end
    while (guess.toLowerCase() !== "end") {
      // dont let people type anything other than y, n or end
      while (guess.toLowerCase() !== "y" && guess.toLowerCase() !== "n") {
        guess = await ask(
          "Please use the key 'y' for 'yes', 'n' for 'no', or 'end' to end the game now.\n\nIs " +
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

        // higher or lower.
        // only h and l are accepted

        while (
          guessDirection.toLowerCase() !== "h" &&
          guessDirection.toLowerCase() !== "l"
        ) {
          // exit if user enters end during higher or lower
          if (guessDirection.toLowerCase() === "end") {
            console.log("Thank for playing!\nGoodbye!");
            process.exit();
          }
          // if user enters something other than h or l
          guessDirection = await ask(
            "Sorry, I didn't catch that.  Is " +
              num +
              " higher ('h') or lower ('l') than your number?"
          );
        }
        // reset ranges via max and min based on user input
        if (guessDirection.toLowerCase() === "h") {
          max = num - 1;
        } else {
          min = num + 1;
        }

        // generate new guess

        num = smartGuess(min, max);

        // if they pick higher each time so number goes below 0 catch cheating...
        if (num < min) {
          console.log("Sorry, It seems you must be cheating.\nGOODBYE");
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
    // if user types 'end quit
    if (guess.toLowerCase() === "end") {
      console.log("Thank for playing!\nGoodbye!");
      process.exit();
    }
    // PLAY AGAIN
    // ask if you wanna play again or play reverse game..only gets asked once at this point
    let gameContinueAsk = await ask(
      "Now is your time to decide!  \nWanna play again or play something new?  type 'y' for yes to play this again, 'n' for no to exit, or 'new' to play a new game"
    );

    gameContinue = gameContinueAsk.toLowerCase();
    if (gameContinueAsk === "new") {
      console.log(
        "Thanks for playing another game with me. \nThis is a game where you (human) try to guess my (computer) secret number.  \nI  will tell if your guess is too high or too low, then you can guess again.  \nOK? Ready? \n\n Lets go!!\n\n"
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
              " is too high, guess again! This time a little lower."
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
  }
  console.log("Thank for playing!\nGoodbye!");
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
// D) add option to say end in HorL
// D) correct if anything except Hor L are typed
// D) role reversal - in separate file
// D) wanna play again?
// D) combine games
// 10) allow for start over on whole thing....
