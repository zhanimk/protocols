export const JUDO_RULES = {
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

export const getJudoCategory = (year, weight) => {
  const y = parseInt(year);

  // 1. Жыл бойынша топты табамыз
  const groupKey = Object.keys(JUDO_RULES).find((key) => {
    const [start, end] = key.split("-").map(Number);
    return y >= start && y <= end;
  });

  if (!groupKey) {
    return { group: "Вне зачета", weightCat: "N/A" };
  }

  const rule = JUDO_RULES[groupKey];

  // 2. Егер "73+" деген сияқты плюс таңдалса
  if (String(weight).includes("+")) {
    const categoryFull = `${rule.plus} (${groupKey})`;
    return { group: rule.label, weightCat: categoryFull };
  }

  // 3. Қалыпты салмақ таңдалса (Мысалы: 38)
  // Тізімнен таңдағандықтан, дәл сол категорияны береміз
  const categoryFull = `-${weight}кг (${groupKey})`;

  return {
    group: rule.label,
    weightCat: categoryFull,
  };
};
