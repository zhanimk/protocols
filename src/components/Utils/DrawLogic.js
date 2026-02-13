import { getJudoCategory } from "../../rules";

/**
 * 1. СЕТКА ӨЛШЕМІН АНЫҚТАУ
 */
export const getBracketSize = (n) => {
  if (!n || n <= 0) return 0;
  if (n <= 5) return 5;
  if (n <= 8) return 8;
  if (n <= 16) return 16;
  if (n <= 32) return 32;
  return 64;
};

/**
 * 2. КЛУБТАРДЫ АЖЫРАТУ ЖӘНЕ ОРЫНДАРҒА БӨЛУ (ТҮЗЕТІЛДІ)
 */
export const generateDraw = (participants = [], size = 16) => {
  // 1. Қауіпсіздік тексерісі
  if (!participants) return [];
  const validParticipants = participants.filter(
    (p) => p && typeof p === "object"
  );
  if (validParticipants.length === 0) return [];
  if (size === 5) return validParticipants; // Круговая үшін сұрыптау керек емес

  // 2. Клубтар бойынша топтау
  const byClub = {};
  validParticipants.forEach((p) => {
    const clubName = p.club ? String(p.club).trim().toLowerCase() : "";
    const clubKey = clubName || `ind_${p.id || Math.random()}`;
    if (!byClub[clubKey]) byClub[clubKey] = [];
    byClub[clubKey].push(p);
  });

  // 3. Клубтарды санына қарай сұрыптау (Көп спортшысы бар клубтар бірінші)
  const sortedClubs = Object.values(byClub).sort((a, b) => b.length - a.length);

  // 4. Пулдарға (A, B, C, D) кезекпен лақтыру (IJF Distribution)
  const pools = [[], [], [], []];
  const ijfOrder = [0, 2, 1, 3]; // A -> C -> B -> D (Барынша алыстату үшін)

  let globalIdx = 0;
  sortedClubs.forEach((club) => {
    club.forEach((athlete) => {
      // Кезектегі пулға саламыз
      pools[ijfOrder[globalIdx % 4]].push(athlete);
      globalIdx++;
    });
  });

  // 5. Сетка слотын дайындау
  const slots = Array(size).fill(null);

  // --- МАҢЫЗДЫ ТҮЗЕТУ: Пулдардың барлық индекстері ---
  // Бұл жерде біз әр пулға сеткадан нақты орындар диапазонын береміз
  const layouts = {
    8: {
      A: [0, 1], // 1-ші ширек финал
      B: [2, 3], // 2-ші ширек финал
      C: [4, 5], // 3-ші ширек финал
      D: [6, 7], // 4-ші ширек финал
    },
    16: {
      A: [0, 1, 2, 3],
      B: [4, 5, 6, 7],
      C: [8, 9, 10, 11],
      D: [12, 13, 14, 15],
    },
    32: {
      A: [0, 1, 2, 3, 4, 5, 6, 7],
      B: [8, 9, 10, 11, 12, 13, 14, 15],
      C: [16, 17, 18, 19, 20, 21, 22, 23],
      D: [24, 25, 26, 27, 28, 29, 30, 31],
    },
  };

  const currentLayout = layouts[size];

  // Егер layout табылмаса (мысалы 64), жай тізімді береміз
  if (!currentLayout) return validParticipants;

  // 6. Спортшыларды орындарға отырғызу
  const poolKeys = ["A", "B", "C", "D"];

  poolKeys.forEach((key, idx) => {
    const poolAthletes = pools[idx]; // Осы пулдағы спортшылар
    const targetSlots = currentLayout[key]; // Осы пулға арналған орындар

    if (poolAthletes && targetSlots) {
      poolAthletes.forEach((athlete, i) => {
        // Егер орын бар болса, отырғызамыз
        if (i < targetSlots.length) {
          slots[targetSlots[i]] = athlete;
        }
      });
    }
  });

  return slots;
};

// ... (parseParticipantsText функциясы өзгеріссіз қалады)
export const parseParticipantsText = (text) => {
  if (!text) return [];
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const parts = line.split(/[,;\t]/).map((s) => s.trim());
      const categoryData = getJudoCategory
        ? getJudoCategory(parts[4] || "M", parts[2] || "2013", parts[3] || "0")
        : { weightCat: "Unknown" };

      return {
        id: `p-${Date.now()}-${index}`,
        name: parts[0] || "Unknown",
        club: parts[1] || "No Club",
        year: parts[2] || "",
        weight: parts[3] || "",
        gender: parts[4] || "M",
        weightCat: categoryData.weightCat,
      };
    });
};
