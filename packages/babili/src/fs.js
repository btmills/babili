const fs = require("fs");
const path = require("path");
const babili = require("./");
const EXTENSION = ".js";

module.exports = function walkSync(fileList, dirPath = "./") {
  for (let filePath of fileList) {
    const resolvedPath = path.resolve(dirPath, filePath);
    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      let list = fs.readdirSync(resolvedPath);
      walkSync(list, resolvedPath);
    } else {
      processFile(dirPath, resolvedPath);
    }
  }
};

function getFileName(filePath) {
  const filename = path.basename(filePath, EXTENSION);
  return `${filename}.min${EXTENSION}`;
}

function processFile(dirPath, filePath) {
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
