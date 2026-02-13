import { generateDraw, getBracketSize } from "./DrawLogic";

describe("DrawLogic", () => {
  test("getBracketSize returns expected size by participant count", () => {
    expect(getBracketSize(3)).toBe(0);
    expect(getBracketSize(6)).toBe(8);
    expect(getBracketSize(12)).toBe(16);
    expect(getBracketSize(25)).toBe(32);
  });

  test("generateDraw keeps all participants and fills empty slots with null", () => {
    const participants = Array.from({ length: 6 }, (_, i) => ({
      id: `${i + 1}`,
      name: `P${i + 1}`,
      club: i % 2 === 0 ? "A" : "B",
    }));

    const slots = generateDraw(participants, 8);
    expect(slots).toHaveLength(8);

    const presentIds = slots.filter(Boolean).map((p) => p.id).sort();
    expect(presentIds).toEqual(participants.map((p) => p.id).sort());
    expect(slots.filter((s) => s === null)).toHaveLength(2);
  });
});
