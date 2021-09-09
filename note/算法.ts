/* 快排序 */
function quickSort(arr: any[]) {
  const len = arr.length;
  if (len <= 1) {
    return arr;
  }
  const middle = arr[Math.floor(len / 2)];
  const left = [];
  const right = [];
  const same = [];
  arr.forEach((v) => {
    if (v < middle) {
      left.push(v);
    } else if (v > middle) {
      right.push(v);
    } else {
      same.push(v);
    }
  });
  return [...quickSort(left), ...quickSort(same), ...quickSort(right)];
}

/* 打印树节点路径 */
function binaryTreePaths(root) {
  const paths = [];
  const help = (node, path) => {
    if (node) {
      path += node.val.toString();
      if (node.left === null && node.right === null) {
        // 当前节点是叶子节点
        paths.push(path); // 把路径加入到答案中
      } else {
        path += "->"; // 当前节点不是叶子节点，继续递归遍历
        help(node.left, path);
        help(node.right, path);
      }
    }
  };
  help(root, "");
  return paths;
}

/* 二叉树的深度 */
function maxDepth(root) {
  if (!root) {
    return 0;
  } else {
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
  }
}

/* 判断二叉搜索树 */
function isValidBST(root) {
  return helper(root, -Infinity, Infinity);

  function helper(node, lower, upper) {
    if (node === null) {
      return true;
    }
    if (node.val <= lower || node.val >= upper) {
      return false;
    }
    return (
      helper(node.left, lower, node.val) && helper(node.right, node.val, upper)
    );
  }
}

/* 给数字字符串加逗号 */
function addComma(str: string) {
  return str.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}

/* 判断是不是对称二叉树 */
function isSymmetric(root) {
  function check(left, right) {
    if (!left && !right) {
      return true;
    }
    if (!left || !right) {
      return false;
    }
    return (
      left.value === right.value &&
      check(left.left, right.right) &&
      check(left.right, right.left)
    );
  }

  return check(root, root);
}

/* 全排列 */
function fullPermutation(str: string) {
  const result = [];
  const len = str.length;
  if (len === 0) {
    return [];
  } else if (len === 1) {
    return [str];
  } else {
    for (let i = 0; i < len; i++) {
      const target = str[i];
      const rest = str.substring(0, i) + str.substring(i + 1, len);
      const restPermutation = fullPermutation(rest);
      restPermutation.forEach((v) => {
        result.push(v + target);
      });
      return result;
    }
  }
}
