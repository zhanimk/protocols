import { buildSingleEliminationRounds, getAutoAdvancePicks } from "./singleElimination";
import { generateDraw } from "./DrawLogic";

const mergeResults = (results, updates) => ({ ...results, ...updates });

const applyAutoAdvanceUntilStable = (seededSlots, size, results) => {
  let current = { ...results };
  let changed = true;

  while (changed) {
    const rounds = buildSingleEliminationRounds(seededSlots, size, current);
    const auto = getAutoAdvancePicks(rounds, current);
    if (!Object.keys(auto).length) {
      changed = false;
    } else {
      current = mergeResults(current, auto);
    }
  }

  return current;
};

const createParticipants = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `P${i + 1}`,
    club: `C${(i % 4) + 1}`,
  }));

describe("tournament scenarios", () => {
  test("8-man bracket: winners propagate to final and champion is decided", () => {
    const participants = createParticipants(8);
    const seededSlots = generateDraw(participants, 8);

    let results = {};

    const rounds1 = buildSingleEliminationRounds(seededSlots, 8, results);
    results = mergeResults(results, {
      [rounds1[0][0].id]: rounds1[0][0].p1,
      [rounds1[0][1].id]: rounds1[0][1].p1,
      [rounds1[0][2].id]: rounds1[0][2].p1,
      [rounds1[0][3].id]: rounds1[0][3].p1,
    });

    const rounds2 = buildSingleEliminationRounds(seededSlots, 8, results);
    results = mergeResults(results, {
      [rounds2[1][0].id]: rounds2[1][0].p1,
      [rounds2[1][1].id]: rounds2[1][1].p1,
    });

    const rounds3 = buildSingleEliminationRounds(seededSlots, 8, results);
    const finalId = rounds3[2][0].id;
    results = mergeResults(results, { [finalId]: rounds3[2][0].p1 });

    expect(results[finalId]).toBeTruthy();
    expect(results[finalId].name).toBeDefined();
  });

  test("16-man bracket with 9 athletes: BYE auto-advances occur", () => {
    const participants = createParticipants(9);
    const seededSlots = generateDraw(participants, 16);

    const results = applyAutoAdvanceUntilStable(seededSlots, 16, {});

    const autoWinKeys = Object.keys(results).filter(
      (key) => key.startsWith("r") && !key.endsWith("_loser")
    );

    expect(autoWinKeys.length).toBeGreaterThan(0);
  });

  test("16-man bracket: manual quarterfinal results produce semifinal participants", () => {
    const participants = createParticipants(16);
    const seededSlots = generateDraw(participants, 16);

    let results = {};
    const initial = buildSingleEliminationRounds(seededSlots, 16, results);

    initial[0].forEach((match) => {
      results = mergeResults(results, { [match.id]: match.p1 });
    });

    const afterR1 = buildSingleEliminationRounds(seededSlots, 16, results);
    afterR1[1].forEach((match) => {
      results = mergeResults(results, { [match.id]: match.p1 });
    });

    const afterR2 = buildSingleEliminationRounds(seededSlots, 16, results);

    expect(afterR2[2]).toHaveLength(2);
    expect(afterR2[2][0].p1).toBeTruthy();
    expect(afterR2[2][0].p2).toBeTruthy();
    expect(afterR2[2][1].p1).toBeTruthy();
    expect(afterR2[2][1].p2).toBeTruthy();
  });
});
