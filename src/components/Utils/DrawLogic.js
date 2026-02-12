// src/Utils/DrawLogic.js

// Қатысушы санына қарай тордың өлшемін анықтау
export const getBracketSize = (n) => {
  if (n <= 5) return 0; // Round Robin (Айналмалы)
  if (n <= 8) return 8; // Olympic 8
  if (n <= 16) return 16; // Olympic 16
  return 32; // Olympic 32 (default)
};

// Жеребьевка жасау (Клубтарды ажырату)
export const generateDraw = (participants = [], size = 32) => {
  const byClub = {};

  // 1. Клубтар бойынша топтау
  participants.forEach((p) => {
    const clubName = p.club ? p.club.trim() : "Independent";
    if (!byClub[clubName]) byClub[clubName] = [];
    byClub[clubName].push(p);
  });

  // 2. Көп адамы бар клубтарды бірінші аламыз
  const clubsArray = Object.values(byClub).sort((a, b) => b.length - a.length);

  // 3. 4 "Себетке" (Pool A, B, C, D) саламыз
  let pools = [[], [], [], []];

  clubsArray.forEach((clubMembers) => {
    clubMembers.forEach((member, index) => {
      // Тарату схемасы: A(0) -> C(2) -> B(1) -> D(3)
      // Бұл IJF стандартына жақын (Алыс орналастыру)
      const targetPool = [0, 2, 1, 3][index % 4];
      pools[targetPool].push(member);
    });
  });

  // 4. Торға орналастыру (Seeding)
  const finalSlots = Array(size).fill(null);

  const fillSegment = (poolIndex, startSlot, endSlot) => {
    const players = pools[poolIndex];
    if (!players) return;

    let current = startSlot;
    players.forEach((p) => {
      if (current <= endSlot) {
        // Жұп орындарға (0, 2, 4...) саламыз (бос орын қалдыру үшін)
        finalSlots[current] = p;
        current += 2;
      }
    });

    // Егер жұп орындар толса, тақ орындарға саламыз
    if (players.length > (endSlot - startSlot + 1) / 2) {
      let oddCurrent = startSlot + 1;
      players.slice(Math.ceil((endSlot - startSlot + 1) / 2)).forEach((p) => {
        if (oddCurrent <= endSlot) {
          finalSlots[oddCurrent] = p;
          oddCurrent += 2;
        }
      });
    }
  };

  // 32, 16 және 8 үшін сегменттерді анықтау
  if (size === 32) {
    fillSegment(0, 0, 7); // Pool A
    fillSegment(1, 8, 15); // Pool B
    fillSegment(2, 16, 23); // Pool C
    fillSegment(3, 24, 31); // Pool D
  } else if (size === 16) {
    fillSegment(0, 0, 3); // Pool A
    fillSegment(1, 4, 7); // Pool B
    fillSegment(2, 8, 11); // Pool C
    fillSegment(3, 12, 15); // Pool D
  } else if (size === 8) {
    fillSegment(0, 0, 1); // Pool A
    fillSegment(1, 2, 3); // Pool B
    fillSegment(2, 4, 5); // Pool C
    fillSegment(3, 6, 7); // Pool D
  }

  return finalSlots;
};
