export const getBracketSize = (n) => {
  if (n <= 5) return 0;
  if (n <= 8) return 8;
  if (n <= 16) return 16;
  return 32;
};
export const generateDraw = (participants = [], size = 16) => {
  if (size === 0) return participants;

  const byClub = {};

  participants.forEach((p) => {
    const club = p.club?.trim() || `ind_${p.id}`;
    if (!byClub[club]) byClub[club] = [];
    byClub[club].push(p);
  });

  const clubs = Object.values(byClub).sort((a, b) => b.length - a.length);

  // IJF pool order A C B D
  const pools = [[], [], [], []];
  const order = [0, 2, 1, 3];
  let k = 0;

  clubs.forEach((club) =>
    club.forEach((athlete) => {
      pools[order[k % 4]].push(athlete);
      k++;
    })
  );

  const slots = Array(size).fill(null);

  // Olympic layouts
  const layouts = {
    8: [[0], [2], [4], [6]],
    16: [
      [0, 8],
      [4, 12],
      [2, 10],
      [6, 14],
    ],
    32: [
      [0, 16],
      [4, 20],
      [8, 24],
      [12, 28],
    ],
  };

  const layout = layouts[size];
  const poolSize = size / 4;

  pools.forEach((pool, poolIdx) => {
    let ptr = 0;
    const segments = layout[poolIdx];
    const chunk = poolSize / segments.length;

    segments.forEach((start) => {
      for (let i = 0; i < chunk; i++) {
        if (pool[ptr]) slots[start + i] = pool[ptr++];
      }
    });
  });

  return slots;
};
