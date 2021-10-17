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
    }
    return result;
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
    return l1;
  }
}

/** 反转链表 **/
// 递归
function reverseList(head) {
  if (head === null || head.next === null) {
    return head;
  }
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}

// 循环
function reverseList2(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
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

/** 乘积最大子数组 **/
function maxProduct(nums) {
  let maxf = nums[0]; // 维护一个最大乘积
  let minf = nums[0]; // 维护一个最小乘积
  let res = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const mx = maxf;
    const mn = minf;
    const n = nums[i];
    maxf = Math.max(mx * n, Math.max(n, n * mn)); // 最小乘下一个可能就成了最大，因为负负得正
    minf = Math.min(mn * n, Math.min(n, n * mx)); // 计算这个最小乘积，需要考虑用最大乘下一个数，因为负正得负
    res = Math.max(res, maxf);
  }
  return res;
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

/** 只出现过一次的数字 **/

/* 除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。 */
/*
a^a=0；自己和自己异或等于0
a^0=a；任何数字和0异或还等于他自己
a^b^c=a^c^b；异或运算具有交换律
*/

function singleNumber(nums: number[]) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result ^= nums[i];
  }
  return result;
}

/** 搜索二维矩阵 **/

/*
搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：

每行的元素从左到右升序排列。
每列的元素从上到下升序排列。
*/

/* 该二维数组类似于一棵排序二叉树，对于每个数来说，上方的数都小于它，右方的数都大于它，所以把左下角作为根节点开始比较 */
function searchMatrix(matrix: number[][], target: number) {
  const n = matrix[0].length;
  let row = matrix.length - 1;
  let col = 0;
  while (row >= 0 && col <= n - 1) {
    const t = matrix[row][col];
    if (t === target) {
      return true;
    }
    if (t > target) {
      row--;
    }
    if (t < target) {
      col++;
    }
  }
  return false;
}

/** 合并两个有序数组 **/

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  const temp = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    const n1 = nums1[i];
    const n2 = nums2[j];
    if (n1 <= n2) {
      temp.push(n1);
      i++;
    } else {
      temp.push(n2);
      j++;
    }
  }
  while (i < m) {
    temp.push(nums1[i]);
    i++;
  }
  while (j < n) {
    temp.push(nums2[j]);
    j++;
  }
  temp.forEach((v, i) => {
    nums1[i] = v;
  });
}

/** 二维数组【顺序】排列组合 **/

/* 给定任意二维数组，输出所有的排列组合项。
比如 [['A','B'], ['a','b'], [1, 2]]，输出 ['Aa1','Aa2','Ab1','Ab2','Ba1','Ba2','Bb1’,'Bb2’]
PS: 其中二维数组的长度和二维数组中任意一维数组的长度都是不固定的。 */

function fn(data) {
  const result = [];
  const one = data[0];
  for (let i = 0; i < one.length; i++) {
    help(one[i].toString(), 1);
  }
  function help(path, n) {
    if (data[n]) {
      const target = data[n];
      for (let i = 0; i < target.length; i++) {
        help(path + target[i].toString(), n + 1);
      }
    } else {
      result.push(path);
    }
  }
  return result;
}

fn([
  ["A", "B"],
  ["a", "b"],
  [1, 2],
]);

/** 加起来和为目标值的所有组合 **/
function combinationSum(arr, target) {
  const result = [];
  arr = arr.sort((a, b) => a - b);
  const map = new Map();
  function dfs(target, combine, idx) {
    if (target === 0) {
      // 去重
      const combineStr = combine.join();
      if (!map.has(combineStr)) {
        result.push(combine);
        map.set(combineStr, 1);
      }
      return;
    }
    if (idx === arr.length) {
      return;
    }
    // 直接跳过当前的数字
    dfs(target, [...combine], idx + 1);
    // 使用当前数字
    if (target - arr[idx] >= 0) {
      dfs(target - arr[idx], [...combine, arr[idx]], idx + 1);
    }
  }
  dfs(target, [], 0);
  return result;
}

/** 判断链表是否有环 **/

// 快慢指针
function hasCycle(head): boolean {
  if (!head) return false;

  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow === fast) return true;
  }
  return false;
}

// hashMap
function hasCycle2(head): boolean {
  if (!head || !head.next) return false;

  const set = new Set();
  while (head) {
    if (set.has(head)) {
      return true;
    }
    set.add(head);
    head = head.next;
  }
  return false;
}

/** 二叉树的最近公共祖先 **/
// 递归
function lowestCommonAncestor(root, p, q) {
  if (root == null || root == p || root == q) {
    return root;
  }
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (!left && !right) return null;
  if (!left) return right;
  if (!right) return left;
  return root;
}

// hashmap
function lowestCommonAncestor2(root, p, q) {
  const map = new Map();
  function dfs(root) {
    if (root.left) {
      map.set(root.left.value, root);
      dfs(root.left);
    }
    if (root.right) {
      map.set(root.right.value, root);
      dfs(root.right);
    }
  }
  dfs(root);
  const set = new Set();
  while (p) {
    set.add(p);
    p = map.get(p.value);
  }
  while (q) {
    if (set.has(q)) {
      return q;
    }
    q = map.get(q.value);
  }
  return null;
}

/** 四数相加 II **/

/*
四个整数数组 nums1、nums2、nums3 和 nums4 ，数组长度都是 n ，计算有多少个元组 (i, j, k, l) 能满足：
0 <= i, j, k, l < n
nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0
*/
function fourSumCount(nums1, nums2, nums3, nums4) {
  let n = 0;
  const map = new Map();
  nums1.forEach((v1, i1) => {
    nums2.forEach((v2, i2) => {
      map.set(v1 + v2, (map.get(v1 + v2) || 0) + 1);
    });
  });

  nums3.forEach((v3, i3) => {
    nums4.forEach((v4, i4) => {
      if (map.has(-v3 - v4)) {
        n += map.get(-v3 - v4);
      }
    });
  });
  return n;
}
