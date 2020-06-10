const path = require("path");
const JSDOM = require("jsdom").JSDOM;
const fs = require("fs");

const rootPath = path.resolve(__dirname, "build");
const destPath = path.resolve(__dirname, "dest");
const htmlFile = path.resolve(rootPath, "index.html");
const htmlContent = fs.readFileSync(htmlFile, "utf-8");
const parsedHtml = new JSDOM(htmlContent);
const styles = parsedHtml.window.document.querySelectorAll(
  "link[rel=stylesheet]"
);
const scripts = parsedHtml.window.document.querySelectorAll("script");
let stylesContent = "";
let scriptsContent = "";

styles.forEach(tag => {
  const href = tag.getAttribute("href");
  const filePath = path.resolve(rootPath, ...href.split("/"));
  const fileContent = fs.readFileSync(filePath, "utf-8");
  stylesContent += fileContent;
});

scripts.forEach(tag => {
  const src = tag.getAttribute("src");
  if (src) {
    const filePath = path.resolve(rootPath, ...src.split("/"));
    const fileContent = fs.readFileSync(filePath, "utf-8");
    scriptsContent += fileContent;
  }
});

if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, 0744);
}

fs.writeFileSync(path.resolve(destPath, "bw-pf.css"), stylesContent, "utf-8");
fs.writeFileSync(path.resolve(destPath, "bw-pf.js"), scriptsContent, "utf-8");
