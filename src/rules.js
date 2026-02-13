// src/rules.js

export const JUDO_RULES = {
  MALE: {
    "2011-2012": {
      weights: [38, 42, 46, 50, 55, 60, 66],
      plus: "+66",
      time: "3 минут",
      label: "Ұлдар",
      start: "12:00-14:00",
    },
    "2013-2014": {
      weights: [26, 29, 32, 35, 38, 42, 46, 50, 55],
      plus: "+55",
      time: "2 минут",
      label: "Ұлдар",
      start: "12:00-14:00",
    },
    "2015-2016": {
      weights: [21, 23, 26, 29, 32, 35, 38, 42],
      plus: "+42",
      time: "2 минут",
      label: "Ұлдар",
      start: "09:00-12:00",
    },
    "2017-2018-2019": {
      weights: [19, 21, 23, 26, 29, 32, 35],
      plus: "+35",
      time: "2 минут",
      label: "Ұлдар",
      start: "09:00-12:00",
    },
  },
  FEMALE: {
    "2011-2012-2013": {
      weights: [36, 44, 48, 52],
      plus: "+57",
      time: "3 минут",
      label: "Қыздар",
      start: "12:00-14:00",
    },
    "2014-2015-2016": {
      weights: [26, 29, 35],
      plus: "+46",
      time: "2 минут",
      label: "Қыздар",
      start: "09:00-12:00",
    },
  },
};

export const getJudoCategory = (gender, groupKey, weightStr) => {
  const rules =
    gender === "F" || gender === "Қ" ? JUDO_RULES.FEMALE : JUDO_RULES.MALE;
  const foundGroup = rules[groupKey];

  if (!foundGroup) return { weightCat: "Unknown" };

  const isPlus = String(weightStr).includes("+");
  const displayWeight = isPlus ? weightStr : `-${weightStr}`;

  // СТАНДАРТНЫЙ ВЫВОД: "-38кг (Ұлдар 2011-2012)"
  // Это гарантирует, что вкладка будет называться именно так
  const finalCategory = `${displayWeight}кг (${foundGroup.label} ${groupKey})`;

  return {
    weightCat: finalCategory,
    time: foundGroup.time,
    startTime: foundGroup.start,
  };
};
