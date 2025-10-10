const mic = require('mic');
const fs = require('fs');
const wav = require('wav');

class MicrophoneRecorder {
    constructor(options = {}) {
        this.options = {
            rate: options.rate || 16000,        // Sample rate
            channels: options.channels || 1,    // Mono recording
            debug: options.debug || false,
            exitOnSilence: options.exitOnSilence || 6,
            ...options
        };
        
        this.micInstance = null;
        this.micInputStream = null;
        this.outputFileStream = null;
        this.isRecording = false;
    }

    /**
     * Start recording from microphone
     * @param {string} outputPath - Path where WAV file will be saved
     * @param {number} duration - Recording duration in seconds (optional)
     * @returns {Promise} - Promise that resolves when recording is complete
     */
    async startRecording(outputPath, duration = null) {
        return new Promise((resolve, reject) => {
            try {
                // Create mic instance
                this.micInstance = mic({
                    rate: this.options.rate,
                    channels: this.options.channels,
                    debug: this.options.debug,
                    exitOnSilence: this.options.exitOnSilence
                });

                // Get input stream from microphone
                this.micInputStream = this.micInstance.getAudioStream();

                // Create WAV file writer
                this.outputFileStream = new wav.FileWriter(outputPath, {
                    channels: this.options.channels,
                    sampleRate: this.options.rate,
                    bitDepth: 16
                });

                // Pipe microphone input to WAV file
                this.micInputStream.pipe(this.outputFileStream);

                // Handle errors
                this.micInputStream.on('error', (err) => {
                    console.error('Error in microphone input stream:', err);
                    this.stopRecording();
                    reject(err);
                });

                this.outputFileStream.on('error', (err) => {
                    console.error('Error writing to file:', err);
                    this.stopRecording();
                    reject(err);
                });

                // Handle successful completion
                this.outputFileStream.on('finish', () => {
                    console.log(`Recording saved to: ${outputPath}`);
                    this.isRecording = false;
                    resolve(outputPath);
                });

                // Start recording
                this.micInstance.start();
                this.isRecording = true;
                console.log('Recording started... Press Ctrl+C to stop');

                // Set duration timer if specified
                if (duration && duration > 0) {
                    setTimeout(() => {
                        console.log(`Recording duration of ${duration} seconds completed`);
                        this.stopRecording();
                    }, duration * 1000);
                }

            } catch (error) {
                console.error('Error starting recording:', error);
                reject(error);
            }
        });
    }

    /**
     * Stop recording
     */
    stopRecording() {
        if (this.isRecording) {
            console.log('Stopping recording...');
            
            if (this.micInstance) {
                this.micInstance.stop();
            }
            
            if (this.micInputStream) {
                this.micInputStream.destroy();
            }
            
            if (this.outputFileStream) {
                this.outputFileStream.end();
            }
            
            this.isRecording = false;
        }
    }

    /**
     * Check if currently recording
     * @returns {boolean}
     */
    getRecordingStatus() {
        return this.isRecording;
    }
}

// Example usage
async function main() {
    const recorder = new MicrophoneRecorder({
        rate: 44100,        // CD quality
        channels: 2,        // Stereo
        debug: false
    });

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        console.log('\nReceived SIGINT. Stopping recording...');
        recorder.stopRecording();
        process.exit(0);
    });

    try {
        // Record for 10 seconds
        const outputPath = `recording_${Date.now()}.wav`;
        console.log(`Starting 10-second recording to: ${outputPath}`);
        
        await recorder.startRecording(outputPath, 10);
        
        console.log('Recording completed successfully!');
        
    } catch (error) {
        console.error('Recording failed:', error);
        process.exit(1);
    }
}

// Export the class for use in other modules
module.exports = MicrophoneRecorder;

// Run main function if this file is executed directly
if (require.main === module) {
    main();
}