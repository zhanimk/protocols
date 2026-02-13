export const buildSingleEliminationRounds = (seededSlots = [], size = 8, results = {}) => {
  if (!size || size < 2) return [];

  const totalRounds = Math.log2(size);
  const rounds = [];

  const firstRound = [];
  for (let i = 0; i < size / 2; i++) {
    firstRound.push({
      id: `r1-${i}`,
      p1: seededSlots[i * 2] || null,
      p2: seededSlots[i * 2 + 1] || null,
    });
  }
  rounds.push(firstRound);

  for (let round = 2; round <= totalRounds; round++) {
    const prev = rounds[round - 2];
    const current = [];

    for (let i = 0; i < prev.length / 2; i++) {
      const prevA = prev[i * 2].id;
      const prevB = prev[i * 2 + 1].id;

      current.push({
        id: `r${round}-${i}`,
        p1: results[prevA] || null,
        p2: results[prevB] || null,
      });
    }

    rounds.push(current);
  }

  return rounds;
};

export const getAutoAdvancePicks = (rounds = [], results = {}) => {
  const picks = {};

  rounds.forEach((round) => {
    round.forEach((match) => {
      if (results[match.id]) return;

      const { p1, p2 } = match;
      if (p1 && !p2) {
        picks[match.id] = p1;
        picks[`${match.id}_loser`] = null;
      } else if (!p1 && p2) {
        picks[match.id] = p2;
        picks[`${match.id}_loser`] = null;
      }
    });
  });

  return picks;
};
