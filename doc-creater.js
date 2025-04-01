const fs = require('fs');
const path = require('path');
const marked = require('markdown-it');
const markdownItMermaid = require('markdown-it-mermaid').default;

// markdown-itのインスタンスを作成し、mermaidプラグインを使用
const md = marked();
md.use(markdownItMermaid);


const inputDir = path.join(__dirname, 'doc_base');
const outputDir = path.join(__dirname, 'doc');
const ignores = [
  path.join(__dirname, 'doc_base/sub/subsub/mermaid.md'),
];


async function processMarkdownFiles(inputDir, outputDir, ignores) {
  console.log(inputDir);
  const items = fs.readdirSync(inputDir);

  for (const item of items) {
    const fullPath = path.join(inputDir, item);
    const stat = fs.statSync(fullPath);

    // ディレクトリの場合は再帰的に処理
    if (stat.isDirectory()) {
      const newOutputDir = path.join(outputDir, item);
      if (!fs.existsSync(path)) {
        fs.mkdirSync(newOutputDir, { recursive: true });  // 出力ディレクトリがない場合は作成
      }
      await processMarkdownFiles(fullPath, newOutputDir, ignores);
    }
    // .md ファイルの場合、HTML に変換して保存
    else if (stat.isFile() && ignores && !ignores.includes(fullPath)) {
      if (path.extname(item) === '.md') {
        const content = fs.readFileSync(fullPath, 'utf8');
        const htmlContent = md.render(content);

        // .md を .html に変更して出力ファイルのパスを作成
        const outputFilePath = path.join(outputDir, path.basename(item, '.md') + '.html');
        fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
        console.log(`Converted: ${fullPath} -> ${outputFilePath}`);
      } else {
        // .md 以外はコピーのみ
        const outputFilePath = path.join(outputDir, path.basename(item));
        fs.copyFileSync(fullPath, outputFilePath)
      }
    }
  }
}

// メイン処理
(async () => {
  try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      await processMarkdownFiles(inputDir, outputDir, ignores);
      console.log('Markdown files have been converted successfully!');
  } catch (err) {
      console.error('Error processing files:', err);
  }
})();

// // 入力するMarkdownファイル
// const inputFilePath = './doc_base/index.md'; // 変換するMarkdownファイル
// const outputFilePath = './doc/index.html'; // 出力するHTMLファイル

// // Markdownファイルを読み込んで変換
// fs.readFile(inputFilePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }

//   // MarkdownをHTMLに変換
//   const htmlContent = md.render(data);

//   // HTMLとして保存
//   fs.writeFile(outputFilePath, htmlContent, (err) => {
//     if (err) {
//       console.error('Error writing HTML file:', err);
//       return;
//     }
//     console.log(`Converted ${inputFilePath} to ${outputFilePath}`);
//   });
// });
