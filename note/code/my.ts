/** instanceof **/
function myInstanceof(left, right) {
  const prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left === null || left === undefined) return false;
    if (prototype === left) return true;
    left = left.__proto__;
  }
}

/** new **/

/*
  创建一个空的简单JavaScript对象（即{}）；
  链接该对象（即设置该对象的构造函数）到另一个对象 ；
  将步骤1新创建的对象作为this的上下文 ；
  如果该函数没有返回对象，则返回this。
 */
function myNew1(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
function myNew2(constructor, ...args) {
  const obj: any = {};
  obj.__proto__ = constructor.prototype;
  const result = constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

/* call */
(Function.prototype as any).myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context._fn_ = this;
  const result = context._fn_(...args);
  delete context._fn_;
  return result;
};

/* apply */
(Function.prototype as any).myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context._fn_ = this;
  const result = context._fn_(...args);
  delete context._fn_;
  return result;
};

/* bind */
(Function.prototype as any).myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const _this = this;
  // 返回一个函数
  return function f() {
    // 用 new 调用
    if (this instanceof f) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};

/* promise */

// 三个常量用来表示三种状态
const PENDING = "pending";
const REJECT = "reject";
const RESOLVE = "resolve";

function MyPromise(fn) {
  const that = this;
  // 回调接收的值
  this.value = undefined;
  // 标记状态
  this.status = PENDING;
  // 回调列表
  this.rejectCallBacks = [];
  this.resolveCallBacks = [];

  function resolve(value) {
    if (that.status === PENDING) {
      that.status = RESOLVE;
      that.value = value;
      setTimeout(() => {
        that.resolveCallBacks.forEach((cb) => cb(that.value));
      }, 0);
    }
  }

  function reject(value) {
    if (that.status === PENDING) {
      that.status = REJECT;
      that.value = value;
      setTimeout(() => {
        that.rejectCallBacks.forEach((cb) => cb(that.value));
      }, 0);
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function (resolveCall, rejectCall) {
  // 参数校验,因为参数不是必填的
  resolveCall = typeof resolveCall === "function" ? resolveCall : (v) => v;
  rejectCall =
    typeof rejectCall === "function"
      ? resolveCall
      : (e) => {
          throw e;
        };

  if (this.status === PENDING) {
    this.resolveCallBacks.push(resolveCall);
    this.rejectCallBacks.push(rejectCall);
  }
  if (this.status === RESOLVE) {
    rejectCall(this.value);
  }
  if (this.status === RESOLVE) {
    rejectCall(this.value);
  }
};

/* Promise.all */
function promiseAll(promises: Promise<any>[]) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      reject(new TypeError("参数错误"));
    }
    const len = promises.length;
    const result = new Array(len);
    let n = 0;
    promises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then((v) => {
          result[i] = v;
          if (++n === len) {
            resolve(result);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
}

/* flag */
function myFlag(arr: any[], n?: number) {
  n = n === undefined ? 1 : n;
  return arr.reduce((acc, cur) => {
    if (Array.isArray(cur) && n > 1) {
      acc.concat(myFlag(cur, n - 1));
    } else {
      return acc.concat(cur);
    }
  }, []);
}
