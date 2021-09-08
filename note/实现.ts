/* instanceof */
function myInstanceof(left, right) {
  const prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left === null || left === undefined) return false;
    if (prototype === left) return true;
    left = left.__proto__;
  }
}

/*
  new
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
