/**
 * 将 md 文件转化为 html 文件
 */
const marked = require("marked");

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const hljs = require("highlight.js");
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

function md2html(data) {
  return marked(data);
}

module.exports = md2html;
