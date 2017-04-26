const fs = require("fs");
const path = require("path");
const glob = require("glob");
const babili = require("./");
const EXTENSION = ".js";

module.exports.validateFiles = function(list) {
  let filenames = list.reduce(function(globbed, input) {
    let files = glob.sync(input);
    if (!files.length) files = [input];
    return globbed.concat(files);
  }, []);
  return filenames;
};

module.exports.processFiles = function(fileList, { stdin, output }) {
  if (stdin) {
    readStdin().then(input => {
      let { code } = babili(input);
      if (!output) {
        process.stdout.write(code);
      } else {
        fs.writeFileSync(path.resolve(output, "output.min.js"), code, "utf-8");
      }
    });
  } else {
    walkSync(fileList);
  }
};

function readStdin() {
  let code = "";
  const stdin = process.stdin;

  return new Promise(resolve => {
    stdin.setEncoding("utf8");

    stdin.on("readable", () => {
      const chunk = process.stdin.read();
      if (chunk !== null) code += chunk;
    });

    stdin.on("end", () => {
      resolve(code);
    });
  });
}

function walkSync(fileList, dirPath = "./") {
  for (let filePath of fileList) {
    const resolvedPath = path.resolve(dirPath, filePath);
    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      let list = fs.readdirSync(resolvedPath);
      walkSync(list, resolvedPath);
    } else {
      transformFile(dirPath, resolvedPath);
    }
  }
}

function getFileName(filePath) {
  const filename = path.basename(filePath, EXTENSION);
  return `${filename}.min${EXTENSION}`;
}

function transformFile(dirPath, filePath) {
  let input;
  const fileName = getFileName(filePath);
  try {
    input = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Unable to read file: " + fileName + "\n" + err);
    return;
  }
  let { code } = babili(input);
  try {
    fs.writeFileSync(path.join(dirPath, fileName), code, "utf-8");
  } catch (err) {
    console.error("Unable to write file: " + fileName + "\n" + err);
  }
}
