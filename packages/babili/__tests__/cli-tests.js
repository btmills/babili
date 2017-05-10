jest.autoMockOff();

const { execFile } = require("child_process");
const babiliCli = require.resolve("../lib/cli");

function exec(...options) {
  return new Promise((resolve, reject) => {
    execFile(
      "node",
      [`${babiliCli}`].concat(options),
      (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        if (stdout) {
          return resolve(stdout);
        }
        resolve(stderr);
      }
    );
  });
}

describe("Babili CLI", () => {
  it("should throw error if no option is provided", () => {
    return exec().then(output => {
      expect(output).toMatchSnapshot();
    });
  });

  it("should throw on invalid options", () => {
    return exec("--foo").then(output => {
      expect(output).toMatchSnapshot();
    });
  });

  it("should show help for --help", () => {
    return exec("--help").then(output => {
      expect(output).toMatchSnapshot();
    });
  });

  // TODO - fix
  xit("should print to stdout if --stdin is specified", () => {
    let source = "let abcd = 10, bcdsa = 20";
    return exec("--mangle", "--stdin", `${source}`).then(output => {
      expect(output).toMatchSnapshot();
    });
  });
});
