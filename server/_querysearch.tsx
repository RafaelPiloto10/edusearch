const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const folderPath = 'path.txt';

async function iterateFolderFiles(folderPath: string) {
  const fileList: string[] = [];
  for (const [root, dirs, files] of fs.walkSync(folderPath)) {
    for (const file of files) {
      try {
        const filePath = path.join(root, file);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        fileList.push(fileContent);
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
  }
  return fileList;
}

async function query_search() {
  const contents = await iterateFolderFiles(folderPath);
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json()); 

  app.post('/parse-query', (req, res) => {
    const query = req.body.query;
    const topTenSearches = [];
    for (const content of contents) {
      const count = (content.match(query) || []).length;
      if (count > 0) {
        topTenSearches.push({ query, count });
      }
    }
    topTenSearches.sort((a, b) => b.count - a.count);
    topTenSearches.splice(10);
    res.send(topTenSearches);
  });
}

query_search();
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});








