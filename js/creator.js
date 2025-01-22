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
