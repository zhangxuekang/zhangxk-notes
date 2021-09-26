/** 快排序 **/
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

/** 打印树节点路径 **/
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

/** 二叉树的深度 **/
function maxDepth(root) {
  if (!root) {
    return 0;
  } else {
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
  }
}

/** 判断二叉搜索树 **/
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

/** 给数字字符串加逗号 **/
function addComma(str: string) {
  return str.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
}

/** 判断是不是对称二叉树 **/
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

/** 全排列 **/
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

/** 合并有序链表 **/
function mergeList(l1, l2) {
  if (l1 === null) {
    return l2;
  } else if (l2 === null) {
    return l1;
  } else if (l1.value > l2.value) {
    l2.next = mergeList(l1, l2.next);
    return l2;
  } else {
    l1.next = mergeList(l1.next, l2);
  }
}

/** 反转链表 **/
function reverseList(head) {
  if (head === null || head.next === null) {
    return head;
  }
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}

/** 最大的连续子序列 **/
function maxSubArray(nums: number[]) {
  let pre = 0;
  let maxAns = nums[0];
  nums.forEach((n) => {
    pre = Math.max(pre + n, n);
    maxAns = Math.max(maxAns, pre);
  });

  return maxAns;
}

/** 有效的括号 **/
function isValidBracket1(str: string) {
  const n = str.length;
  // 奇数肯定不对
  if (n % 2 === 1) {
    return false;
  }
  const pairs = new Map([
    [")", "("],
    ["]", "["],
    ["}", "{"],
  ]);
  const stk = [];
  for (let ch of str) {
    if (pairs.has(ch)) {
      if (stk.length === 0 || stk[stk.length - 1] !== pairs.get(ch)) {
        return false;
      }
      stk.pop();
    } else {
      stk.push(ch);
    }
  }
  return !stk.length;
}

function isValidBracket2(str: string) {
  const n = str.length;
  // 奇数肯定不对
  if (n % 2 === 1) {
    return false;
  }

  const regExp = /(\(\))|(\[\])|(\{\})/g;

  while (regExp.test(str)) {
    str = str.replace(regExp, "");
  }
  return str.length === 0;
}

/** 遍历二叉树 **/

/* 递归遍历实现 */
function traversal1(root) {
  if (root) {
    // 先序
    console.log(root);
    traversal1(root.left);
    // 中序
    // console.log(root);
    traversal1(root.right);
    // 后序
    // console.log(root);
  }
}

/* 遍历二叉树,先左后右的通用模板 */
function traversal(root) {
  const stack = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    root = root.right;
  }
}

/* 具体前序遍历代码 */
function preorderTraversal(root) {
  // 初始化数据
  const result = [];
  const stack = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      result.push(root.val);
      root = root.left;
    }
    root = stack.pop();
    root = root.right;
  }
  return result;
}

/* 具体中序遍历代码 */
function inorderTraversal(root) {
  // 初始化数据
  const result = [];
  const stack = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    result.push(root.val);
    root = root.right;
  }
  return result;
}

/* 具体后序遍历代码 */
function postorderTraversal(root) {
  // 初始化数据
  const res = [];
  const stack = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      res.unshift(root.val);
      root = root.right;
    }
    root = stack.pop();
    root = root.left;
  }
  return res;
}

/** 数组的包含关系 **/
function containArray(arrA: number[], arrB: number[]) {
  const arrMap = new Map();
  arrA.forEach((v) => {
    if (arrMap.has(v)) {
      arrMap.set(v, arrMap.get(v) + 1);
    } else {
      arrMap.set(v, 1);
    }
  });
  arrB.forEach((v) => {
    if (arrMap.has(v)) {
      arrMap.set(v, arrMap.get(v) - 1);
    } else {
      arrMap.set(v, -1);
    }
  });

  let an = 0;
  let bn = 0;
  for (let value of arrMap.values()) {
    if (value > 0) {
      an++;
    }
    if (value < 0) {
      bn++;
    }
  }
  // 相等
  if (!an && !bn) {
    return 0;
  }
  // 互相不包含
  if (an && bn) {
    return -1;
  }
  // A 包 B
  if (an && !bn) {
    return 1;
  }
  // B 包 A
  if (!an && bn) {
    return 2;
  }
}
