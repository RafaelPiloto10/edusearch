const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require('cors');

const app = express();


const folderPath = '../data';
const fileSim = '../methods/simrank/simrank.csv';
const filePage = '../outpagerank.csv';
const fileHITS = '../outhits.csv';

async function iterateFolderFiles(folderPath: string, fileSim: string, filePage: string, fileHITS: string) {
  const MainHash: Record<string, string> = {};
  const linkList: string[] = [];
  fs.readdirSync(folderPath).forEach(async (file: any) => {
    try {
      const filePath = path.join(folderPath, file);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      const link = lines[0];
      MainHash[link] = fileContent;
      linkList.push(link);

    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  });

  const PageRankHash: Record<string, number> = {};
  const data = await fs.readFileSync(filePage, 'utf-8');
  const rows = data.trim().split('\n');
  rows.forEach(async (row: string) => {
    const [vertex, rank] = row.split(',');
    PageRankHash[vertex] = parseFloat(rank);
  });

  const SimRankHash: Record<string, number> = {};
  const data2 = await fs.readFileSync(fileSim, 'utf-8');
  const rowss = data2.trim().split('\n');
  rowss.forEach(async(row: string) => {
    const [vertex, rank] = row.split(',');
    SimRankHash[vertex] = parseFloat(rank);
  });

  const HITSHash: Record<string, number> = {};
  const data3 = await fs.readFileSync(fileHITS, 'utf-8');
  const rowsss = data3.trim().split('\n');
  rowsss.forEach(async(row: string) => {
    const [vertex, rank] = row.split(',');
    HITSHash[vertex] = parseFloat(rank);
  });

  return { mh: MainHash, ph: PageRankHash, sh: SimRankHash, hh: HITSHash, l:linkList};
}

let linkList: string[] = [];
let mainhashing: { [key: string]: any } = {};
let pagehasing: { [key: string]: any } = {};
let simhasing: { [key: string]: any } = {};
let hithasing: { [key: string]: any } = {};

app.use(cors());
app.use(express.json());

app.post('/search', (req: any, res: any) => {
  console.log(req.body);
  const query = req.body.query;
  const rankType = req.body.rankType;

  const validRankTypes = ['pageRank', 'hits', 'simRank'];
  if (!validRankTypes.includes(rankType)) {
    return res.status(400).send('Invalid rankType');
  }

  const topTenSearches: any[] = [];
  for (const content of linkList) {
    const count = [...content.toLowerCase().matchAll(query.toLowerCase())].length;
    if (count > 0) {
      topTenSearches.push({ query, content: mainhashing[content], count, pageRank: pagehasing[content], simRank: simhasing[content], hits: hithasing[content] });
    }
  }

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

async function startServer() {
  await iterateFolderFiles(folderPath, fileSim, filePage, fileHITS).then(({ mh, ph, sh, hh, l }) => {
    mainhashing = mh;
    pagehasing = ph;
    simhasing = sh;
    hithasing = hh;
    linkList = l;

    app.listen(process.env.PORT || 8000, () => {
      console.log('Server is running on port 8000');
    });
  });
}
startServer();
