// Initialize Three.js scene
let scene, camera, renderer;
let particles = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const container = document.getElementById('hero-animation');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // Create particles
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x6C63FF });

    for (let i = 0; i < 100; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.x = Math.random() * 10 - 5;
        particle.position.y = Math.random() * 10 - 5;
        particle.position.z = Math.random() * 10 - 5;
        particles.push(particle);
        scene.add(particle);
    }

    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);

    particles.forEach(particle => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Initialize animations when the page loads
window.addEventListener('load', () => {
    init();
    animate();

    // Text animation
    gsap.from('.hero h2', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.hero p', {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.cta-button', {
        duration: 1,
        y: 20,
        opacity: 0,
        delay: 0.6,
        ease: 'power3.out'
    });
});
