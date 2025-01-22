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

    // Replicate API configuration
    const REPLICATE_API_TOKEN = ''; // Add your Replicate API token here
    const MUSICGEN_API_URL = 'https://api.replicate.com/v1/predictions';

    // Update slider values
    tempoSlider.addEventListener('input', function() {
        tempoValue.textContent = this.value;
    });

    energySlider.addEventListener('input', function() {
        energyValue.textContent = this.value;
    });

    // History of generated music
    let musicHistory = [];
    let currentHistoryIndex = -1;

    // Generate music using Replicate's Musicgen API
    async function generateMusic(prompt) {
        const response = await fetch(MUSICGEN_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: "7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
                input: {
                    model_version: "melody",
                    prompt: prompt,
                    duration: parseInt(document.getElementById('duration').value),
                    temperature: energySlider.value / 100,
                    top_k: 250,
                    top_p: 0,
                    classifier_free_guidance: 3,
                    output_format: "wav",
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate music');
        }

        const prediction = await response.json();
        return prediction;
    }

    // Check prediction status
    async function checkPredictionStatus(predictionId) {
        const response = await fetch(`${MUSICGEN_API_URL}/${predictionId}`, {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to check prediction status');
        }

        const prediction = await response.json();
        return prediction;
    }

    // Generate music
    generateBtn.addEventListener('click', async function() {
        if (!REPLICATE_API_TOKEN) {
            alert('Please add your Replicate API token to use this feature.');
            return;
        }

        // Show loading
        loadingIndicator.classList.remove('hidden');
        resultSection.classList.add('hidden');

        try {
            // Get prompt and settings
            const prompt = document.getElementById('prompt').value;
            const genre = document.getElementById('genre').value;
            const language = document.getElementById('language').value;
            const voice = document.getElementById('voice').value;
            const mood = document.getElementById('mood').value;

            // Create enhanced prompt
            const enhancedPrompt = `Create a ${mood} ${genre} song in ${language} with ${voice} vocals. Tempo: ${tempoSlider.value} BPM. ${prompt}`;

            // Start generation
            const prediction = await generateMusic(enhancedPrompt);
            
            // Poll for results
            let result;
            while (true) {
                result = await checkPredictionStatus(prediction.id);
                if (result.status === 'succeeded') {
                    break;
                } else if (result.status === 'failed') {
                    throw new Error('Music generation failed');
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Set audio source
            audioPlayer.src = result.output;
            
            // Add to history
            musicHistory.push({
                prompt: enhancedPrompt,
                audioUrl: result.output,
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

            // Hide loading and show result
            loadingIndicator.classList.add('hidden');
            resultSection.classList.remove('hidden');

            // Start playing
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

            // Save to local storage
            localStorage.setItem('musicHistory', JSON.stringify(musicHistory));

        } catch (error) {
            console.error('Error generating music:', error);
            alert('Error generating music. Please try again.');
            loadingIndicator.classList.add('hidden');
        }
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
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
    });

    // Download button
    downloadBtn.addEventListener('click', async function() {
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
            } catch (error) {
                console.error('Error downloading music:', error);
                alert('Error downloading music. Please try again.');
            }
        }
    });

    // Share button
    shareBtn.addEventListener('click', async function() {
        if (navigator.share && audioPlayer.src) {
            try {
                await navigator.share({
                    title: 'Check out my AI-generated music!',
                    text: 'Listen to this amazing music I created with AI Guruji',
                    url: audioPlayer.src
                });
            } catch (error) {
                console.error('Error sharing:', error);
                // Fallback to copy link
                navigator.clipboard.writeText(audioPlayer.src)
                    .then(() => alert('Link copied to clipboard!'))
                    .catch(() => alert('Copy this link to share: ' + audioPlayer.src));
            }
        } else {
            alert('Copy this link to share: ' + audioPlayer.src);
        }
    });

    // Regenerate button
    regenerateBtn.addEventListener('click', function() {
        generateBtn.click();
    });

    // Helper function to format time
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    // Audio ended event
    audioPlayer.addEventListener('ended', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
    });

    // Load history from local storage
    const savedHistory = localStorage.getItem('musicHistory');
    if (savedHistory) {
        musicHistory = JSON.parse(savedHistory);
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

    // Load history item
    function loadHistoryItem(index) {
        const item = musicHistory[index];
        audioPlayer.src = item.audioUrl;
        document.getElementById('prompt').value = item.prompt;
        
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
        
        // Start playing
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
});
