import parseJsonToMap from "../src/parse-json-to-map";

test("parse json to map with number keys", () => {
  const expected = new Map([
    ["a", 0],
    ["2", 10],
    ["1", 20],
    ["b", 30],
  ]);
  expect(parseJsonToMap('{"a": 0, "2": 10, "1": 20, "b": 30}')).toStrictEqual(
    expected
  );
});

test("parse json to map with number over precision", () => {
  expect(
    parseJsonToMap("1234567899876543231", { storeAsString: true })
  ).toStrictEqual("1234567899876543231");

  expect(parseJsonToMap('{"a": 123456789987654321}')).toStrictEqual(
    new Map([["a", 123456789987654321n]])
  );

  expect(
    parseJsonToMap('{"a": 123456789987654321}', { storeAsString: true })
  ).toStrictEqual(new Map([["a", "123456789987654321"]]));
});
