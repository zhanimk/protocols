import {
  buildResultDocId,
  hydrateResults,
  serializeResults,
} from "./resultPersistence";

describe("resultPersistence", () => {
  test("buildResultDocId normalizes category into safe id", () => {
    expect(buildResultDocId("-38кг (2013-2014)")).toBe("38-2013-2014");
    expect(buildResultDocId("   ")).toBe("uncategorized");
  });

  test("serializeResults keeps winner/loser shape", () => {
    const input = {
      "r1-0": { id: "1", name: "A", club: "X", extra: "ignored" },
      "r1-0_loser": null,
    };

    expect(serializeResults(input)).toEqual({
      "r1-0": { id: "1", name: "A", club: "X" },
      "r1-0_loser": null,
    });
  });

  test("hydrateResults prefers current participant object by id", () => {
    const participants = [{ id: "1", name: "A New", club: "New Club" }];
    const stored = {
      "r1-0": { id: "1", name: "A Old", club: "Old Club" },
      "r1-0_loser": null,
    };

    const hydrated = hydrateResults(stored, participants);
    expect(hydrated["r1-0"]).toEqual(participants[0]);
    expect(hydrated["r1-0_loser"]).toBeNull();
  });
});
