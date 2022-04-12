import WORDS from "../words.json";

let oneDay = 1000 * 60 * 60 * 24;

let WORD_OF_THE_DAY = [
  ...WORDS[Math.floor(new Date().getTime() / oneDay) - 19084],
];

export default WORD_OF_THE_DAY;
