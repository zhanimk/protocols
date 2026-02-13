import { getJudoCategory, getRulesByGender } from "./rules";

describe("rules", () => {
  test("getRulesByGender returns male/female groups", () => {
    expect(Object.keys(getRulesByGender("M")).length).toBeGreaterThan(0);
    expect(Object.keys(getRulesByGender("F")).length).toBeGreaterThan(0);
  });

  test("getJudoCategory supports new 3-arg signature", () => {
    const res = getJudoCategory("F", "2013", "40");
    expect(res.weightCat).toContain("2013-2014");
    expect(res.weightCat).toContain("-40кг");
  });

  test("getJudoCategory keeps backward compatibility with 2 args", () => {
    const res = getJudoCategory("2013", "35");
    expect(res.weightCat).toContain("2013-2014");
    expect(res.weightCat).toContain("-35кг");
  });
});
