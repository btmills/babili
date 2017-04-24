"use strict";

const DELIMITTER = ".";

module.exports = function parseOpts(argv) {
  const arr = Object.keys(argv)
    .filter(key => key !== "_" && argv[key] !== void 0)
    .map(key => [...key.split(DELIMITTER), argv[key]]);

  // sort to ensure dot notation occurs after parent key
  arr.sort((a, b) => {
    if (a.length === b.length) {
      return a[0] > b[0];
    }
    return a.length > b.length;
  });

  return dotsToObject(arr);
};

function dotsToObject(dots) {
  const obj = {};
  for (const parts of dots) {
    add(obj, ...parts);
  }

  function add(o, first, ...rest) {
    if (rest.length < 1) {
      throw new Error("Option Parse Error");
    } else if (rest.length === 1) {
      o[first] = rest[0];
    } else {
      if (!hop(o, first) || o[first] === true) {
        o[first] = {};
      }
      if (o[first] !== false) {
        add(o[first], ...rest);
      }
    }
  }

  return obj;
}

function hop(o, key) {
  return Object.prototype.hasOwnProperty.call(o, key);
}
