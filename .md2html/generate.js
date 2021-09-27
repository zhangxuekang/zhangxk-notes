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
// 获取文章信息
const indexPageInfo = getPageInfo(indexData);
const indexHtml = md2html(indexData);
fs.writeFileSync(
  path.join(__dirname, "../index.html"),
  mini(
    transforAnchor(
      template,
      indexHtml
        .replace(/<a href="src\//g, '<a href="src/public/')
        .replace(/\.md">/g, '.html">'),
      indexPageInfo
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
        // 读取 md 文件内容
        const mdData = fs.readFileSync(namePath, "utf8");
        // 获取文章信息
        const pageInfo = getPageInfo(mdData);
        // 删除 md 文章信息数据
        const mdDataRemoveInfo = mdData.replace(/^---[\s\S]*?---\n/, "");
        // 替换链接
        const mdDataRemoveInfoReplaceUrl = mdDataRemoveInfo
          .replace(
            /\!\[(.*?)\]\(.*?\/assets\/(.*?)\)/g,
            "![$1](https://zhangxuekang.com/src/assets/$2)"
          )
          .replace(/\.md">/g, '.html">');
        const html = md2html(mdDataRemoveInfoReplaceUrl);
        const newName = transformPath(namePath).replace(/\.md$/, ".html");
        if (!fs.existsSync(newName)) {
          mkdir(newName);
        }
        fs.writeFileSync(
          newName,
          mini(transforAnchor(template, html, pageInfo))
        );
        log("生成文件: " + newName);
      }
    }
    if (child.length) {
      generateDeepPath(child);
    }
  });
}

function transforAnchor(template, html, pageInfo) {
  return template
    .replace(/\$\{BODY\}/g, html)
    .replace(/\$\{TITLE\}/g, pageInfo.title || "zhangxk-notes")
    .replace(/\$\{DATE\}/g, pageInfo.date ? "发布于 " + pageInfo.date : "")
    .replace(/\$\{UPDATE_TIME\}/g, "更新于 " + getNow())
    .replace(
      /\$\{TAGS\}/g,
      pageInfo.tags
        ? pageInfo.tags
            .map((tag) => {
              return `<span>${tag}</span>`;
            })
            .reduce((acc, v) => acc + v, "")
        : ""
    )
    .replace(
      /\$\{KEYWORDS\}/g,
      pageInfo.tags
        ? pageInfo.tags.concat("zhangxuekang", "zhangxk").join(",")
        : "zhangxuekang,zhangxk"
    );
}

function getNow() {
  const now = new Date();
  const year = now.getFullYear();
  const mouth = now.getMonth() + 1;
  const date = now.getDate();

  return `${year}-${mouth < 10 ? "0" + mouth : mouth}-${
    date < 10 ? "0" + date : date
  }`;
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

/* 获取文章信息 */
function getPageInfo(data) {
  const info = {
    title: null,
    date: null,
    categories: null,
    tags: null,
    header_image: null,
  };
  let infoStr = "";
  const matchStr = data.match(/^---[\s\S]*?---\n/);
  if (matchStr) {
    infoStr = matchStr[0];
  }
  let r = null;
  let match = null;

  Object.keys(info).forEach((key) => {
    switch (key) {
      case "categories":
      case "tags":
        r = new RegExp(`${key}:([\\s\\S]*?)(?=(\\n\\w+:)|(\\n---\\n))`);
        match = infoStr.match(r);
        if (match) {
          info[key] = match[1]
            .split("-")
            .map((v) => v.trim())
            .filter((v) => v);
        }
        break;
      default:
        r = new RegExp(`${key}:(.*?)\\n`);
        match = infoStr.match(r);
        if (match) {
          info[key] = match[1].trim();
        }
    }
  });
  return info;
}
