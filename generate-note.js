const fs = require("fs");
const chalk = require("chalk");
const log = (content) => {
  console.log(chalk.green(content));
};

// 新建目录文件
const path_summary = "src/note/code-g/a-summary.md";
try {
  fs.writeFileSync(path_summary, "# CODE\n\n");
} catch (error) {}

const path = "src/note/code/";
const path_g = "src/note/code-g/";

//要遍历的文件夹所在的路径
const fileList = fs.readdirSync(path);
fileList.forEach((name, i) => {
  // 读取内容
  const data = fs.readFileSync(path + name, "utf8");

  // 获取文件名和文件类型
  const nameList = name.split(".");
  const fileNmae = nameList.slice(0, nameList.length - 1).join(".");
  const fileType = nameList[nameList.length - 1];

  // 获取转化成 md 格式的内容
  const content = generateTitles(data, fileType);

  // md 文件路径和名称
  const name_p = path_g + fileNmae + ".md";

  // 删除旧文件
  try {
    fs.unlinkSync(name_p);
  } catch (error) {}

  // 写新的内容
  fs.writeFileSync(name_p, content);
  log("create: " + name_p);

  // 写入目录链接
  const linkName_p = fileNmae + ".md";
  const linkName = "- [" + fileNmae + "](" + linkName_p + ")\n";
  fs.appendFileSync(path_summary, linkName);

  if (i === fileList.length - 1) {
    console.log("");
  }
});

/* 转化内容 */
function generateTitles(content, type = "ts") {
  const reg = /(\/\*\*\s.*?\s\*\*\/)((?:.|\n)*?)(?=\/\*\*\s.*?\s\*\*\/|$)/g;
  return content.replace(reg, (match, p1, p2) => {
    const title = "## " + p1.replace(/(\/\*\*\s)|(\s\*\*\/)/g, "") + "\n";
    return title + "\n```" + type + p2 + "```\n";
  });
}
