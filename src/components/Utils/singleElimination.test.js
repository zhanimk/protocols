import {
  buildSingleEliminationRounds,
  getAutoAdvancePicks,
} from "./singleElimination";

describe("singleElimination", () => {
  test("buildSingleEliminationRounds builds bracket rounds", () => {
    const seeded = [
      { id: "1", name: "A" },
      { id: "2", name: "B" },
      { id: "3", name: "C" },
      { id: "4", name: "D" },
      null,
      null,
      null,
      null,
    ];

    const rounds = buildSingleEliminationRounds(seeded, 8, {});
    expect(rounds).toHaveLength(3);
    expect(rounds[0]).toHaveLength(4);
    expect(rounds[1]).toHaveLength(2);
    expect(rounds[2]).toHaveLength(1);
  });

  test("getAutoAdvancePicks auto-advances BYE matches", () => {
    const rounds = [
      [
        { id: "r1-0", p1: { id: "1" }, p2: null },
        { id: "r1-1", p1: null, p2: { id: "2" } },
      ],
    ];

    const picks = getAutoAdvancePicks(rounds, {});
    expect(picks["r1-0"]).toEqual({ id: "1" });
    expect(picks["r1-1"]).toEqual({ id: "2" });
    expect(picks["r1-0_loser"]).toBeNull();
    expect(picks["r1-1_loser"]).toBeNull();
  });
});
