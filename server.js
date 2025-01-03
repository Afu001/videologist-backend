const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialize the app
const app = express();

// Use middleware
app.use(cors());

// In-memory storage for video metadata
const videoList = [
  { url: '/videos/video1.mp4', title: 'Video 1', hashtags: ['fun', 'cat'] },
  { url: '/videos/video2.mp4', title: 'Video 2', hashtags: ['dog', 'fun'] },
];

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve static files from the "videos" directory
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Route to return video list
app.get('/videos/list', (req, res) => {
  res.json(videoList);
});

// Upload video route for admin
app.post('/upload-video', upload.single('video'), (req, res) => {
  const { file } = req;
  const { title, hashtags } = req.body; // Assuming title and hashtags are sent in the request body

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Add the uploaded video metadata to the in-memory list
  const newVideo = {
    url: `/videos/${file.filename}`,
    title: title || `Video ${Date.now()}`, // Fallback title
    hashtags: hashtags ? hashtags.split(',').map((tag) => tag.trim()) : [], // Split hashtags by comma
  };
  videoList.push(newVideo);

  res.send({
    message: 'Video uploaded successfully',
    file,
    video: newVideo, // Send back the new video details
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
