jest.autoMockOff();

const { execFileSync } = require("child_process");
const babiliCli = require.resolve("../bin/babili");

function exec(stdin, ...opts) {
  let options = { encoding: "utf-8" };
  if (stdin !== "") {
    options = Object.assign(options, {
      input: stdin
    });
  }
  return execFileSync(`${babiliCli}`, [].concat(opts), options);
}

describe("Babili CLI", () => {
  it("should show help for --help", () => {
    expect(exec("", "--help")).toBeDefined();
  });

  it("should show version for --vevrsion", () => {
    expect(exec("", "--version")).toBeDefined();
  });

  it("should throw on all invalid options", () => {
    expect(exec("", "--foo", "--bar")).toMatchSnapshot();
  });

  it("should read from stdin and o/p to stdout", () => {
    let source = "let abcd = 10, bcdsa = 20";
    expect(exec(source, "--mangle.topLevel")).toMatchSnapshot();
  });
});
