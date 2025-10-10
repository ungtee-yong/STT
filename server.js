// Simple Node.js server for Speech to Text Converter
// เซิร์ฟเวอร์ Node.js ง่ายๆ สำหรับแอปแปลงเสียงเป็นข้อความ

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { SpeechClient } = require('@google-cloud/speech');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Initialize Google Speech Client
// เริ่มต้น Google Speech Client
const speechClient = new SpeechClient({
    keyFilename: 'path/to/your/service-account-key.json', // เปลี่ยนเป็น path ของ service account key
    // หรือใช้ environment variable
    // projectId: 'your-project-id'
});

// Routes
// เส้นทาง API

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Speech to Text API is running',
        timestamp: new Date().toISOString()
    });
});

// Speech to text endpoint
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No audio file provided' 
            });
        }

        const { language = 'th-TH', sampleRate = 16000 } = req.body;
        
        // Read the audio file
        const audioBytes = fs.readFileSync(req.file.path).toString('base64');

        // Configure the request
        const request = {
            audio: {
                content: audioBytes,
            },
            config: {
                encoding: 'WEBM_OPUS', // or 'LINEAR16' for WAV files
                sampleRateHertz: parseInt(sampleRate),
                languageCode: language,
                enableAutomaticPunctuation: true,
                enableWordTimeOffsets: true,
                model: 'latest_long' // Use the latest model for better accuracy
            },
        };

        // Perform the transcription
        const [response] = await speechClient.recognize(request);
        
        // Extract the transcript
        const transcript = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        // Return the result
        res.json({
            success: true,
            transcript: transcript,
            confidence: response.results[0]?.alternatives[0]?.confidence || 0,
            language: language,
            processingTime: Date.now() - req.startTime
        });

    } catch (error) {
        console.error('Speech recognition error:', error);
        
        // Clean up the uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: 'Speech recognition failed',
            message: error.message
        });
    }
});

// Alternative endpoint using streaming recognition for real-time processing
app.post('/api/speech-to-text-stream', (req, res) => {
    const recognizeStream = speechClient
        .streamingRecognize({
            config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 16000,
                languageCode: req.body.language || 'th-TH',
                enableAutomaticPunctuation: true,
            },
            interimResults: true,
        })
        .on('error', (error) => {
            console.error('Streaming recognition error:', error);
            res.status(500).json({ error: 'Streaming recognition failed' });
        })
        .on('data', (data) => {
            if (data.results[0] && data.results[0].alternatives[0]) {
                res.write(JSON.stringify({
                    transcript: data.results[0].alternatives[0].transcript,
                    isFinal: data.results[0].isFinal,
                    confidence: data.results[0].alternatives[0].confidence
                }) + '\n');
            }
        })
        .on('end', () => {
            res.end();
        });

    req.pipe(recognizeStream);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Speech to Text Server is running on port ${PORT}`);
    console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
    console.log(`🔧 API Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});