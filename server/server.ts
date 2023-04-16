const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require('cors');

const app = express();
const folderPath = '../data';

async function iterateFolderFiles(folderPath: string) {
  const fileList: string[] = [];
  fs.readdirSync(folderPath).forEach(async (file: any) => {
    try {
      const filePath = path.join(folderPath, file);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      fileList.push(fileContent);
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  });

  return fileList;
}

let contents: string[] = [];

app.use(cors());
app.use(express.json());

app.post('/search', (req: any, res: any) => {
  console.log(req.body);
  const query = req.body.query;
  const rankType = req.body.rankType; // pageRank, HITS, simRank

  const topTenSearches: any[] = [];
  for (const content of contents) {
    const count = [...content.toLowerCase().matchAll(query.toLowerCase())].length;
    if (count > 0) {
      topTenSearches.push({ query, content, count });
    }
  }
  topTenSearches.sort((a, b) => b.count - a.count);
  topTenSearches.splice(10);
  res.send(JSON.stringify({
    results: topTenSearches
  }));
});

iterateFolderFiles(folderPath).then((c) => {
  contents = c;
  app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
  });
});
