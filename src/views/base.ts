export const elements = {
  hit: document.querySelector(".hit"),
  stand: document.querySelector(".stand"),
  deal: document.querySelector(".deal"),
  you: document.querySelector(".you__card--container"),
  dealer: document.querySelector(".dealer__card--container"),
  youSum: document.querySelector("#you"),
  dealerSum: document.querySelector("#dealer"),
};

export const changeActivePlayer = (turn: "you" | "dealer") => {
  [...document.querySelectorAll(".active")].forEach((activeEl) =>
    activeEl.classList.remove("active")
  );

  document.querySelector(`.${turn}`)?.classList.add("active");
};
