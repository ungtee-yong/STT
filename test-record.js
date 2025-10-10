const MicrophoneRecorder = require('./record');

// Test different recording scenarios
async function testRecording() {
    console.log('=== Microphone Recording Test ===\n');

    // Test 1: Short recording (5 seconds)
    console.log('Test 1: Recording for 5 seconds...');
    const recorder1 = new MicrophoneRecorder({
        rate: 16000,
        channels: 1,
        debug: true
    });

    try {
        await recorder1.startRecording('test_5sec.wav', 5);
        console.log('✓ Test 1 completed successfully\n');
    } catch (error) {
        console.error('✗ Test 1 failed:', error.message);
    }

    // Test 2: Manual stop recording
    console.log('Test 2: Manual stop recording (press Ctrl+C after 3 seconds)...');
    const recorder2 = new MicrophoneRecorder({
        rate: 44100,
        channels: 2,
        debug: false
    });

    // Handle Ctrl+C for manual stop
    process.on('SIGINT', () => {
        console.log('\nStopping manual recording...');
        recorder2.stopRecording();
        process.exit(0);
    });

    try {
        // Start recording without duration limit
        await recorder2.startRecording('test_manual.wav');
    } catch (error) {
        console.error('✗ Test 2 failed:', error.message);
    }
}

// Run tests
if (require.main === module) {
    testRecording();
}