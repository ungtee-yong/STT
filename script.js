$(document).ready(function() {
    // Configuration
    const config = {
        apiKey: 'YOUR_GOOGLE_API_KEY', // เปลี่ยนเป็น API Key ของคุณ
        apiUrl: 'https://speech.googleapis.com/v1/speech:recognize',
        sampleRate: 16000,
        language: 'th-TH'
    };

    // DOM Elements
    const $recordBtn = $('#recordBtn');
    const $recordingStatus = $('#recordingStatus');
    const $statusIndicator = $('.status-indicator');
    const $statusText = $('.status-text');
    const $textResult = $('#textResult');
    const $copyBtn = $('#copyBtn');
    const $clearBtn = $('#clearBtn');
    const $languageSelect = $('#languageSelect');
    const $sampleRateSelect = $('#sampleRate');

    // State
    let isRecording = false;
    let mediaRecorder = null;
    let audioChunks = [];
    let recognition = null;

    // Initialize
    init();

    function init() {
        // Check browser support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showError('เบราว์เซอร์ของคุณไม่รองรับการบันทึกเสียง');
            return;
        }

        // Setup event listeners
        setupEventListeners();
        
        // Initialize speech recognition
        initSpeechRecognition();
    }

    function setupEventListeners() {
        $recordBtn.on('click', toggleRecording);
        $copyBtn.on('click', copyText);
        $clearBtn.on('click', clearText);
        $languageSelect.on('change', updateLanguage);
        $sampleRateSelect.on('change', updateSampleRate);
    }

    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        } else {
            showError('เบราว์เซอร์ของคุณไม่รองรับ Speech Recognition');
            return;
        }

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = config.language;

        recognition.onstart = function() {
            updateRecordingStatus(true);
        };

        recognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                displayResult(finalTranscript);
            } else if (interimTranscript) {
                displayInterimResult(interimTranscript);
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            showError('เกิดข้อผิดพลาดในการจดจำเสียง: ' + event.error);
            updateRecordingStatus(false);
        };

        recognition.onend = function() {
            updateRecordingStatus(false);
        };
    }

    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function startRecording() {
        if (recognition) {
            try {
                recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                showError('ไม่สามารถเริ่มการจดจำเสียงได้');
            }
        } else {
            showError('Speech Recognition ไม่พร้อมใช้งาน');
        }
    }

    function stopRecording() {
        if (recognition) {
            recognition.stop();
        }
    }

    function updateRecordingStatus(recording) {
        isRecording = recording;
        
        if (recording) {
            $recordBtn.addClass('recording');
            $recordBtn.find('.btn-text').text('หยุดบันทึก');
            $statusIndicator.addClass('recording');
            $statusText.text('กำลังบันทึกเสียง...');
        } else {
            $recordBtn.removeClass('recording');
            $recordBtn.find('.btn-text').text('เริ่มบันทึกเสียง');
            $statusIndicator.removeClass('recording');
            $statusText.text('พร้อมบันทึกเสียง');
        }
    }

    function displayResult(text) {
        $textResult.html(`<p class="result-text">${text}</p>`);
        $copyBtn.prop('disabled', false);
        $clearBtn.prop('disabled', false);
        showSuccess('แปลงเสียงเป็นข้อความสำเร็จ!');
    }

    function displayInterimResult(text) {
        $textResult.html(`<p class="result-text">${text} <span class="loading"></span></p>`);
    }

    function clearText() {
        $textResult.html('<p class="placeholder">ข้อความที่แปลงจากเสียงจะแสดงที่นี่...</p>');
        $copyBtn.prop('disabled', true);
        $clearBtn.prop('disabled', true);
    }

    function copyText() {
        const text = $textResult.find('.result-text').text();
        if (text) {
            navigator.clipboard.writeText(text).then(function() {
                showSuccess('คัดลอกข้อความสำเร็จ!');
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
                showError('ไม่สามารถคัดลอกข้อความได้');
            });
        }
    }

    function updateLanguage() {
        const language = $languageSelect.val();
        config.language = language;
        if (recognition) {
            recognition.lang = language;
        }
    }

    function updateSampleRate() {
        config.sampleRate = parseInt($sampleRateSelect.val());
    }

    function showSuccess(message) {
        showMessage(message, 'success');
    }

    function showError(message) {
        showMessage(message, 'error');
    }

    function showMessage(message, type) {
        // Remove existing messages
        $('.message').remove();
        
        // Create new message
        const $message = $(`<div class="message ${type}">${message}</div>`);
        $('.main-content').prepend($message);
        
        // Auto remove after 3 seconds
        setTimeout(function() {
            $message.fadeOut(function() {
                $message.remove();
            });
        }, 3000);
    }

    // Alternative method using Google Speech API (requires server-side implementation)
    function sendToGoogleSpeechAPI(audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('language', config.language);
        formData.append('sampleRate', config.sampleRate);

        // This would need to be implemented on your server
        // Example endpoint: /api/speech-to-text
        $.ajax({
            url: '/api/speech-to-text',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.transcript) {
                    displayResult(response.transcript);
                } else {
                    showError('ไม่สามารถแปลงเสียงเป็นข้อความได้');
                }
            },
            error: function(xhr, status, error) {
                console.error('API Error:', error);
                showError('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
            }
        });
    }

    // Fallback method for browsers without Speech Recognition
    function startAudioRecording() {
        navigator.mediaDevices.getUserMedia({ 
            audio: {
                sampleRate: config.sampleRate,
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true
            } 
        })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = function(event) {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = function() {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                sendToGoogleSpeechAPI(audioBlob);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            updateRecordingStatus(true);
        })
        .catch(function(error) {
            console.error('Error accessing microphone:', error);
            showError('ไม่สามารถเข้าถึงไมโครโฟนได้');
        });
    }

    // Check if we need to use fallback method
    if (!recognition) {
        $recordBtn.off('click').on('click', function() {
            if (isRecording) {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                updateRecordingStatus(false);
            } else {
                startAudioRecording();
            }
        });
    }
});