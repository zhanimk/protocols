import { getRoundRobinFightOrder } from "./roundRobin";

const normalizePair = ([a, b]) => [Math.min(a, b), Math.max(a, b)].join("-");

describe("round robin schedule", () => {
  test("returns expected number of fights", () => {
    expect(getRoundRobinFightOrder(2)).toHaveLength(1);
    expect(getRoundRobinFightOrder(3)).toHaveLength(3);
    expect(getRoundRobinFightOrder(4)).toHaveLength(6);
    expect(getRoundRobinFightOrder(5)).toHaveLength(10);
  });

  test("creates unique pairs for 5 participants", () => {
    const order = getRoundRobinFightOrder(5);
    const uniquePairs = new Set(order.map(normalizePair));

    expect(uniquePairs.size).toBe(order.length);
    expect(uniquePairs.size).toBe(10);
  });

  test("every athlete fights n-1 times in 4-participant round robin", () => {
    const order = getRoundRobinFightOrder(4);
    const counts = new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ]);

    order.forEach(([a, b]) => {
      counts.set(a, counts.get(a) + 1);
      counts.set(b, counts.get(b) + 1);
    });

    expect(Array.from(counts.values())).toEqual([3, 3, 3, 3]);
  });
});
