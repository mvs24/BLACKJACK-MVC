export class Card {
  constructor(
    public value: number | number[],
    public suit: string,
    public content: string,
    public color: "red" | "black"
  ) {}
}
