# json-to-map

This library mainly solves the following 2 problems of JSON parsing
[查看中文文档](https://github.com/chengandguo/json-to-map/blob/main/readme-zh.md)

1. When parsing `JSON` containing numeric `key`, in the parsed object, all numeric `key` will be arranged in order from small to large.  
   This will cause diff data problems in scenarios such as JSON diff. See the example below:

```ts
// Numeric keys are sorted, not in insertion order
const jsonStr = '{"a": 0, "2": 10, "1": 20, "b": 30}';
const obj = JSON.parse(jsonStr);
console.log(obj); // {1: 20, 2: 10, a: 0, b: 30}
// The order we expect is ["a", "2", "1", "b"]
console.log(Object.keys(obj)); // output: ['1', '2', 'a', 'b']
```

2.JSON will lose precision when parsing integers and decimals that exceed the precision.

```ts
// safe integer
// [-(2**53-1), 2**53-1] => [-9007199254740991, 9007199254740991]
const obj = JSON.parse(9007199254740999);
console.log(obj); // output: 9007199254741000 precision lost
```

For question 1, parse the JSON string and convert it into a Map. The insertion order of the Map is the JSON string order, ensuring orderliness.  
Regarding question 2, when parsing JSON strings, integers that exceed the precision can be parsed into strings to ensure accuracy.
When doing reverse conversion later, reverse serialization can be done based on the data type defined by JSON Schema.

# Usage

### 1.`parseJsonToMap` parses JSON string into Map

```
function parseJsonToMap(source: string, options?: IOptions) {}
interface IOptions {
   strict?: boolean; // not being strict means do not generate syntax errors for "duplicate key", default is false
   storeAsString?: boolean; // toggle whether the values should be stored as BigNumber (default) or a string, default is false
   alwaysParseAsBigInt?: boolean; // toggle whether all numbers should be BigInt Type, default is false
   protoAction?: "error" | "ignore" | "preserve"; // whether keep __proto__ property, default is "error", not allowed
   constructorAction?: "error" | "ignore" | "preserve"; // whether keep constructor property, default is "error", not allowed
}

```

#### I. The JSON string containing numeric keys is arranged in order

```ts
import { parseJsonToMap } from "json-to-map";
const str = '{"a": 0, "2": 10, "1": 20, "b": 30}';
const map = parseJsonToMap(str);
console.log(map);
/*
    The sorting order is consistent with the json string declaration
    new Map([
     [
         "a",
         0
     ],
     [
         "2",
         10
     ],
     [
         "1",
         20
     ],
     [
         "b",
         30
     ]
])
*/
```

#### II: Numbers stored as strings

To parse numbers beyond JS precision into strings, use the configuration `{ storeAsString: true }`

```ts
import { parseJsonToMap } from "json-to-map";
const str =
  '{"a": 123456789987654321, "2": 10, "1": 20, "b": 30, "c": true, "d": "123"}';
const map = parseJsonToMap(str, { storeAsString: true });
console.log(map);
/*
new Map([
    [
       "a",
       "123456789987654321"
    ],
    [
       "2",
       "10"
    ],
    [
       "1",
       "20"
    ],
    [
       "b",
       "30"
    ],
    [
       "c",
       true
    ],
    [
       "d",
       "123"
    ]
])
*/
```

### 2. Parse map into JSON string

The usage is exactly the same as JSON.stringify. The function is declared as follows:

```
function mapStringify(
   value: any,
   replacer?: ((key: string, value: any) => any) | Array<number | string> | null,
   space?: number | string
) {}
```

#### I. map is parsed into json string

```ts
import { mapStringify } from "json-to-map";

const map = new Map([
  ["a", 0],
  ["2", 10],
  ["1", 20],
  [
    "b",
    new Map([
      ["bb", 2],
      ["bb", 3],
      ["1", 4],
    ]),
  ],
]);

console.log(mapStringify(map));
/**
 *output
 * {"a":0,"2":10,"1":20,"b":{"bb":2,"bbb":3,"1":4}}
 */
```

#### II. map is parsed into json string, including control characters

```ts
import { mapStringify } from "json-to-map";

const map = new Map([
  ["a", 0],
  ["2", 10],
  ["1", 20],
  [
    "b",
    new Map([
      ["bb", 2],
      ["bb", 3],
      ["1", 4],
    ]),
  ],
]);

console.log(mapStringify(map, null, 2));
/*
output:
{
   "a": 0,
   "2": 10,
   "1": 20,
   "b": {
     "bb": 2,
     "bb": 3,
     "1": 4
   }
}
*/
```

# Thanks

This library is based on [json-bigint](https://www.npmjs.com/package/json-bigint), and heartfelt thanks to the author sidorares for his work. The code implements a clear and concise top-down JSON parser.
