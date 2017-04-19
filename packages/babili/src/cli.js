const minimist = require("minimist");
const babili = require("./index");

const booleans = [
  // preset level
  "evaluate",
  "deadcode",

  "unsafe",
  "unsafe.flipComparisons",
  "unsafe.simplifyComparisons",
  "unsafe.guards",
  "unsafe.typeConstructors",

  "infinity",
  "mangle",
  "numericLiterals",
  "replace",
  "simplify",
  "builtIns",

  "properties",
  "properties.consecutiveAdds",
  "properties.memberExpressions",
  "properties.propertyLiterals",

  "mergeVars",
  "booleans",
  "undefinedToVoid",
  "regexpConstructors",
  "removeConsole",
  "removeDebugger",
  "removeUndefined",
  "keepFnName",
  "keepClassName",

  // deadcode
  "deadcode.keepFnName",
  "deadcode.keepFnArgs",
  "deadcode.keepClassName",

  // mangle
  "mangle.eval",
  "mangle.keepFnName",
  "mangle.topLevel",
  "mangle.keepClassName",

  // unsafe.typeConstructors
  "unsafe.typeConstructors.array",
  "unsafe.typeConstructors.boolean",
  "unsafe.typeConstructors.number",
  "unsafe.typeConstructors.object",
  "unsafe.typeConstructors.string"
];

function parseConfig(str) {
  return str.split(",").map(option => option.split("=")).map(option => {
    const o = [];
    if (option[0].indexOf(".") > 0) o.push(...option[0].split("."));
    else o.push(option[0]);

    if (option[1].toLowerCase() === "true") o.push(true);
    else if (option[1].toLowerCase() === "false") o.push(false);
    else {
      throw new Error("Unsupported option");
    }
  });
}

function run(args) {
  const argv = minimist(args);

  console.log(parseConfig(argv.config));
}

run(process.argv.slice(2));
