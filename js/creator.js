// Genre button functionality
const genreButtons = document.querySelectorAll('.genre-btn');
genreButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        genreButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
    });
});

// Music player functionality
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const progressBar = document.querySelector('.progress');
let audioContext;
let audioSource;
let isPlaying = false;

// Initialize audio context on user interaction
document.addEventListener('click', initializeAudioContext, { once: true });

function initializeAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

playBtn.addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true;
        // Add animation to progress bar
        progressBar.style.width = '100%';
        progressBar.style.transition = 'width 30s linear';
    }
});

pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        isPlaying = false;
        // Pause progress bar animation
        const computedWidth = getComputedStyle(progressBar).width;
        progressBar.style.width = computedWidth;
        progressBar.style.transition = 'none';
    }
});

stopBtn.addEventListener('click', () => {
    isPlaying = false;
    // Reset progress bar
    progressBar.style.width = '0%';
    progressBar.style.transition = 'none';
});

// Create music functionality
const createBtn = document.querySelector('.create-btn');
const promptInput = document.querySelector('.prompt-input');
const languageSelect = document.querySelector('.language-select');

createBtn.addEventListener('click', async () => {
    const prompt = promptInput.value;
    const language = languageSelect.value;
    const genre = document.querySelector('.genre-btn.active')?.textContent || '';

    if (!prompt) {
        alert('Please enter a prompt for your music');
        return;
    }

    if (!genre) {
        alert('Please select a genre');
        return;
    }

    // Show loading state
    createBtn.textContent = 'Creating...';
    createBtn.disabled = true;

    try {
        // Simulate API call - Replace with actual API integration
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Reset UI
        createBtn.textContent = 'Create Music';
        createBtn.disabled = false;

        // Show success message
        alert('Music created successfully! Click play to listen.');

        // Reset progress bar
        progressBar.style.width = '0%';
        progressBar.style.transition = 'none';
    } catch (error) {
        console.error('Error creating music:', error);
        alert('Error creating music. Please try again.');
        
        // Reset UI
        createBtn.textContent = 'Create Music';
        createBtn.disabled = false;
    }
});

// Download functionality
const downloadBtn = document.querySelector('.download-btn');

downloadBtn.addEventListener('click', () => {
    if (!isPlaying) {
        alert('Please create and play music before downloading');
        return;
    }

    // Simulate download - Replace with actual download functionality
    alert('Downloading music...');
});

// Add animations
gsap.from('.creator-studio h2', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power4.out'
});

gsap.from('.creator-container', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.3
});

// Animate genre buttons
genreButtons.forEach((btn, index) => {
    gsap.from(btn, {
        duration: 0.5,
        scale: 0,
        opacity: 0,
        ease: 'back.out(1.7)',
        delay: 0.1 * index
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const generateBtn = document.getElementById('generateBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultSection = document.getElementById('resultSection');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.querySelector('.progress');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const tempoSlider = document.getElementById('tempo');
    const energySlider = document.getElementById('energy');
    const tempoValue = document.getElementById('tempoValue');
    const energyValue = document.getElementById('energyValue');

    // Debug mode
    const DEBUG = true;

    function log(...args) {
        if (DEBUG) {
            console.log('[AI Guruji]', ...args);
        }
    }

    // API configuration
    const API_URL = 'https://api-inference.huggingface.co/models/facebook/musicgen-large';
    let API_TOKEN = '';

    // Function to set API token
    function setApiToken(token) {
        API_TOKEN = token;
        localStorage.setItem('hf_token', token);
        log('API token set');
    }

    // Try to get token from localStorage
    const savedToken = localStorage.getItem('hf_token');
    if (savedToken) {
        setApiToken(savedToken);
        log('Loaded saved API token');
    }

    // History of generated music
    let musicHistory = [];
    let currentHistoryIndex = -1;

    // Update slider values
    tempoSlider.addEventListener('input', function() {
        tempoValue.textContent = this.value;
    });

    energySlider.addEventListener('input', function() {
        energyValue.textContent = this.value;
    });

    // Test audio playback
    function testAudioPlayback() {
        const testAudio = new Audio();
        testAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        
        testAudio.play().then(() => {
            log('Audio playback test successful');
        }).catch(error => {
            log('Audio playback test failed:', error);
            alert('Audio playback might be blocked. Please ensure autoplay is enabled and try again.');
        });
    }

    // Test audio playback on page load
    testAudioPlayback();

    // Generate music using Hugging Face API
    async function generateMusic(prompt) {
        log('Starting music generation with prompt:', prompt);

        if (!API_TOKEN) {
            const token = window.prompt('Please enter your Hugging Face API token:');
            if (!token) {
                throw new Error('API token is required');
            }
            setApiToken(token);
        }

        log('Making API request...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: parseInt(document.getElementById('duration').value) * 50,
                    temperature: energySlider.value / 100,
                    top_k: 250,
                    top_p: 0.9,
                    repetition_penalty: 1.2,
                    audio_length: parseInt(document.getElementById('duration').value),
                }
            })
        });

        log('API response status:', response.status);

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('hf_token');
                API_TOKEN = '';
                throw new Error('Invalid API token. Please try again.');
            }

            const errorText = await response.text();
            log('API error:', errorText);
            throw new Error(`Failed to generate music: ${response.status} ${errorText}`);
        }

        log('Getting response blob...');
        const blob = await response.blob();
        log('Blob size:', blob.size, 'bytes');
        log('Blob type:', blob.type);

        const url = URL.createObjectURL(blob);
        log('Created object URL:', url);
        return url;
    }

    // Generate music
    generateBtn.addEventListener('click', async function() {
        log('Generate button clicked');
        
        // Show loading
        loadingIndicator.classList.remove('hidden');
        resultSection.classList.add('hidden');

        try {
            // Get settings
            const prompt = document.getElementById('prompt').value;
            const genre = document.getElementById('genre').value;
            const language = document.getElementById('language').value;
            const voice = document.getElementById('voice').value;
            const mood = document.getElementById('mood').value;

            log('Settings:', { prompt, genre, language, voice, mood });

            // Create enhanced prompt
            const enhancedPrompt = `Create a ${mood} ${genre} song in ${language} with ${voice} vocals. Tempo: ${tempoSlider.value} BPM. ${prompt}`;
            log('Enhanced prompt:', enhancedPrompt);

            // Generate music
            const audioUrl = await generateMusic(enhancedPrompt);
            log('Setting audio source:', audioUrl);
            
            audioPlayer.src = audioUrl;

            // Add to history
            musicHistory.push({
                prompt: enhancedPrompt,
                audioUrl: audioUrl,
                settings: {
                    genre,
                    language,
                    voice,
                    mood,
                    tempo: tempoSlider.value,
                    energy: energySlider.value
                }
            });
            currentHistoryIndex = musicHistory.length - 1;

            // Update history display
            updateHistoryDisplay();

            // Hide loading and show result
            loadingIndicator.classList.add('hidden');
            resultSection.classList.remove('hidden');

            // Start playing
            log('Starting playback...');
            const playPromise = audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    log('Playback started successfully');
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    log('Playback failed:', error);
                    alert('Failed to play audio. Please try clicking the play button.');
                });
            }

            // Save to local storage
            localStorage.setItem('musicHistory', JSON.stringify(musicHistory));
            log('History saved to localStorage');

        } catch (error) {
            console.error('Error generating music:', error);
            alert(error.message || 'Error generating music. Please try again.');
            loadingIndicator.classList.add('hidden');
        }
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', function() {
        log('Play/Pause button clicked');
        if (audioPlayer.paused) {
            const playPromise = audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    log('Playback started');
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    log('Playback failed:', error);
                });
            }
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            log('Playback paused');
        }
    });

    // Audio events
    audioPlayer.addEventListener('loadstart', () => log('Audio loading started'));
    audioPlayer.addEventListener('loadeddata', () => log('Audio data loaded'));
    audioPlayer.addEventListener('canplay', () => log('Audio can play'));
    audioPlayer.addEventListener('playing', () => log('Audio playing'));
    audioPlayer.addEventListener('pause', () => log('Audio paused'));
    audioPlayer.addEventListener('ended', () => {
        log('Audio ended');
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
    });
    audioPlayer.addEventListener('error', (e) => {
        log('Audio error:', e.target.error);
        alert('Error playing audio. Please try again.');
    });

    // Update progress bar
    audioPlayer.addEventListener('timeupdate', function() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
        
        // Update time displays
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        durationSpan.textContent = formatTime(audioPlayer.duration);
    });

    // Click on progress bar to seek
    document.querySelector('.progress-bar').addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
        log('Seeked to:', percentage * 100, '%');
    });

    // Download button
    downloadBtn.addEventListener('click', async function() {
        log('Download button clicked');
        if (audioPlayer.src) {
            try {
                const response = await fetch(audioPlayer.src);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai-guruji-music-${Date.now()}.wav`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                log('Download completed');
            } catch (error) {
                log('Download error:', error);
                alert('Error downloading music. Please try again.');
            }
        }
    });

    // Share button
    shareBtn.addEventListener('click', async function() {
        log('Share button clicked');
        if (navigator.share && audioPlayer.src) {
            try {
                await navigator.share({
                    title: 'Check out my AI-generated music!',
                    text: 'Listen to this amazing music I created with AI Guruji',
                    url: audioPlayer.src
                });
                log('Shared successfully');
            } catch (error) {
                log('Share error:', error);
                navigator.clipboard.writeText(audioPlayer.src)
                    .then(() => {
                        log('Link copied to clipboard');
                        alert('Link copied to clipboard!');
                    })
                    .catch(() => {
                        log('Copy to clipboard failed');
                        alert('Copy this link to share: ' + audioPlayer.src);
                    });
            }
        } else {
            alert('Copy this link to share: ' + audioPlayer.src);
        }
    });

    // Regenerate button
    regenerateBtn.addEventListener('click', function() {
        log('Regenerate button clicked');
        generateBtn.click();
    });

    // Helper function to format time
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    // Load history from local storage
    const savedHistory = localStorage.getItem('musicHistory');
    if (savedHistory) {
        musicHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
        log('Loaded history from localStorage:', musicHistory.length, 'items');
    }

    // Update history display
    function updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        historyList.innerHTML = '';
        musicHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${index === currentHistoryIndex ? 'active' : ''}`;
            historyItem.innerHTML = `
                <div class="history-item-prompt">${item.prompt || 'No prompt'}</div>
                <div class="history-item-details">
                    <span>${item.settings.genre}</span>
                    <span>${item.settings.language}</span>
                    <span>${item.settings.mood}</span>
                </div>
            `;
            historyItem.addEventListener('click', () => loadHistoryItem(index));
            historyList.appendChild(historyItem);
        });
        log('Updated history display');
    }

    // Load history item
    function loadHistoryItem(index) {
        log('Loading history item:', index);
        const item = musicHistory[index];
        currentHistoryIndex = index;
        audioPlayer.src = item.audioUrl;
        document.getElementById('prompt').value = item.prompt || '';
        
        // Restore settings
        document.getElementById('genre').value = item.settings.genre;
        document.getElementById('language').value = item.settings.language;
        document.getElementById('voice').value = item.settings.voice;
        document.getElementById('mood').value = item.settings.mood;
        tempoSlider.value = item.settings.tempo;
        energySlider.value = item.settings.energy;
        
        // Update displays
        tempoValue.textContent = item.settings.tempo;
        energyValue.textContent = item.settings.energy;
        updateHistoryDisplay();
        
        // Start playing
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                log('History item playback started');
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                log('History item playback failed:', error);
            });
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Space bar to play/pause
        if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            playPauseBtn.click();
        }
        // Left arrow for previous track
        else if (e.code === 'ArrowLeft' && e.ctrlKey && currentHistoryIndex > 0) {
            currentHistoryIndex--;
            loadHistoryItem(currentHistoryIndex);
        }
        // Right arrow for next track
        else if (e.code === 'ArrowRight' && e.ctrlKey && currentHistoryIndex < musicHistory.length - 1) {
            currentHistoryIndex++;
            loadHistoryItem(currentHistoryIndex);
        }
    });
});
