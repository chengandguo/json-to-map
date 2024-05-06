const { mapStringify, parseJsonToMap } = window.JsonToMap;

/* 
  safe integer 
  [-(2**53-1), 2**53-1]  => [-9007199254740991, 9007199254740991]
*/

// const str = '{"a": 0, "2": 10, "1": 20, "b": 30}';
// const map = parseJsonToMap(str, { storeAsString: true });
// console.log(map);

// for (const [key, value] of map) {
//   console.log(key, ":", value);
// }

// console.log(mapStringify(map, null, 2));

// console.log(mapStringify('"123456987654321"'));

const map = new Map([
  ["a", 0],
  ["2", 10],
  ["1", 20],
  [
    "b",
    new Map([
      ["bb", 2],
      ["bbb", 3],
      ["1", 4],
    ]),
  ],
]);

console.log(mapStringify(map, null, 2));

// const json = '{"a": 123456789987654321}';

// console.log(parseJsonToMap(json));

// const str =
//   '{"a": 123456789987654321, "2": 10, "1": 20, "b": 30, "c": true, "d": "123"}';
// const map = parseJsonToMap(str, { storeAsString: true });
// console.log(map);
