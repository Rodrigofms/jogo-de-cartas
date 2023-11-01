function redirecionar() {
  open("https://github.com/Rodrigofms");
}

const state = {
  score: {
    playerScore: 0,
    iaScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    ia: document.getElementById("ia-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  }
};

const playerSides = {
  player1: "player-cards",
  ia: "ia-cards"
}

const pathImages = "./assets/media/icons"

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}/dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}/magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}/exodia.png`,
    winOf: [0],
    loseOf: [1],
  }
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./assets/media/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"))
    });


  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardImages();

  let iaCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.ia.style.display = "block";

  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = ""

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.ia.src = cardData[iaCardId].img;

  let duelResults = await checkDuelResults(cardId, iaCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block"
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.iaScore}`;
}


async function checkDuelResults(playerCardId, iaCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(iaCardId)) {
    duelResults = "Venceu";
    await playAudio("win");
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(iaCardId)) {
    duelResults = "Perdeu";
    await playAudio("lose");
    state.score.iaScore++;
  }


  return duelResults;
}

async function removeAllCardImages() {
  let cards = document.querySelector("#ia-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());



  cards = document.querySelector("#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);


    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none"
  state.fieldCards.ia.style.display = "none";

  main();
}

async function playAudio(status) {
  const audio = new Audio(`./assets/media/audios/${status}.wav`)
  audio.volume = 0.2
  audio.play()
}

function main() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.ia.style.display = "none";

  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.ia);

  const bgm = document.getElementById("bgm");
  bgm.volume = 0.05;
  bgm.play();
}

main();