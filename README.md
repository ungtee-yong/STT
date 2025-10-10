# 🎤 Speech to Text Converter

เว็บแอปพลิเคชันสำหรับแปลงเสียงเป็นข้อความโดยใช้ Google Speech API รองรับหลายภาษาและใช้งานง่าย

## ✨ Features

- 🎯 **แปลงเสียงเป็นข้อความ** ด้วย Google Speech API
- 🌍 **รองรับหลายภาษา** รวมถึงภาษาไทย, อังกฤษ, ญี่ปุ่น, เกาหลี, จีน
- 🎨 **UI สวยงาม** และใช้งานง่าย
- 📱 **Responsive Design** รองรับทุกอุปกรณ์
- ⚡ **Real-time Processing** แปลงเสียงแบบเรียลไทม์
- 📋 **คัดลอกข้อความ** ได้ง่ายๆ
- 🔧 **ปรับแต่งได้** ตั้งค่าภาษาและคุณภาพเสียง

## 🚀 Quick Start

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Google API Key

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจ็กต์ใหม่หรือเลือกโปรเจ็กต์ที่มีอยู่
3. เปิดใช้งาน Speech-to-Text API
4. สร้าง Service Account และดาวน์โหลด JSON key file
5. วางไฟล์ JSON key ในโฟลเดอร์โปรเจ็กต์
6. แก้ไข `server.js` บรรทัดที่ 25:

```javascript
keyFilename: 'path/to/your/service-account-key.json'
```

### 3. เริ่มต้นเซิร์ฟเวอร์

```bash
npm start
```

### 4. เปิดเว็บเบราว์เซอร์

ไปที่ `http://localhost:3000`

## 📁 File Structure

```
speech-to-text-converter/
├── index.html          # หน้าเว็บหลัก
├── style.css           # ไฟล์ CSS
├── script.js           # ไฟล์ JavaScript หลัก
├── config.js           # ไฟล์การตั้งค่า
├── server.js           # เซิร์ฟเวอร์ Node.js
├── package.json        # ไฟล์ dependencies
├── README.md           # คู่มือการใช้งาน
└── uploads/            # โฟลเดอร์เก็บไฟล์เสียงชั่วคราว
```

## 🔧 Configuration

### การตั้งค่าภาษา

แก้ไขใน `config.js`:

```javascript
DEFAULT_LANGUAGE: 'th-TH', // เปลี่ยนเป็นภาษาที่ต้องการ
```

### การตั้งค่าคุณภาพเสียง

```javascript
AUDIO: {
    SAMPLE_RATES: [16000, 44100, 48000],
    DEFAULT_SAMPLE_RATE: 16000,
    // ...
}
```

## 🌍 Supported Languages

- 🇹🇭 ไทย (th-TH)
- 🇺🇸 English US (en-US)
- 🇬🇧 English UK (en-GB)
- 🇯🇵 日本語 (ja-JP)
- 🇰🇷 한국어 (ko-KR)
- 🇨🇳 中文 (zh-CN)
- 🇹🇼 中文繁體 (zh-TW)
- 🇫🇷 Français (fr-FR)
- 🇩🇪 Deutsch (de-DE)
- 🇪🇸 Español (es-ES)
- 🇮🇹 Italiano (it-IT)
- 🇧🇷 Português (pt-BR)
- 🇷🇺 Русский (ru-RU)
- 🇸🇦 العربية (ar-SA)

## 🛠️ API Endpoints

### Health Check
```
GET /api/health
```

### Speech to Text
```
POST /api/speech-to-text
Content-Type: multipart/form-data

Parameters:
- audio: Audio file (WAV, MP3, WEBM)
- language: Language code (default: th-TH)
- sampleRate: Sample rate in Hz (default: 16000)
```

### Response Format
```json
{
    "success": true,
    "transcript": "ข้อความที่แปลงจากเสียง",
    "confidence": 0.95,
    "language": "th-TH",
    "processingTime": 1500
}
```

## 🔒 Security Notes

- ⚠️ **อย่าเปิดเผย API Key** ในโค้ดที่ public
- 🔐 ใช้ environment variables สำหรับ production
- 🛡️ ตั้งค่า CORS อย่างเหมาะสม
- 📁 จำกัดขนาดไฟล์ที่อัปโหลด

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย

1. **ไมโครโฟนไม่ทำงาน**
   - ตรวจสอบการอนุญาตในเบราว์เซอร์
   - ใช้ HTTPS สำหรับ production

2. **API Error**
   - ตรวจสอบ API Key และ Service Account
   - ตรวจสอบการเปิดใช้งาน Speech-to-Text API

3. **เสียงไม่ชัด**
   - ปรับ Sample Rate เป็น 44100 หรือ 48000
   - ใช้ไมโครโฟนคุณภาพดี

## 📝 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 🤝 Contributing

1. Fork โปรเจ็กต์
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📞 Support

หากมีปัญหาหรือคำถาม กรุณาเปิด issue ใน GitHub repository

## 🙏 Acknowledgments

- [Google Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text)
- [jQuery](https://jquery.com/)
- [Express.js](https://expressjs.com/)

---

**สร้างด้วย ❤️ สำหรับการแปลงเสียงเป็นข้อความ**