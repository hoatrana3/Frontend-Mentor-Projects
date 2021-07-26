import "./styles.scss";
import gsap from "gsap";

////////// GAME CONSTANTS ///////////
const gameChoices = {
  paper: { name: "paper", loseTo: ["scissors", "lizard"] },
  rock: { name: "rock", loseTo: ["paper", "spock"] },
  lizard: { name: "lizard", loseTo: ["scissors", "rock"] },
  spock: { name: "spock", loseTo: ["paper", "lizard"] },
  scissors: { name: "scissors", loseTo: ["spock", "rock"] }
};
const gameModes = [
  {
    name: "basic",
    logo: "/images/logo.svg",
    rule: "/images/image-rules.svg",
    playgroundBg: "/images/bg-triangle.svg",
    choices: [gameChoices.paper, gameChoices.rock, gameChoices.scissors]
  },
  {
    name: "advanced",
    logo: "/images/logo-bonus.svg",
    rule: "/images/image-rules-bonus.svg",
    playgroundBg: "/images/bg-pentagon.svg",
    choices: [
      gameChoices.scissors,
      gameChoices.paper,
      gameChoices.rock,
      gameChoices.lizard,
      gameChoices.spock
    ]
  }
];
const gameSteps = {
  PICKING: 0,
  WAITING: 1,
  FINAL: 2
};
const gameDoms = {
  images: {
    logo: document.getElementById("logo"),
    playgroundBg: document.getElementById("playgroundBg"),
    rule: document.getElementById("rulesImage")
  },
  texts: {
    score: document.getElementById("scoreText"),
    result: document.getElementById("resultText")
  },
  scenes: {
    picking: document.getElementById("scenePicking"),
    final: document.getElementById("sceneFinal")
  },
  choices: {
    playerOne: document.getElementById("playerOneChoice"),
    playerTwo: document.getElementById("playerTwoChoice")
  },
  buttons: {
    playAgain: document.getElementById("playAgainBtn"),
    changeMode: document.getElementById("modesChangeBtn"),
    openRules: document.getElementById("rulesBtn"),
    closeRules: document.getElementById("rulesModalClose")
  },
  containers: {
    nav: document.querySelector("nav"),
    choices: document.getElementById("gameChoices"),
    results: document.getElementById("gameResults"),
    rulesModal: document.getElementById("rulesModal")
  }
};
////////// END GAME CONSTANTS ///////////

////////// GAME VARIABLES ///////////
let currentGameMode = 0;
let playerOneChoice = null;
let playerTwoChoice = null;
let playerScore = 0;
let currentStep = 1;
let timeOutRandomP2Choice = null;
////////// END GAME VARIABLES ///////////

////////// STEP ONE FUNCTIONS ///////////
const resetGameChoices = () => {
  const choiceEls = gameDoms.containers.choices.querySelectorAll(".choice");
  [...choiceEls].forEach((el) => gameDoms.containers.choices.removeChild(el));
};
const onChoiceClick = (choice) => {
  playerOneChoice = choice;
  changeGameStep(gameSteps.WAITING);
};
const initGameChoices = () => {
  resetGameChoices();

  const mode = gameModes[currentGameMode];
  mode.choices.forEach((choice) => {
    const { name } = choice;
    const virtualDiv = document.createElement("div");
    virtualDiv.innerHTML = `
      <div data-choice="${name}" class="choice choice--${name}">
        <div><img src="/images/icon-${name}.svg" alt="" /></div>
      </div>
    `.trim();

    const realChoice = virtualDiv.firstChild;
    realChoice.addEventListener("click", () => onChoiceClick(choice));

    gameDoms.containers.choices.appendChild(realChoice);
  });
};
const initGameMode = () => {
  const mode = gameModes[currentGameMode];
  gameDoms.containers.choices.className = `mode-${mode.name}`;
  gameDoms.images.logo.setAttribute("src", mode.logo);
  gameDoms.images.playgroundBg.setAttribute("src", mode.playgroundBg);
  gameDoms.images.rule.setAttribute("src", mode.rule);
  gameDoms.buttons.changeMode.innerHTML = `
    Mode: <strong>${mode.name}</strong>
  `.trim();
};
const initStepOneAnimations = () => {
  gsap.from(gameDoms.containers.nav, {
    opacity: 0,
    translateY: "-100%",
    ease: "Back.easeOut",
    duration: 0.8
  });

  gsap.fromTo(
    gameDoms.scenes.picking,
    {
      opacity: 0,
      scale: 0,
      rotate: 180,
      translateY: "100%"
    },
    {
      opacity: 1,
      scale: 1,
      rotate: 0,
      translateY: 0,
      ease: "Back.easeOut",
      duration: 1,
      delay: 0.25
    }
  );

  gsap.from(gameDoms.buttons.changeMode, {
    opacity: 0,
    translateX: "-100%",
    ease: "Back.easeOut",
    duration: 0.5,
    delay: 0.5
  });

  gsap.from(gameDoms.buttons.openRules, {
    opacity: 0,
    translateX: "100%",
    ease: "Back.easeOut",
    duration: 0.5,
    delay: 0.65
  });

  gsap.fromTo(
    gameDoms.scenes.final,
    {
      opacity: 1,
      scale: 1,
      rotate: 0,
      translate: 0
    },
    {
      opacity: 0,
      scale: 0,
      rotate: -180,
      translateY: "-100%",
      ease: "Back.easeOut",
      duration: currentStep === 1 ? 0 : 1
    }
  );

  gsap.fromTo(
    gameDoms.containers.results,
    {
      opacity: 1,
      scale: 1,
      width: "auto",
      height: "auto",
      translateY: 0
    },
    {
      opacity: 0,
      scale: 0,
      width: 0,
      height: 0,
      translateY: "100%",
      ease: "Back.easeOut",
      duration: currentStep === 1 ? 0 : 0.6
    }
  );
};
const initGameStepOne = () => {
  initGameMode();
  initGameChoices();
  initStepOneAnimations();
};
////////// END STEP ONE ///////////

////////// STEP TWO FUNCTIONS ///////////
const resetPlayerChoice = (playerDom) => {
  playerDom.classList.remove("is-winner");
  playerDom.classList.add("not-picked");

  const choiceEl = playerDom.querySelector(".choice");
  choiceEl.className = "choice";
  choiceEl.innerHTML = "";
};
const resetPlayers = () => {
  resetPlayerChoice(gameDoms.choices.playerOne);
  resetPlayerChoice(gameDoms.choices.playerTwo);
  playerTwoChoice = null;
};
const mountPlayerChoice = ({ name }, playerDom) => {
  playerDom.classList.remove("not-picked");

  const choiceEl = playerDom.querySelector(".choice");
  choiceEl.classList.add(`choice--${name}`);
  choiceEl.innerHTML = `
    <div><img src="/images/icon-${name}.svg" alt="" /></div>
  `.trim();
};
const randomPlayerTwoChoice = () => {
  const choices = gameModes[currentGameMode].choices;
  playerTwoChoice = choices[Math.floor(Math.random() * choices.length)];

  mountPlayerChoice(playerTwoChoice, gameDoms.choices.playerTwo);
};
const initStepTwoAnimations = () => {
  gsap.fromTo(
    gameDoms.scenes.final,
    {
      opacity: 0,
      scale: 0,
      rotate: -180,
      translateY: "-100%"
    },
    {
      opacity: 1,
      scale: 1,
      translateY: 0,
      rotate: 0,
      ease: "Back.easeOut",
      duration: 1
    }
  );
  gsap.fromTo(
    gameDoms.scenes.picking,
    {
      opacity: 1,
      scale: 1,
      rotate: 0,
      translate: 0
    },
    {
      opacity: 0,
      scale: 0,
      rotate: 180,
      translateY: "100%",
      ease: "Back.easeOut",
      duration: 1
    }
  );
};
const initGameStepTwo = () => {
  resetPlayers();
  mountPlayerChoice(playerOneChoice, gameDoms.choices.playerOne);
  initStepTwoAnimations();

  timeOutRandomP2Choice = setTimeout(() => {
    const p2innerChoice = gameDoms.choices.playerTwo.querySelector(".choice");
    gsap
      .timeline()
      .fromTo(
        p2innerChoice,
        {
          scale: 1
        },
        {
          scale: 0,
          ease: "Back.easeIn",
          duration: 0.3,
          onComplete: randomPlayerTwoChoice
        }
      )
      .to(p2innerChoice, {
        scale: 1,
        ease: "Back.easeIn",
        duration: 0.3,
        onComplete: () => changeGameStep(gameSteps.FINAL)
      });
  }, 1000);
};
////////// END STEP TWO ///////////

////////// STEP THREE FUNCTIONS ///////////
const changePlayerScore = (nextScore) => {
  gameDoms.texts.score.innerHTML = playerScore = nextScore;
};
const campareChoices = (choice1, choice2) => {
  if (choice1.loseTo.includes(choice2.name)) return -1;
  if (choice2.loseTo.includes(choice1.name)) return 1;
  return 0;
};
const proccessResults = () => {
  const result = campareChoices(playerOneChoice, playerTwoChoice);
  switch (result) {
    case -1:
      gameDoms.texts.result.innerHTML = "You lose";
      gameDoms.buttons.playAgain.classList.add("get-lose");
      gameDoms.choices.playerTwo.classList.add("is-winner");
      changePlayerScore(playerScore - 1);
      break;
    case 1:
      gameDoms.texts.result.innerHTML = "You win";
      gameDoms.choices.playerOne.classList.add("is-winner");
      changePlayerScore(playerScore + 1);
      break;
    default:
      gameDoms.texts.result.innerHTML = "It's a draw";
      break;
  }
};
const initStepThreeAnimations = () => {
  gsap.fromTo(
    gameDoms.containers.results,
    {
      opacity: 0,
      scale: 0,
      width: 0,
      height: 0,
      translateY: "100%"
    },
    {
      opacity: 1,
      scale: 1,
      translateY: 0,
      width: "auto",
      height: "auto",
      ease: "Back.easeOut",
      duration: 0.6
    }
  );
};
const initGameStepThree = () => {
  gameDoms.buttons.playAgain.classList.remove("get-lose");
  proccessResults();
  initStepThreeAnimations();
};
////////// END STEP THREE ///////////

////////// CONTROL GAME FUNCTIONS ///////////
const changeGameStep = (nextStep) => {
  if (!timeOutRandomP2Choice) {
    clearTimeout(timeOutRandomP2Choice);
    timeOutRandomP2Choice = null;
  }

  switch (nextStep) {
    case gameSteps.PICKING:
      initGameStepOne();
      currentStep = 1;
      break;
    case gameSteps.WAITING:
      initGameStepTwo();
      currentStep = 2;
      break;
    case gameSteps.FINAL:
      initGameStepThree();
      currentStep = 3;
      break;
    default:
      // TODO: Wrong step;
      break;
  }
};
////////// END CONTROL GAME ///////////

////////// INITIALISE GAME ///////////
const changeMode = () => {
  currentGameMode = (currentGameMode + 1) % 2;
  changeGameStep(gameSteps.PICKING);
  gameDoms.texts.score.innerHTML = playerScore = 0;
};
const initGeneralEvents = () => {
  gameDoms.buttons.playAgain.addEventListener("click", () => {
    changeGameStep(gameSteps.PICKING);
  });
  gameDoms.buttons.openRules.addEventListener("click", () => {
    gsap.to(gameDoms.containers.rulesModal, {
      opacity: 1,
      scale: 1,
      pointerEvents: "auto",
      ease: "Back.easeOut",
      duration: 0.5
    });
  });
  gameDoms.buttons.closeRules.addEventListener("click", () => {
    gsap.to(gameDoms.containers.rulesModal, {
      opacity: 0,
      scale: 0,
      pointerEvents: "none",
      ease: "Back.easeIn",
      duration: 0.5
    });
  });
  gameDoms.buttons.changeMode.addEventListener("click", () => {
    changeMode();
  });
};

initGeneralEvents();
initGameStepOne();
