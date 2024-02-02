import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();

const catalog = '../../static/models';

const upload = multer({dest: catalog});
// const type = upload.array('filedata', 2);
const type = upload.fields([{name: 'model', maxCount: 1}, {name: 'preview', maxCount: 1}]);

app.use(express.static('../client/dist/'));
app.use(express.json());

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'dist', 'index.html'));
});

app.post('/upload', type, (req, res) => {
	// console.log('files', req.files);
  // const files = req.files as Express.Multer.File;
  const files = req.files as unknown as { [fieldname: string]: Express.Multer.File[]; };
  const name = req.body.name as string;

  let srcArr = [];

  const model = files.model[0];
  const preview = files.preview[0];

  const tmpModelPath = model.path;
  const targetModelPath = path.join(model.destination, `${name}.${model.originalname.split('.')[1]}`);
  const srcModel = fs.createReadStream(tmpModelPath);
  const destModel = fs.createWriteStream(targetModelPath);

  srcModel.pipe(destModel);
  srcArr.push({src: srcModel, tmpPath: tmpModelPath});

  const tmpPreviewPath = preview.path;
  const targetPreviewPath = path.join(preview.destination, preview.originalname);
  const srcPreview = fs.createReadStream(tmpPreviewPath);
  const destPreview = fs.createWriteStream(targetPreviewPath);

  srcPreview.pipe(destPreview);
  srcArr.push({src: srcPreview, tmpPath: tmpPreviewPath});

  for (const s of srcArr) {
    s.src.on('end', function() {
      fs.unlink(s.tmpPath, (err) => {
      if (err) throw err;
      });  
    });
  }

	res.end();  
});

app.listen(5000, () => console.log(`Server started at http://localhost:5000/`));