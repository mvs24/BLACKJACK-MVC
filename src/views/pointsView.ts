import { elements } from "./base";

export const renderSum = (currentSum: number, turn: "you" | "dealer") => {
  //@ts-ignore
  elements[`${turn}Sum`].textContent = currentSum;
};
