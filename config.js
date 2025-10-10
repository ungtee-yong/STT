// Configuration file for Speech to Text Converter
// ไฟล์การตั้งค่าสำหรับแอปแปลงเสียงเป็นข้อความ

const CONFIG = {
    // Google Cloud Speech-to-Text API Configuration
    // การตั้งค่า Google Cloud Speech-to-Text API
    GOOGLE_API: {
        // ใส่ API Key ของคุณที่นี่
        // Replace with your actual API key
        API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
        
        // API endpoint
        API_URL: 'https://speech.googleapis.com/v1/speech:recognize',
        
        // Default language settings
        // การตั้งค่าภาษาเริ่มต้น
        DEFAULT_LANGUAGE: 'th-TH',
        
        // Supported languages
        // ภาษาที่รองรับ
        SUPPORTED_LANGUAGES: [
            { code: 'th-TH', name: 'ไทย' },
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'ja-JP', name: '日本語' },
            { code: 'ko-KR', name: '한국어' },
            { code: 'zh-CN', name: '中文 (简体)' },
            { code: 'zh-TW', name: '中文 (繁體)' },
            { code: 'fr-FR', name: 'Français' },
            { code: 'de-DE', name: 'Deutsch' },
            { code: 'es-ES', name: 'Español' },
            { code: 'it-IT', name: 'Italiano' },
            { code: 'pt-BR', name: 'Português (Brasil)' },
            { code: 'ru-RU', name: 'Русский' },
            { code: 'ar-SA', name: 'العربية' }
        ],
        
        // Audio settings
        // การตั้งค่าเสียง
        AUDIO: {
            SAMPLE_RATES: [16000, 44100, 48000],
            DEFAULT_SAMPLE_RATE: 16000,
            CHANNEL_COUNT: 1,
            ECHO_CANCELLATION: true,
            NOISE_SUPPRESSION: true,
            AUTO_GAIN_CONTROL: true
        }
    },
    
    // UI Configuration
    // การตั้งค่า UI
    UI: {
        // Recording button settings
        // การตั้งค่าปุ่มบันทึก
        RECORD_BUTTON: {
            RECORDING_ANIMATION_DURATION: 1500, // milliseconds
            PULSE_ANIMATION_DURATION: 1000 // milliseconds
        },
        
        // Message display settings
        // การตั้งค่าการแสดงข้อความ
        MESSAGES: {
            AUTO_HIDE_DURATION: 3000, // milliseconds
            SUCCESS_COLOR: '#d4edda',
            ERROR_COLOR: '#f8d7da'
        },
        
        // Text result settings
        // การตั้งค่าผลลัพธ์ข้อความ
        TEXT_RESULT: {
            MAX_LENGTH: 10000, // characters
            PLACEHOLDER_TEXT: 'ข้อความที่แปลงจากเสียงจะแสดงที่นี่...'
        }
    },
    
    // Server Configuration (if using server-side processing)
    // การตั้งค่าเซิร์ฟเวอร์ (หากใช้การประมวลผลฝั่งเซิร์ฟเวอร์)
    SERVER: {
        // API endpoints
        // จุดเชื่อมต่อ API
        ENDPOINTS: {
            SPEECH_TO_TEXT: '/api/speech-to-text',
            HEALTH_CHECK: '/api/health'
        },
        
        // Request settings
        // การตั้งค่าการร้องขอ
        REQUEST: {
            TIMEOUT: 30000, // milliseconds
            MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
        }
    },
    
    // Error messages in Thai
    // ข้อความข้อผิดพลาดเป็นภาษาไทย
    ERROR_MESSAGES: {
        BROWSER_NOT_SUPPORTED: 'เบราว์เซอร์ของคุณไม่รองรับการบันทึกเสียง',
        MICROPHONE_ACCESS_DENIED: 'ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตการใช้งาน',
        SPEECH_RECOGNITION_NOT_SUPPORTED: 'เบราว์เซอร์ของคุณไม่รองรับ Speech Recognition',
        API_CONNECTION_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ API',
        AUDIO_PROCESSING_ERROR: 'เกิดข้อผิดพลาดในการประมวลผลเสียง',
        COPY_TO_CLIPBOARD_ERROR: 'ไม่สามารถคัดลอกข้อความได้',
        UNKNOWN_ERROR: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    },
    
    // Success messages in Thai
    // ข้อความความสำเร็จเป็นภาษาไทย
    SUCCESS_MESSAGES: {
        RECORDING_STARTED: 'เริ่มบันทึกเสียงแล้ว',
        RECORDING_STOPPED: 'หยุดบันทึกเสียงแล้ว',
        TEXT_COPIED: 'คัดลอกข้อความสำเร็จ!',
        TEXT_CLEARED: 'ล้างข้อความแล้ว',
        CONVERSION_SUCCESS: 'แปลงเสียงเป็นข้อความสำเร็จ!'
    }
};

// Export configuration for use in other files
// ส่งออกการตั้งค่าสำหรับใช้ในไฟล์อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}