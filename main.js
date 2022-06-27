/***************
 * Declare common classes to prevent typos
 * DOM declare images
 * DOM Declare O or X
 * DOM Declare SVG arrays
 *  EventListener for O or X; store value and hide selection screen
 * Check local storage on refresh and keep screen hidden
 * refresh function that must be run.
 *************/

//declare common classes
const hiddenClass = "hidden";
const winClass = "won";
const lostClass = "lost";

//declare images for won/lose/draw
const winImage = document.getElementById("win-image");
const loseImage = document.getElementById("lose-image");
const drawImage = document.getElementById("draw-image");

//DOM get X & O buttons and Chooser
const X_BUTTON = document.getElementById("X-button");
const O_BUTTON = document.getElementById("O-button");
const chooserPanel = document.getElementById("chooser");
const introScreen = document.getElementById("first-intro-screen");

//DOM - svg to players
const cross = Array.from(document.getElementsByClassName("cross"));
const nought = Array.from(document.getElementsByClassName("nought"));

//user selects X button; save choice
X_BUTTON.addEventListener("click", (e) => {
  localStorage.setItem("playerSelection", "cross");
  localStorage.setItem("computerSelection", "nought");
  chooserPanel.classList.add(hiddenClass);
  introScreen.classList.add(hiddenClass);
});

//user selects O button; save choice
O_BUTTON.addEventListener("click", (e) => {
  localStorage.setItem("playerSelection", "nought");
  localStorage.setItem("computerSelection", "cross");
  chooserPanel.classList.add(hiddenClass);
  introScreen.classList.add(hiddenClass);
});

//function that can return the chosen selection
function getSelection() {
  let player = localStorage.getItem("playerSelection");
  let computer = localStorage.getItem("computerSelection");
  return { player: player, computer: computer };
}

/*************
 *
 * DOM declare board
 * Define empty arrays for player & computer moves
 * Define arrays of valid moves & permitted moves remaining
 * Define winning moves
 * Define game state
 * Define Boolean (validMove) as to whether player has selected a cell the computer has already used
 **************/

//DOM - cells in grid
const board = document.querySelectorAll("[data-pos]");
const a1 = Array.from(board)[0];
const a2 = Array.from(board)[1];
const a3 = Array.from(board)[2];
const b1 = Array.from(board)[3];
const b2 = Array.from(board)[4];
const b3 = Array.from(board)[5];
const c1 = Array.from(board)[6];
const c2 = Array.from(board)[7];
const c3 = Array.from(board)[8];
const boardCellElements = [a1, a2, a3, b1, b2, b3, c1, c2, c3];

//arrays of moves carried out by computer and player
let playerMoves = [];
let computerMoves = [];

//define valid moves
const validMoves = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];

//define remaining moves
let movesRemaining = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];

//define winning moves and seal (prevent cheating)
const rowA = ["a1", "a2", "a3"];
const rowB = ["b1", "b2", "b3"];
const rowC = ["c1", "c2", "c3"];
const column1 = ["a1", "b1", "c1"];
const column2 = ["a2", "b2", "c2"];
const column3 = ["a3", "b3", "c3"];
const diagTlBr = ["a1", "b2", "c3"];
const diagTrBl = ["a3", "b2", "c1"];

//define game State
let won = false;
let drawState = false;
let winFuncComplete = false;

// if player selects a cell that the computer has used
let validMove = true;

/*****************************
 *
 * What happens when a player moves (on click)
 * What happens when the computer moves
 *
 * Add event listeners and call functions for each move
 *****************************/

/*
1. player moves by clicking cell
2. check cell is listed in validMoves array, and return its index
3. Only if the cell is included in the array of remaining moves, can a move be made
4. Else if the cell selected isn't in the array of remaining moves, validMove boolean is changes to false, so that the computer wont then move
5. Check what the player selected (nought or cross)
6. If storage shows cell is free, set storage and make svg visible by removing the hidden class   
7. Then delete the event listener so it cant be clicked again 
*/

function playerEventForCell(cell) {
  let i = validMoves.indexOf(cell);
  if (movesRemaining.includes(cell)) {
    if (
      getSelection().player === "cross" &&
      localStorage.getItem(`${cell}-contents`) !== "cross, player"
    ) {
      cross[i].classList.remove(hiddenClass);
      localStorage.setItem(`${cell}-contents`, "cross, player");
      updateBothMoveArrays(cell, playerMoves);
      validMove = true;
    } else if (
      getSelection().player === "nought" &&
      localStorage.getItem(`${cell}-contents`) !== "nought, player"
    ) {
      nought[i].classList.remove(hiddenClass);
      localStorage.setItem(`${cell}-contents`, "nought, player");
      updateBothMoveArrays(cell, playerMoves);
      validMove = true;
    } else if (localStorage.getItem(`${cell}-contents`) === "cross, player") {
      boardCellElements[i].removeEventListener("click", (e) => {});
      validMove = true;
    } else if (localStorage.getItem(`${cell}-contents`) === "nought, player") {
      boardCellElements[i].removeEventListener("click", (e) => {});
      validMove = true;
    } else {
      validMove = false;
    }
  }
}

/*
1. Computer has generated a computedMove from a function (on line 290 below)
2. check computedMove is listed in validMoves array, and return its index
3. check computedMove is included in the array of remaining moves and that the person's click, just made was valid (validMove === true) 
4. Check what character the computer was assigned based on the player's choice: nought or cross
6. If storage shows cell is free, set storage and make applicable svg visible by removing the hidden class
7. Then delete the event listener so it cant be clicked by the player   
*/
function computerEventForCell(computedMove) {
  let i = validMoves.indexOf(computedMove);
  if (movesRemaining.includes(computedMove) && validMove) {
    if (
      getSelection().computer === "cross" &&
      localStorage.getItem(`${computedMove}-contents`) !== "cross, computer"
    ) {
      cross[i].classList.remove(hiddenClass);
      localStorage.setItem(`${computedMove}-contents`, "cross, computer");
      updateBothMoveArrays(computedMove, computerMoves);
      boardCellElements[i].removeEventListener("click", (e) => {});
    } else if (
      getSelection().computer === "nought" &&
      localStorage.getItem(`${computedMove}-contents`) !== "nought, computer"
    ) {
      nought[i].classList.remove(hiddenClass);
      localStorage.setItem(`${computedMove}-contents`, "nought, computer");
      updateBothMoveArrays(computedMove, computerMoves);
      boardCellElements[i].removeEventListener("click", (e) => {});
    } else if (
      localStorage.getItem(`${computedMove}-contents`) === "cross, computer"
    ) {
      boardCellElements[i].removeEventListener("click", (e) => {});
    } else if (
      localStorage.getItem(`${computedMove}-contents`) === "nought, computer"
    ) {
      boardCellElements[i].removeEventListener("click", (e) => {});
    }
  }
}

/**
 1. Event listeners on grid elements (declared from DOM around line 60 above)
 2. player function is invoked (as defined above);
 3. then check win function is run 
 4. if win state = false, computer move function invoked after 1.5sec delay
 */

a1.addEventListener("click", (e) => {
  playerEventForCell("a1");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
a2.addEventListener("click", (e) => {
  playerEventForCell("a2");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
a3.addEventListener("click", (e) => {
  playerEventForCell("a3");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});

b1.addEventListener("click", (e) => {
  playerEventForCell("b1");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
b2.addEventListener("click", (e) => {
  playerEventForCell("b2");

  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
b3.addEventListener("click", (e) => {
  playerEventForCell("b3");

  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
c1.addEventListener("click", (e) => {
  playerEventForCell("c1");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
c2.addEventListener("click", (e) => {
  playerEventForCell("c2");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});
c3.addEventListener("click", (e) => {
  playerEventForCell("c3");
  whoWins(playerMoves, "player");
  draw();
  if (!won) {
    computerEventForCell(validateComputerMove());
    whoWins(computerMoves, "computer");
    draw();
  }
});

/********
 *
 *  Update move arrays and combine into single function
 *
 *****/

//update moves remaining array by deleting a move after each one is made
function setMovesLeft(cell) {
  let lastMove = movesRemaining.indexOf(cell);
  if (movesRemaining.some((el) => cell === el)) {
    movesRemaining.splice(lastMove, 1);
  }
  return movesRemaining;
}
//update array of moves after move
function setMovesMade(cell, moves) {
  moves.push(cell);
  return moves;
}

//combi function which updates and returns validMoves and either computer or player moves array
//and pushes the updated array to storage
function updateBothMoveArrays(cell, moves) {
  setMovesLeft(cell);
  localStorage.setItem("permittedMovesLeft", movesRemaining);
  setMovesMade(cell, moves);
  localStorage.setItem("computerMovesMade", computerMoves);
  localStorage.setItem("playerMovesMade", playerMoves);
}

/********************************
 *
 * Calculate Computer move
 *
 ********************************/

//generate random computer move from list of valid remaining moves & declare it as a computed move
let computedMove = "";
function validateComputerMove() {
  let i = Math.floor(Math.random() * movesRemaining.length);
  if (i >= 0) {
    return (computedMove = movesRemaining[i]);
  }
}

/*****************************
 * On Reload
 *
 * ensure game looks like it last was based on local storage
 * ensure playAgain & select nought or cross screens are visible or hidden as applicable
 *
 ***********/

/**
 1. reload function runs based on cell element of moves made so dar
 2. runs just like the player/computer functions above
 3. updates all moves arrays
 4. ensures all svgs are visible based on local storage
 */
function reloadCell(cell) {
  let i = validMoves.indexOf(cell);
  if (
    getSelection().player === "cross" &&
    localStorage.getItem(`${cell}-contents`) === "cross, player"
  ) {
    cross[i].classList.remove(hiddenClass);
    boardCellElements[i].removeEventListener("click", (e) => {});
    updateBothMoveArrays(cell, playerMoves);
  } else if (
    getSelection().player === "nought" &&
    localStorage.getItem(`${cell}-contents`) === "nought, player"
  ) {
    nought[i].classList.remove(hiddenClass);
    boardCellElements[i].removeEventListener("click", (e) => {});
    updateBothMoveArrays(cell, playerMoves);
  } else if (
    getSelection().computer === "cross" &&
    localStorage.getItem(`${cell}-contents`) === "cross, computer"
  ) {
    cross[i].classList.remove(hiddenClass);
    boardCellElements[i].removeEventListener("click", (e) => {});
    updateBothMoveArrays(cell, computerMoves);
  } else if (
    getSelection().computer === "nought" &&
    localStorage.getItem(`${cell}-contents`) === "nought, computer"
  ) {
    nought[i].classList.remove(hiddenClass);
    boardCellElements[i].removeEventListener("click", (e) => {});
    updateBothMoveArrays(cell, computerMoves);
  }
}

//hides welcome screens on refresh
//fetches moves made from storage and turns this back into an array and runs the function above for all cells where a move has been made by both computer and player
function reloadStatus() {
  if (localStorage.getItem("computerSelection") !== null) {
    chooserPanel.classList.add(hiddenClass);
    introScreen.classList.add(hiddenClass);
  }
  //
  if (localStorage.getItem("playerSelection") !== null) {
    //get player and computer moves from storage
    let p = localStorage.getItem("playerMovesMade").split(",");
    let c = localStorage.getItem("computerMovesMade").split(",");
    playerMoves = p.filter((element, index) => {
      return p.indexOf(element) === index;
    });
    computerMoves = c.filter((element, index) => {
      return c.indexOf(element) === index;
    });
  }

  playerMoves.forEach((e) => {
    reloadCell(e);
  });
  computerMoves.forEach((e) => {
    reloadCell(e);
  });
}
reloadStatus();

/***************
 *
 * Play again
 *
 ***************/

const playAgainScreen = document.getElementById("playagain-screen");
const YES_BUTTON = document.getElementById("yes");
const NO_BUTTON = document.getElementById("no");

function resetGame() {
  won = false;
  drawState = false;
  movesRemaining = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
  playerMoves = [];
  computerMoves = [];
  localStorage.clear();
  playAgainScreen.classList.add(hiddenClass);
  introScreen.classList.remove(hiddenClass);
  chooserPanel.classList.remove(hiddenClass);
  winImage.classList.add(hiddenClass);
  loseImage.classList.add(hiddenClass);
  drawImage.classList.add(hiddenClass);
  for (let i = 0; i < cross.length; i += 1) {
    cross[i].classList.add(hiddenClass);
    nought[i].classList.add(hiddenClass);
  }
}

YES_BUTTON.addEventListener("click", (e) => {
  resetGame();
});

function onNoButton() {
  won = false;
  movesRemaining = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
  playerMoves = [];
  computerMoves = [];
  localStorage.clear();
  playAgainScreen.classList.add(hiddenClass);
  for (let i = 0; i <= cross.length; i += 1) {
    cross[i].classList.add(hiddenClass);
    nought[i].classList.add(hiddenClass);
  }
}

NO_BUTTON.addEventListener("click", (e) => {
  onNoButton();
});

/*******
 *
 * Determine Win State - this is ONE almighty function
 * Determine Draw State
 *
 ****/

function whoWins(moves, playerType) {
  //Get array of moves and delete duplicates - a bug I can't seem to remove
  let winMoves = moves.filter((element, index) => {
    return moves.indexOf(element) === index;
  });

  //declare some empty arrays for each possible "winning structure"
  let rowWinArrayA = [];
  let rowWinArrayB = [];
  let rowWinArrayC = [];
  let columnWinArray1 = [];
  let columnWinArray2 = [];
  let columnWinArray3 = [];
  let diagTopLeftToBottomRightWinArray = [];
  let diagTopRightToBottomLeftWinArray = [];

  //takes the horizontal row win arrays declared in line 82-84 and compares them to the array of moves made by the player.
  //pushes the matching items into the array
  //if a player clicked "a1" (top left), this would be pushed into every array where a1 was a valid cell
  function horizontalWin(row, winMoves) {
    winMoves.forEach((element) => {
      for (i = 0; i < row.length; i += 1) {
        if (row[i] === element) {
          if (row == rowA) {
            return rowWinArrayA.push(element);
          } else if (row == rowB) {
            return rowWinArrayB.push(element);
          } else if (row == rowC) {
            return rowWinArrayC.push(element);
          }
        }
      }
    });
  }

  //the sae is done here for the columns as for the rows above
  function columnWin(column, winMoves) {
    winMoves.forEach((element) => {
      for (i = 0; i < column.length; i += 1) {
        if (column[i] === element) {
          if (column == column1) {
            return columnWinArray1.push(element);
          } else if (column == column2) {
            return columnWinArray2.push(element);
          } else if (column == column3) {
            return columnWinArray3.push(element);
          }
        }
      }
    });
  }

  //same is done here for the 2 diags, as for the columns/rows above
  function diagWin(diag, winMoves) {
    winMoves.forEach((element) => {
      for (i = 0; i < diag.length; i += 1) {
        if (diag[i] === element) {
          if (diag == diagTlBr) {
            return diagTopLeftToBottomRightWinArray.push(element);
          } else if (diag == diagTrBl) {
            return diagTopRightToBottomLeftWinArray.push(element);
          }
        }
      }
    });
  }
  //functions declared above are run
  horizontalWin(rowA, winMoves);
  horizontalWin(rowB, winMoves);
  horizontalWin(rowC, winMoves);
  columnWin(column1, winMoves);
  columnWin(column2, winMoves);
  columnWin(column3, winMoves);
  diagWin(diagTlBr, winMoves);
  diagWin(diagTrBl, winMoves);

  //if statements for sort, string the generated arrays (by the functions above) and the const arrays at around line 80

  if (rowA.sort().toString() === rowWinArrayA.sort().toString()) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (rowB.sort().toString() === rowWinArrayB.sort().toString()) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (rowC.sort().toString() === rowWinArrayC.sort().toString()) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (column1.sort().toString() === columnWinArray1.sort().toString()) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (column2.sort().toString() === columnWinArray2.sort().toString()) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (column3.sort().toString() === columnWinArray3.sort().toString()) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (
    diagTlBr.sort().toString() ===
    diagTopLeftToBottomRightWinArray.sort().toString()
  ) {
    console.log(`${playerType} wins!!!`);
    won = true;
  } else if (
    diagTrBl.sort().toString() ===
    diagTopRightToBottomLeftWinArray.sort().toString()
  ) {
    console.log(`${playerType} wins!!!`);
    won = true;
  }
  if (won && playerType === "player") {
    playAgainScreen.classList.remove(hiddenClass);
    winImage.classList.remove(hiddenClass);
  } else if (won && playerType === "computer") {
    playAgainScreen.classList.remove(hiddenClass);
    loseImage.classList.remove(hiddenClass);
  }
  winFuncComplete = true;
}

function draw() {
  if (movesRemaining.length === 0 && !won && winFuncComplete) {
    console.log("Draw");
    drawImage.classList.remove(hiddenClass);
    playAgainScreen.classList.remove(hiddenClass);
    drawState = true;
  } else {
    drawState = false;
  }
}
