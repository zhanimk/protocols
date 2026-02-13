export const ROUND_ROBIN_ORDERS = {
  2: [[1, 2]],
  3: [
    [1, 2],
    [2, 3],
    [1, 3],
  ],
  4: [
    [1, 2],
    [3, 4],
    [1, 3],
    [2, 4],
    [1, 4],
    [2, 3],
  ],
  5: [
    [1, 2],
    [3, 4],
    [5, 1],
    [2, 3],
    [4, 5],
    [1, 3],
    [2, 4],
    [3, 5],
    [1, 4],
    [2, 5],
  ],
};

export const getRoundRobinFightOrder = (count) => ROUND_ROBIN_ORDERS[count] || [];
