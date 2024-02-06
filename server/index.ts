import express from 'express';
import multer from 'multer';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const app = express();
const catalog = '../../static/models';

type ModelProps = {
  model: string;
  preview: string;
}

let data: ModelProps[] = [];

fsPromises.readFile(`${catalog}/data.json`, {encoding: 'utf8'})
  .then((res) => {
    const storeData = JSON.parse(res) as ModelProps[];
    data = storeData;
  });

const upload = multer({dest: catalog});
const type = upload.fields([{name: 'model', maxCount: 1}, {name: 'preview', maxCount: 1}]);

app.use(express.static('../client/dist/'));
app.use(express.json());

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'dist', 'index.html'));
});

app.post('/upload', type, (req, res) => {
	
  const files = req.files as unknown as { [fieldname: string]: Express.Multer.File[]; };
  const name = req.body.name as string;

  let srcArr = [];

  const model = files.model[0];
  const preview = files.preview[0];

  const modelName = `${name}.${model.originalname.split('.')[1]}`;
  const previewName = preview.originalname;
  
  const tmpModelPath = model.path;
  const targetModelPath = path.join(model.destination, modelName);
  const srcModel = fs.createReadStream(tmpModelPath);
  const destModel = fs.createWriteStream(targetModelPath);

  srcModel.pipe(destModel);
  srcArr.push({src: srcModel, tmpPath: tmpModelPath});

  const tmpPreviewPath = preview.path;
  const targetPreviewPath = path.join(preview.destination, previewName);
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

  data.push({
    model: modelName,
    preview: previewName,
  });

  fsPromises.writeFile(`${catalog}/data.json`, JSON.stringify(data, null, 2))
    .then(() => console.log('Submited model'))
    .catch(() => console.log('Failed to write updated data to file'));
  
	res.end();  
});

app.listen(5000, () => console.log(`Server started at http://localhost:5000/`));