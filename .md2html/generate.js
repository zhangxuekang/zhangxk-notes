/**
 * 整理目录,产出文档.  md 转 html 文件
 */
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const md2html = require("./md2html");
const minify = require("html-minifier").minify;

// 取出模板
let template = fs.readFileSync(
  path.join(__dirname, "../src/index.html"),
  "utf8"
);
const style = fs.readFileSync(path.join(__dirname, "../src/index.css"), "utf8");
template = template.replace(/<style>\s*?<\/style>/, `<style>${style}</style>`);

// 目录配置表
const routes = ["../src/blogs/", "../src/note/", "../src/demo/"];
routes.forEach((route) => {
  const deepRoutes = deepDir(route);
  generateDeepPath(deepRoutes);
});

// 生成入口文件
const indexData = fs.readFileSync(path.join(__dirname, "../MAIN.md"), "utf8");
const indexHtml = md2html(indexData);
fs.writeFileSync(
  path.join(__dirname, "../index.html"),
  mini(
    template.replace(
      /\$\{body\}/,
      indexHtml
        .replace(/<a href="src\//g, '<a href="src/public/')
        .replace(/\.md">/g, '.html">')
    )
  )
);
log("生成文件: index.html");

/* 递归生成新目录 */
function generateDeepPath(deepRoutes) {
  deepRoutes.forEach((deepRoute) => {
    const { name, child } = deepRoute;
    if (/\.md$/.test(name)) {
      const namePath = path.join(__dirname, name);
      const isFile = fs.statSync(namePath).isFile();
      if (isFile) {
        // 读取 md 文件内容，顺手将资源连接地址改了
        const data = fs
          .readFileSync(namePath, "utf8")
          .replace(
            /\!\[(.*?)\]\(.*?\/assets\/(.*?)\)/g,
            "![$1](https://zhangxuekang.com/src/assets/$2)"
          );
        const html = md2html(data);
        const newName = transformPath(namePath).replace(/\.md$/, ".html");
        if (!fs.existsSync(newName)) {
          mkdir(newName);
        }
        fs.writeFileSync(
          newName,
          mini(
            template.replace(/\$\{body\}/, html.replace(/\.md">/g, '.html">'))
          )
        );
        log("生成文件: " + newName);
      }
    }
    if (child.length) {
      generateDeepPath(child);
    }
  });
}

function transformPath(route) {
  return route.replace("zhangxk-notes/src", "zhangxk-notes/src/public");
}

/* 获取目录树 */
function deepDir(d) {
  const result = [];
  function help(dir, list) {
    const arr = fs.readdirSync(path.join(__dirname, dir));
    arr.forEach((item) => {
      const child = [];
      list.push({ name: dir + item, child });
      const itemPath = path.join(__dirname, dir + item);
      const isDir = fs.statSync(itemPath).isDirectory();
      if (isDir) {
        const temp = dir + item + "/";
        help(temp, child);
      }
    });
  }
  help(d, result);

  return result;
}

/* 新建文件 */
function mkdir(filePath) {
  const arr = filePath
    .split("/")
    .slice(0, filePath.split("/").length - 1)
    .filter((v) => !!v);

  let dir = "/" + arr[0];
  for (let i = 1; i < arr.length; i++) {
    dir = dir + "/" + arr[i];
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
}

/* 输出日志 */
function log(content) {
  console.log(chalk.green(content));
}

/* 压缩内容 */
function mini(data) {
  return minify(data, {
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true,
  });
}
