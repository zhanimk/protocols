const BASE_MALE_RULES = {
  "2011-2012": {
    label: "Младшие юноши (2011-2012)",
    weights: [38, 42, 46, 50, 55, 60, 66, 73],
    plus: "73+",
  },
  "2013-2014": {
    label: "Юноши дети (2013-2014)",
    weights: [32, 35, 38, 42, 46, 50, 55, 60, 66],
    plus: "66+",
  },
  "2015-2016": {
    label: "Секция (2015-2016)",
    weights: [26, 29, 32, 35, 38, 42, 46, 50, 55],
    plus: "55+",
  },
};

const BASE_FEMALE_RULES = {
  "2011-2012": {
    label: "Девушки (2011-2012)",
    weights: [36, 40, 44, 48, 52, 57, 63],
    plus: "63+",
  },
  "2013-2014": {
    label: "Девочки (2013-2014)",
    weights: [30, 33, 36, 40, 44, 48, 52, 57],
    plus: "57+",
  },
  "2015-2016": {
    label: "Девочки секция (2015-2016)",
    weights: [24, 27, 30, 33, 36, 40, 44, 48],
    plus: "48+",
  },
};

export const JUDO_RULES = {
  MALE: BASE_MALE_RULES,
  FEMALE: BASE_FEMALE_RULES,
};

export const getRulesByGender = (gender = "M") =>
  gender === "F" ? JUDO_RULES.FEMALE : JUDO_RULES.MALE;

const findGroupKey = (rules, year) => {
  const y = parseInt(year, 10);
  return Object.keys(rules).find((key) => {
    const [start, end] = key.split("-").map(Number);
    return y >= start && y <= end;
  });
};

// Backward compatible:
// getJudoCategory(year, weight)
// getJudoCategory(gender, year, weight)
export const getJudoCategory = (arg1, arg2, arg3) => {
  let gender = "M";
  let year = arg1;
  let weight = arg2;

  if (arg3 !== undefined) {
    gender = arg1;
    year = arg2;
    weight = arg3;
  }

  const rules = getRulesByGender(gender);
  const groupKey = findGroupKey(rules, year);

  if (!groupKey) {
    return { group: "Вне зачета", weightCat: "N/A" };
  }

  const rule = rules[groupKey];

  if (String(weight).includes("+")) {
    return {
      group: rule.label,
      weightCat: `${rule.plus} (${groupKey})`,
    };
  }

  return {
    group: rule.label,
    weightCat: `-${weight}кг (${groupKey})`,
  };
};
