const WINNING_SCORE = 100;
let player1Name = "";
let player2Name = "";

while (!player1Name) {
  player1Name = prompt("Enter Player 1 Name:");
  if (!player1Name) {
    alert("Please enter Player 1's name.");
  }
}
document.getElementById("player-1-name").innerText = player1Name;

while (!player2Name) {
  player2Name = prompt("Enter Player 2 Name:");
  if (!player2Name) {
    alert("Please enter Player 2's name.");
  }
}
document.getElementById("player-2-name").innerText = player2Name;

let player_1_totalScore = 0;
let player_1_currentScore = 0;

let player_2_totalScore = 0;
let player_2_currentScore = 0;

document.getElementById("player-1-total-score").textContent =
  player_1_totalScore;
document.getElementById("player-1-current-score").textContent =
  player_1_currentScore;

document.getElementById("player-2-total-score").textContent =
  player_2_totalScore;
document.getElementById("player-2-current-score").textContent =
  player_2_currentScore;

let save_button = document.getElementById("save-score");
let dice = document.getElementById("dice");
let roll_button = document.getElementById("roll");

let player1Card = document.getElementById("player-1-id");
let player2Card = document.getElementById("player-2-id");
let number_rolled = 0;
let total_dice_roll = 0;

function updatePlayerTurn() {
  if (total_dice_roll % 2 === 0) {
    player1Card.style.border = "3px solid red";
    player2Card.style.border = "none";
  } else {
    player2Card.style.border = "3px solid red";
    player1Card.style.border = "none";
  }
}

function checkWinner() {
  if (player_1_totalScore >= WINNING_SCORE) {
    alert(`🎉 ${player1Name} Wins! 🎉`);
  } else if (player_2_totalScore >= WINNING_SCORE) {
    alert(`🎉 ${player2Name} Wins! 🎉`);
  }
}

updatePlayerTurn();

roll_button.onclick = function () {
  rollDice();

  setTimeout(() => {
    if (total_dice_roll % 2 === 0) {
      if (number_rolled === 1) {
        player_1_currentScore = 0;
        player_1_totalScore = 0;
        total_dice_roll += 1;
        updatePlayerTurn();
      } else {
        player_1_currentScore = number_rolled;
      }
      document.getElementById("player-1-current-score").textContent =
        player_1_currentScore;
      document.getElementById("player-1-total-score").textContent =
        player_1_totalScore;
    } else {
      if (number_rolled === 1) {
        player_2_currentScore = 0;
        player_2_totalScore = 0;
        total_dice_roll += 1;
        updatePlayerTurn();
      } else {
        player_2_currentScore = number_rolled;
      }
      document.getElementById("player-2-current-score").textContent =
        player_2_currentScore;
      document.getElementById("player-2-total-score").textContent =
        player_2_totalScore;
    }
  }, 1000);
};

save_button.onclick = function () {
  if (total_dice_roll % 2 === 0) {
    player_1_totalScore += player_1_currentScore;
    player_1_currentScore = 0;
    document.getElementById("player-1-total-score").textContent =
      player_1_totalScore;
    document.getElementById("player-1-current-score").textContent =
      player_1_currentScore;
  } else {
    player_2_totalScore += player_2_currentScore;
    player_2_currentScore = 0;
    document.getElementById("player-2-total-score").textContent =
      player_2_totalScore;
    document.getElementById("player-2-current-score").textContent =
      player_2_currentScore;
  }
  checkWinner();
  total_dice_roll += 1;
  updatePlayerTurn();
};

function rollDice() {
  const num = Math.floor(Math.random() * 6) + 1;
  if (num === 1) number_rolled = 1;
  else if (num === 2) number_rolled = 5;
  else if (num === 3) number_rolled = 6;
  else if (num === 4) number_rolled = 3;
  else if (num === 5) number_rolled = 4;
  else if (num === 6) number_rolled = 2;

  for (let i = 1; i <= 6; i++) {
    dice.classList.remove("show-" + i);
  }
  dice.classList.add("show-" + num);
}

let reset_button = document.getElementById("reset-game");

reset_button.addEventListener("click", () => {
  player_1_currentScore = 0;
  player_1_totalScore = 0;
  player_2_currentScore = 0;
  player_2_totalScore = 0;
  total_dice_roll = 0; 


  document.getElementById("player-1-current-score").textContent = player_1_currentScore;
  document.getElementById("player-1-total-score").textContent = player_1_totalScore;
  document.getElementById("player-2-current-score").textContent = player_2_currentScore;
  document.getElementById("player-2-total-score").textContent = player_2_totalScore;

  document.querySelectorAll(".dice .side").forEach(side => side.classList.remove("show"));

  updatePlayerTurn();
});