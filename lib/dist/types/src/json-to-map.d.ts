interface IOptions {
    strict?: boolean;
    storeAsString?: boolean;
    alwaysParseAsBigInt?: boolean;
    protoAction?: "error" | "ignore" | "preserve";
    constructorAction?: "error" | "ignore" | "preserve";
}
declare const parseJsonToMap: (source: string, options?: IOptions) => any;
export default parseJsonToMap;
