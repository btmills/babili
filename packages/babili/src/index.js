const babel = require("babel-core");
const babiliPreset = require("babel-preset-babili");

module.exports = function babili(
  input,
  options = {},
  { minified = true, inputSourceMap = null, sourceMaps = false } = {}
) {
  const { code, map } = babel.transform({
    babelrc: false,
    presets: [[babiliPreset, options]],
    comments: false,
    inputSourceMap,
    sourceMaps,
    minified
  });

  return {
    code,
    map
  };
};
