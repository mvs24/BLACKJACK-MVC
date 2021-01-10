import { Card } from "../models/Card";
import { elements } from "./base";

export const renderCard = (card: Card, turn: "you" | "dealer") => {
  const markup = `
    <div class='card ${card.color}'>
        ${card.content} ${card.suit}
    </div>      
  `;
  elements[turn]!.insertAdjacentHTML("beforeend", markup);
};
