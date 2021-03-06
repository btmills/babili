"use strict";

module.exports = removeUseStrict;

const newIssueUrl = "https://github.com/babel/babili/issues/new";

const useStrict = "use strict";

/**
 * Remove redundant use strict
 * If the parent has a "use strict" directive, it is not required in
 * the children
 *
 * @param {NodePath} block BlockStatement
 */
function removeUseStrict(block) {
  if (!block.isBlockStatement()) {
    throw new Error(
      `Received ${block.type}. Expected BlockStatement. ` +
        `Please report at ${newIssueUrl}`
    );
  }

  const useStricts = getUseStrictDirectives(block);

  // early exit
  if (useStricts.length < 1) return;

  // only keep the first use strict
  if (useStricts.length > 1) {
    for (let i = 1; i < useStricts.length; i++) {
      useStricts[i].remove();
    }
  }

  // check if parent has an use strict
  if (hasStrictParent(block)) {
    useStricts[0].remove();
  }
}

function hasStrictParent(path) {
  return path.findParent(
    parent => parent.isBlockStatement() && isStrict(parent)
  );
}

function isStrict(block) {
  return getUseStrictDirectives(block).length > 0;
}

function getUseStrictDirectives(block) {
  return block.get("directives").filter(directive => {
    return directive.node.value.value === useStrict;
  });
}
