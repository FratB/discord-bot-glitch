const Tools = require("./tools.js");

const roller = dice => {
  dice = dice.split("d");
  let count = parseInt(dice[0]) || 1;
  let val = parseInt(dice[1]);

  if (Number.isNaN(val)) {
    return -1;
  } else if (!Number.isInteger(val)) {
    return -2;
  } else if (val > 100) {
    return -2;
  } else if (val < 0) {
    return -2;
  }

  let results = [];
  for (let i = 0; i < count; i++) {
    results.push(Tools.random(1, val));
  }
  return results;
};

const rollDice = content => {
  let dices = content.split("+"); // Split to dices

  let results = [];
  let bonus = 0;

  for (let i = 0; i < dices.length; i++) {
    dices[i] = dices[i].trim(); // delete whitespaces

    if (dices[i].search(" ") != -1) {
      return -1;
    }

    if (dices[i] == "") {
      dices.splice(i, 1);
      continue;
    }

    if (dices[i].search("d") != -1) {
      let result = this.roller(dices[i]);
      if (result == -1) {
        return -1;
      } else if (result == -2) {
        return -2;
      }
      results.push(result);
    } else {
      bonus += parseInt(dices[i]);
    }
  }

  if (results.length == 0) {
    return -1;
  } else {
    return [results, bonus];
  }
};

module.exports.roller = roller;
module.exports.rollDice = rollDice;
