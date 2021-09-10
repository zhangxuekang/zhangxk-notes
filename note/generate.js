const fs = require("fs");
const chalk = require("chalk");
const log = (content) => {
  console.log(chalk.green(content));
};

//要遍历的文件夹所在的路径
const path_summary = "note/a-summary.md";
try {
  fs.writeFileSync(path_summary, "# 学习笔记\n\n");
} catch (error) {}
const path = "note/code/";
const path_g = "note/code-g/";
const link_g = "code-g/";

const fileList = fs.readdirSync(path);
fileList.forEach((name, i) => {
  const data = fs.readFileSync(path + name, "utf8");

  const content = generateTitles(data);
  const fileNmae = name.replace(/\.ts$/, "");
  const name_p = path_g + fileNmae + ".md";
  const linkName_p = link_g + fileNmae + ".md";
  try {
    fs.unlinkSync(name_p);
  } catch (error) {}
  fs.writeFileSync(name_p, content);
  log("create: " + name_p);
  const linkName = "- [" + fileNmae + "](" + linkName_p + ")\n";
  fs.appendFileSync(path_summary, linkName);
  if (i === fileList.length - 1) {
    console.log("");
  }
});

function generateTitles(content, type = "ts") {
  const reg = /(\/\*\*\s.*?\s\*\*\/)(.*?)(\/\*\*\s.*?\s\*\*\/)/g;
  console.log(1, "---38--mark2021");
  return content.replace(reg, (match, p1, p2, p3) => {
    console.log("```" + type + "\n" + p2 + "\n```", "---39--mark2021");
    return "```" + type + "\n" + p2 + "\n```";
  });
}
