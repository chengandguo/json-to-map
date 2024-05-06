import mapStringify from "../src/map-stringify";

test("map stringify test with number keys", () => {
  const map = new Map([
    ["a", 0],
    ["2", 10],
    ["1", 20],
    ["b", 30],
  ]);
  const expected = '{"a":0,"2":10,"1":20,"b":30}';

  expect(mapStringify(map)).toStrictEqual(expected);
});
