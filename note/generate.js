console.log("\n----------------\n");
var fs = require("fs");

//要遍历的文件夹所在的路径
const path_summary = "note/a-summary.md";
try {
  fs.writeFileSync(path_summary, "# 学习笔记\n\n");
} catch (error) {}
const path = "note/code/";
const path_g = "note/code-g/";

const fileList = fs.readdirSync(path);

fileList.forEach((name) => {
  fs.readFile(path + name, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const content = "```ts\n" + data + "\n```";
    const fileNmae = name.replace(/\.ts$/, "");
    const name_p = path_g + fileNmae + ".md";
    try {
      fs.unlinkSync(name_p);
    } catch (error) {}
    fs.writeFile(name_p, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("create: " + name_p);
      const linkName = "- [" + fileNmae + "](" + name_p + ")\n";
      fs.appendFile(path_summary, linkName, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  });
});

console.log("\n----------------\n");
