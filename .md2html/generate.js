const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const md2html = require("./md2html");
const log = (content) => {
  console.log(chalk.green(content));
};
const template = fs.readFileSync(
  path.join(__dirname, "../src/index.html"),
  "utf8"
);
// 目录配置表
const routes = ["../src/blogs/", "../src/note/"];
routes.forEach((route) => {
  const deepRoutes = deepDir(route);
  generateDeepPath(deepRoutes);
});

function generateDeepPath(deepRoutes) {
  deepRoutes.forEach((deepRoute) => {
    const { name, child } = deepRoute;
    if (/\.md$/.test(name)) {
      const namePath = path.join(__dirname, name);
      const isFile = fs.statSync(namePath).isFile();
      if (isFile) {
        const data = fs.readFileSync(namePath, "utf8");
        const html = md2html(data);
        const newName = transformPath(namePath).replace(/\.md$/, ".html");
        if (!fs.existsSync(newName)) {
          mkdir(newName);
        }
        fs.writeFileSync(newName, template.replace(/\$\{body\}/, html));
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
