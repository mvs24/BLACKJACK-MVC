import { Card } from "./models/Card";
import { changeActivePlayer, elements } from "./views/base";
import * as cardView from "./views/cardView";
import * as pointsView from "./views/pointsView";

const matchValues: any = {
  J: 11,
  Q: 12,
  K: 13,
  A: [1, 11],
};

const suits = {
  diamonds: { content: "♦", color: "red" },
  clubs: { content: "♣", color: "black" },
  hearts: { content: "♥", color: "red" },
  spades: { content: "♠", color: "black" },
};

interface State {
  availableCards: Card[];
  turn: "you" | "dealer";
  you: Card[];
  dealer: Card[];
  winner: {
    status: boolean;
    player: undefined | string;
  };
  youSum: number;
  dealerSum: number;
  draw: boolean;
}

const state: State = {
  availableCards: [],
  turn: "you",
  you: [],
  dealer: [],
  winner: {
    status: false,
    player: undefined,
  },
  youSum: 0,
  dealerSum: 0,
  draw: false,
};

(() => {
  let cardContent: string[] = [];
  for (let i = 2; i <= 10; i++) {
    cardContent.push(`${i}`);
  }
  cardContent = [...cardContent, "J", "Q", "K", "A"];

  for (let key in suits) {
    cardContent.forEach((card: string) => {
      const value = isNaN(+card) ? matchValues[card] : +card;
      state.availableCards.push(
        //@ts-ignore
        new Card(value, suits[key].content, card, suits[key].color)
      );
    });
  }
})();

const changeTurn = () => {
  state.turn = state.turn === "you" ? "dealer" : "you";
  changeActivePlayer(state.turn);
};

const sendMessage = (msg: string) => {
  setTimeout(() => {
    alert(msg);
  }, 0);
};

const canPlay = () => {
  return state.winner.status === false || state.draw === false;
};

const generateRandomIndex = () => {
  return Math.floor(Math.random() * state.availableCards.length);
};

const generateRandomCard = (): Card => {
  const randomIndex = generateRandomIndex();
  state.availableCards.splice(randomIndex, 1);
  return state.availableCards[randomIndex];
};

const getShuffledIndexes = () => {
  const shuffledIndexes: number[] = [];

  for (let i = 0; i < state.availableCards.length; i++) {
    let randomIndex = generateRandomIndex();
    if (shuffledIndexes.indexOf(randomIndex) === -1) {
      shuffledIndexes.push(randomIndex);
      continue;
    } else {
      while (shuffledIndexes.indexOf(randomIndex) !== -1) {
        randomIndex = generateRandomIndex();
      }
      shuffledIndexes.push(randomIndex);
    }
  }

  return shuffledIndexes;
};

const shuffleCards = () => {
  const shuffledIndexes: number[] = getShuffledIndexes();

  shuffledIndexes.forEach((elIndex, i) => {
    state.availableCards[i] = state.availableCards[elIndex];
  });
};

const getSumOfSelectedCards = (selectedCards: Card[], aceIndex: number = 1) => {
  return selectedCards.reduce((acc, cur) => {
    if (cur.content === "A") {
      //@ts-ignore
      return acc + cur.value[aceIndex];
    }
    //@ts-ignore
    return acc + cur.value;
  }, 0);
};

const hasAces = (selectedCards: Card[]) =>
  selectedCards.some((card) => card.content === "A");

const controlForAces = (selectedCards: Card[]) => {
  if (hasAces(selectedCards)) {
    const currentSum = getSumOfSelectedCards(selectedCards);

    if (currentSum > 21 && currentSum < 32) {
      const changedSum = getSumOfSelectedCards(selectedCards, 0);
      state.youSum = changedSum;
      pointsView.renderSum(state.youSum, state.turn);

      standController();
    }
  }
};

const controlBlackJack = (sum: number, winner: string) => {
  if (sum === 21) {
    state.winner.status = true;
    state.winner.player = winner;

    sendMessage("BlackJACK!");
  }
};

const hitController = () => {
  const card = generateRandomCard();

  console.log(state.availableCards);

  if (state.turn === "you") {
    state.you.push(card);
    cardView.renderCard(card, state.turn);

    const selectedSum = getSumOfSelectedCards(state.you);

    state.youSum = selectedSum;

    controlBlackJack(selectedSum, "you");

    pointsView.renderSum(selectedSum, state.turn);

    if (!hasAces(state.you) && selectedSum > 21) {
      state.winner.player = "dealer";
      state.winner.status = true;

      sendMessage("Dealer won the game");
    }
    controlForAces(state.you);
  } else if (state.turn === "dealer") {
    state.dealer.push(card);
    cardView.renderCard(card, state.turn);
    const selectedSum = getSumOfSelectedCards(state.dealer);

    controlBlackJack(selectedSum, "dealer");
    state.dealerSum = selectedSum;

    pointsView.renderSum(selectedSum, state.turn);

    if (!hasAces(state.dealer) && selectedSum > 21) {
      state.winner.player = "dealer";
      state.winner.status = true;

      sendMessage("You won the game");
    }
    controlForAces(state.dealer);
  }
};

const standController = () => {
  if (state.youSum === 0 || state.dealerSum === 0) {
    changeTurn();
  } else {
    if (state.youSum === state.dealerSum) {
      state.draw = true;
      sendMessage("Draw");
    }

    const winner = state.youSum > state.dealerSum ? "you" : "dealer";
    state.winner.status = true;
    state.winner.player = winner;

    sendMessage(`${winner.toUpperCase()} won the game`);
  }
};

shuffleCards();
elements.hit!.addEventListener("click", () => {
  if (canPlay()) hitController();
});
elements.stand?.addEventListener("click", () => {
  if (canPlay()) {
    if (state[state.turn].length === 0) return;

    standController();
  }
});
elements.deal?.addEventListener("click", () => location.reload());
