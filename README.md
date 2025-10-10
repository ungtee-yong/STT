# Microphone Recorder

Node.js application ที่ใช้บันทึกเสียงจากไมโครโฟนและบันทึกเป็นไฟล์ WAV

## การติดตั้ง

```bash
npm install
```

## การใช้งาน

### 1. บันทึกเสียงแบบกำหนดเวลา

```bash
npm start
```

จะบันทึกเสียงเป็นเวลา 10 วินาทีและบันทึกเป็นไฟล์ `recording_[timestamp].wav`

### 2. ใช้งานในโค้ด

```javascript
const MicrophoneRecorder = require('./record');

const recorder = new MicrophoneRecorder({
    rate: 44100,        // Sample rate (Hz)
    channels: 2,        // 1 = mono, 2 = stereo
    debug: false        // Enable debug mode
});

// บันทึกเสียง 30 วินาที
recorder.startRecording('my_recording.wav', 30)
    .then(outputPath => {
        console.log('บันทึกเสร็จสิ้น:', outputPath);
    })
    .catch(error => {
        console.error('เกิดข้อผิดพลาด:', error);
    });
```

### 3. บันทึกเสียงแบบหยุดด้วยตนเอง

```javascript
const recorder = new MicrophoneRecorder();

// เริ่มบันทึก (ไม่มีกำหนดเวลา)
recorder.startRecording('manual_recording.wav');

// หยุดบันทึกด้วยตนเอง
setTimeout(() => {
    recorder.stopRecording();
}, 5000); // หยุดหลังจาก 5 วินาที
```

## ตัวเลือกการตั้งค่า

- `rate`: Sample rate (Hz) - ค่าเริ่มต้น: 16000
- `channels`: จำนวนช่องเสียง (1 = mono, 2 = stereo) - ค่าเริ่มต้น: 1
- `debug`: เปิดโหมด debug - ค่าเริ่มต้น: false
- `exitOnSilence`: หยุดบันทึกเมื่อไม่มีเสียง (วินาที) - ค่าเริ่มต้น: 6

## การทดสอบ

```bash
npm test
```

## ข้อกำหนดระบบ

- Node.js
- ไมโครโฟนที่เชื่อมต่อกับระบบ
- Linux/macOS/Windows

## ตัวอย่างการใช้งานขั้นสูง

```javascript
const MicrophoneRecorder = require('./record');

class AudioRecorder {
    constructor() {
        this.recorder = new MicrophoneRecorder({
            rate: 48000,
            channels: 2,
            debug: true
        });
    }

    async recordWithCallback(duration, callback) {
        const filename = `recording_${Date.now()}.wav`;
        
        // เริ่มบันทึก
        const recordingPromise = this.recorder.startRecording(filename, duration);
        
        // เรียก callback ทุก 1 วินาที
        const interval = setInterval(() => {
            if (this.recorder.getRecordingStatus()) {
                callback('กำลังบันทึก...');
            }
        }, 1000);

        try {
            const result = await recordingPromise;
            clearInterval(interval);
            callback('บันทึกเสร็จสิ้น: ' + result);
            return result;
        } catch (error) {
            clearInterval(interval);
            callback('เกิดข้อผิดพลาด: ' + error.message);
            throw error;
        }
    }
}

// ใช้งาน
const audioRecorder = new AudioRecorder();
audioRecorder.recordWithCallback(10, (message) => {
    console.log(message);
});
```