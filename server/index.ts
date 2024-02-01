import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
import path from 'path';

const app = express();

// const catalog = '../static/images';

// const upload = multer({dest: catalog});
// const type = upload.array('filedata', 12);

app.use(express.static('../client/dist/'));
app.use(express.json());

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'dist', 'index.html'));
});


app.listen(5000, () => console.log(`Server started at http://localhost:5000/`));