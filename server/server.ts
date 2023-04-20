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
  const rankType = req.body.rankType; // pageRank, hits, simRank

  //Just in case papa goose is sending me some weird values.
  const validRankTypes = ['pageRank', 'hits', 'simRank'];
  if (!validRankTypes.includes(rankType)) {
    return res.status(400).send('Invalid rankType');
  }

  const topTenSearches: any[] = [];
  for (const content of contents) {
    const count = [...content.toLowerCase().matchAll(query.toLowerCase())].length;
    const lines = content.split('\n');
    //adjust accordingly
    const pageRank = parseFloat(lines[1]);
    const simRank = parseFloat(lines[2]);
    const hits = parseFloat(lines[3]);

    if (!isNaN(pageRank) && !isNaN(simRank) && !isNaN(hits)) {
      console.log("All Good");
    } else {
      if (isNaN(pageRank)) console.log("pageRank Died");
      if (isNaN(simRank)) console.log("simRank Died");
      if (isNaN(hits)) console.log("hits Died");
      console.log("Something is wrong");
    }

    if (count > 0) {
      topTenSearches.push({ query, content, count, pageRank, simRank, hits });
    }
  }
  topTenSearches.sort((a, b) => b.count - a.count); //In case there is a tie for pageRank, hits, etc: maybe remove because not worth increase time complex
  if (rankType === 'pageRank') {
    topTenSearches.sort((a, b) => b.pageRank - a.pageRank);
  } else if (rankType === 'hits') {
    topTenSearches.sort((a, b) => b.hits - a.hits);
  } else if (rankType === 'simRank') {
    topTenSearches.sort((a, b) => b.simRank - a.simRank);
  } else {
    return res.status(400).send('Invalid rankType');
  }
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
