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

    // Update slider values
    tempoSlider.addEventListener('input', function() {
        tempoValue.textContent = this.value;
    });

    energySlider.addEventListener('input', function() {
        energyValue.textContent = this.value;
    });

    // Generate music
    generateBtn.addEventListener('click', async function() {
        // Show loading
        loadingIndicator.classList.remove('hidden');
        resultSection.classList.add('hidden');

        try {
            // Simulate AI music generation (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 3000));

            // For testing, we'll use a sample audio file
            audioPlayer.src = 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav';
            
            // Hide loading and show result
            loadingIndicator.classList.add('hidden');
            resultSection.classList.remove('hidden');

            // Start playing
            audioPlayer.play();
        } catch (error) {
            console.error('Error generating music:', error);
            alert('Error generating music. Please try again.');
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
    downloadBtn.addEventListener('click', function() {
        if (audioPlayer.src) {
            const a = document.createElement('a');
            a.href = audioPlayer.src;
            a.download = 'ai-guruji-music.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // Share button
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Check out my AI-generated music!',
                text: 'Listen to this amazing music I created with AI Guruji',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Copy this link to share: ' + window.location.href);
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
});
