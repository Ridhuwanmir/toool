const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');
[uploadsDir, processedDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(__dirname));

// Handle video upload and compression
app.post('/compress-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No video file uploaded');
    }

    const inputPath = req.file.path;
    const outputPath = path.join(processedDir, `compressed_${req.file.filename}`);

    ffmpeg(inputPath)
        .videoBitrate('1000k')
        .save(outputPath)
        .on('end', () => {
            // Clean up original file
            fs.unlinkSync(inputPath);
            res.json({ 
                success: true, 
                file: `/processed/compressed_${req.file.filename}`
            });
        })
        .on('error', (err) => {
            console.error('Error:', err);
            res.status(500).send('Error compressing video');
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
