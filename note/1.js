// 精度小数计算
{
  function add(num1, num2) {
    const len1 = getLen(num1);
    const len2 = getLen(num2);
    const max = Math.max(len1, len2);
    const num = Math.pow(10, max);
    return (num1 * num + num2 * num) / num;
  }

  function getLen(num) {
    const str = num.toString();
    if (str.indexOf(".") > -1) {
      return str.split(".")[1].length;
    } else {
      return 0;
    }
  }
}
// 字符串全排列
{
  function fullPermutation(str) {
    let result = [];
    if (str.length === 0) {
      return [];
    } else if (str.length === 1) {
      return [str];
    } else {
      for (let i = 0; i < str.length; i++) {
        let target = str[i]; // 循环字符串,取出每一个值
        let rest = str.slice(0, i) + str.slice(i + 1, str.length); // 剩下的字符串
        const full = fullPermutation(rest); // 将剩下的字符串进行全排列
        full.forEach((v) => {
          result.push(target + v); // 将本次取出的字符与剩下的字符串全排列的结果进行拼接
        });
      }
    }
    return result;
  }
}
// 数字变化函数
{
  function countUp(options, spitOut) {
    const { duration, startNumber, n } = {
      duration: 1000,
      startNumber: 0,
      ...options,
    };
    if (startNumber >= n) {
      spitOut(n);
      return;
    }
    let N = startNumber;
    const startTime = +new Date();
    requestAnimationFrame(count);

    function count() {
      const now = +new Date();
      if (now - startTime >= duration) {
        spitOut(n);
      } else {
        const progress = (now - startTime) / duration; // 可加缓动效果
        const next = startNumber + Math.floor((n - startNumber) * progress);
        if (next !== N) {
          N = next;
          spitOut(N);
        }
        requestAnimationFrame(count);
      }
    }
  }
}

{
  // 模板渲染函数
  var str = `<div>
               {data.a}
               <span>{data.a}</span>
               <span>{data.b.c}</span>
               <span>{data.b.c}</span>
             </div>`;

  function render(tpl, data) {
    // 补充函数体
    const htmlStr = tpl.replace(/\{.*?\}/g, (a) => {
      a = a.replace(/(\{|\})/g, "");
      a = a.split(".").map((v) => v.trim());
      let value = data;
      a.forEach((v, i) => {
        if (i > 0) {
          value = value[v];
        }
      });
      return value;
    });
  }
}
