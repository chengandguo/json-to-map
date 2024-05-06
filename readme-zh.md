# json-to-map

这个库主要解决 JSON 解析以下 2 个问题

1.当解析包含数字`key`的`JSON`时，解析后的对象，所有数字`key`会按照从小到大的顺序排列。
这在 JSON diff 等场景会带来 diff 数据问题。参看下面的例子：

```ts
// 数字key被排序，而不是按照插入顺序进行排列
const jsonStr = '{"a": 0, "2": 10, "1": 20, "b": 30}';
const obj = JSON.parse(jsonStr);
console.log(obj); // {1: 20, 2: 10, a: 0, b: 30}
// 我们期待的顺序是["a", "2", "1", "b"]
console.log(Object.keys(obj)); // output: ['1', '2', 'a', 'b']
```

2.JSON 解析超出精度的整数与小数会丢失精度

```ts
// safe integer
// [-(2**53-1), 2**53-1]  => [-9007199254740991, 9007199254740991]
const obj = JSON.parse(9007199254740999);
console.log(obj); // output: 9007199254741000 精度丢失
```

针对问题 1，解析 JSON 字符串转换为 Map，Map 的插入顺序即为 JSON 字符串顺序，保证有序性。
针对问题 2，解析 JSON 字符串时，可以将超出精度的整数解析为字符串，保证精度问题。
后面做反向转换时，可以根据 JSON Schema 定义的数据类型做反向序列化

# 用法

### 1.`parseJsonToMap`将 JSON string 解析为 Map

```
function parseJsonToMap(source: string, options?: IOptions) {}
interface IOptions {
  strict?: boolean; // not being strict means do not generate syntax errors for "duplicate key", default is false
  storeAsString?: boolean; // toggles whether the values should be stored as BigNumber (default) or a string, default is false
  alwaysParseAsBigInt?: boolean; // toggles whether all numbers should be BigInt Type, default is false
  protoAction?: "error" | "ignore" | "preserve"; // whether keep __proto__ property, default is "error", not allowed
  constructorAction?: "error" | "ignore" | "preserve"; // whether keep constructor property, default is "error", not allowed
}

```

#### I.包含数字 key 的 JSON string 按照顺序排列

```ts
import { parseJsonToMap } from "json-to-map";
const str = '{"a": 0, "2": 10, "1": 20, "b": 30}';
const map = parseJsonToMap(str);
console.log(map);
/*
   排列顺序与json string声明一致
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

#### II：数字存储为字符串

解析超出 JS 精度的数字，解析为字符串， 使用配置`{ storeAsString: true }`

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

### 2.将 map 解析为 JSON string

用法与 JSON.stringify 完全一致，函数声明如下：

```
function mapStringify(
  value: any,
  replacer?: ((key: string, value: any) => any) | Array<number | string> | null,
  space?: number | string
) {}
```

#### I. map 解析为 json string

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
      ["bbb", 3],
      ["1", 4],
    ]),
  ],
]);

console.log(mapStringify(map));
/**
 * output
 * {"a":0,"2":10,"1":20,"b":{"bb":2,"bbb":3,"1":4}}
 */
```

#### II. map 解析为 json string，包含控制符

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
      ["bbb", 3],
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
    "bbb": 3,
    "1": 4
  }
}
*/
```
