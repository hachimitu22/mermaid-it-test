const markdownIt = require('markdown-it');
const markdownItMermaid = require('markdown-it-mermaid').default;

// markdown-itのインスタンスを作成し、mermaidプラグインを使用
const mdi = markdownIt().use(markdownItMermaid)
const text = mdi.render(`\`\`\`mermaid
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]
\`\`\``)
console.log(text)
