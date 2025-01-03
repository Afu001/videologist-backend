const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const app = express();


app.use(cors());

const videoList = [
  { url: '/videos/video1.mp4', title: 'Video 1', hashtags: ['fun', 'cat'] },
  { url: '/videos/video2.mp4', title: 'Video 2', hashtags: ['dog', 'fun'] },
];


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


app.use('/videos', express.static(path.join(__dirname, 'videos')));


app.get('/videos/list', (req, res) => {
  res.json(videoList);
});


app.post('/upload-video', upload.single('video'), (req, res) => {
  const { file } = req;
  const { title, hashtags } = req.body; 

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  
  const newVideo = {
    url: `/videos/${file.filename}`,
    title: title || `Video ${Date.now()}`, 
    hashtags: hashtags ? hashtags.split(',').map((tag) => tag.trim()) : [], // Split hashtags by comma
  };
  videoList.push(newVideo);

  res.send({
    message: 'Video uploaded successfully',
    file,
    video: newVideo, 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
