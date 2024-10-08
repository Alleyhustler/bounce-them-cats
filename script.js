const container = document.getElementById('container');
const rainButton = document.getElementById('rainButton');
const colors = ['#ffebcd', '#f0e68c', '#e6e6fa', '#f5deb3', '#e0ffff', '#ffcccb'];
const catImages = [
    'images/cat1.png',
    'images/cat2.png',
    'images/cat3.png',
    'images/cat4.png',
    'images/cat5.png',
    'images/cat6.png',
    'images/4d0cbff9ff8fce081ea5d12269c52e51822a4dc1-removebg-preview.png',
    'images/7fac79123d8a4a43b73aa4a6ad046fe9.jpeg',
    'images/8e1a0c16bf0c2cfa3bc131c209051cf5b64a2c46-removebg-preview.png',
    'images/9.jpeg',
    'images/26fc02d99371bd107494db6d281efd26-removebg-preview.png',
    'images/51e1c1e3f6fba151c520655b21e4b9f0-removebg-preview.png',
    'images/51WHgHxF5YL._AC_UF1000_1000_QL80_-removebg-preview.png',
    'images/74f4f548392fbdafbe8a5d9764c83eaf-removebg-preview.png',
    'images/82daf4_ff1c0ff1c7fa4ae59bff4fae6b167008-removebg-preview.png',
    'images/200w.jpeg',
    'images/835eee_8b310b4221674019a1bf266dc48e117f_mv2_d_3024_4032_s_4_2-removebg-preview.png',
    'images/Cursed-Cat(1).jpg',
    'images/daf8770e27db98bad904b66d48168a39-removebg-preview.png',
];

let backgroundIndex = 0;
let cats = [];
let draggingCat = null;
let mouseX, mouseY, lastMouseX, lastMouseY, velocityX, velocityY;

function getRandomPosition() {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    return { x, y };
}

function createCat() {
    if (cats.length >= 25) return; // Limit to 6 cats

    const cat = document.createElement('img');
    const randomIndex = Math.floor(Math.random() * catImages.length);
    cat.src = catImages[randomIndex];
    cat.classList.add('cat');
    cat.style.left = `${getRandomPosition().x}px`;
    cat.style.top = `${getRandomPosition().y}px`;
    cat.style.position = 'absolute'; // Ensure it's absolutely positioned for free movement
    cat.style.cursor = 'pointer';
    cat.draggable = true; // Make the cat draggable

    // Initialize velocity
    cat.dataset.vx = 0;
    cat.dataset.vy = 0;

    // Drag start
    cat.addEventListener('dragstart', (e) => {
        draggingCat = cat;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        e.dataTransfer.setData('text/plain', ''); // Required for Firefox to start drag
        const rect = cat.getBoundingClientRect();
        e.dataTransfer.setDragImage(cat, rect.width / 2, rect.height / 2); // Center the drag image
    });

    // During drag
    document.addEventListener('dragover', (e) => {
        if (draggingCat) {
            e.preventDefault(); // Necessary to allow drop

            // Calculate velocity based on mouse movement
            mouseX = e.clientX;
            mouseY = e.clientY;
            velocityX = (mouseX - lastMouseX) * 0.5; // Multiply to adjust throw strength
            velocityY = (mouseY - lastMouseY) * 0.5;

            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }
    });

    // Drag end (apply throw)
    cat.addEventListener('dragend', (e) => {
        if (draggingCat) {
            // Set the final velocity to simulate a throw
            cat.dataset.vx = velocityX;
            cat.dataset.vy = velocityY;
            draggingCat = null;
        }
    });

    container.appendChild(cat);
    cats.push(cat);
}

function applyGravity() {
    cats.forEach(cat => {
        const rect = cat.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const gravity = 0.2; // Gravity strength
        const bounceFactor = 0.8; // Bounce effect when hitting boundaries
        const airResistance = 0.99; // Simulate air resistance to slow the cat down

        let top = parseFloat(cat.style.top);
        let left = parseFloat(cat.style.left);

        // Apply gravity and air resistance
        cat.dataset.vy = (parseFloat(cat.dataset.vy) || 0) + gravity;
        cat.dataset.vx = (parseFloat(cat.dataset.vx) || 0) * airResistance;
        cat.dataset.vy = (parseFloat(cat.dataset.vy) || 0) * airResistance;

        // Update position
        top += parseFloat(cat.dataset.vy) || 0;
        left += parseFloat(cat.dataset.vx) || 0;

        // Boundary check and bounce
        if (top + rect.height > containerRect.height) {
            top = containerRect.height - rect.height;
            cat.dataset.vy = -(parseFloat(cat.dataset.vy) * bounceFactor);
        }
        if (left + rect.width > window.innerWidth) {
            left = window.innerWidth - rect.width;
            cat.dataset.vx = -(parseFloat(cat.dataset.vx) * bounceFactor);
        }
        if (left < 0) {
            left = 0;
            cat.dataset.vx = -(parseFloat(cat.dataset.vx) * bounceFactor);
        }
        if (top < 0) {
            top = 0;
            cat.dataset.vy = -(parseFloat(cat.dataset.vy) * bounceFactor);
        }

        // Apply smooth movement
        cat.style.top = `${Math.min(Math.max(top, 0), containerRect.height - rect.height)}px`;
        cat.style.left = `${Math.min(Math.max(left, 0), window.innerWidth - rect.width)}px`;
    });
}

function removeCats() {
    cats.forEach(cat => cat.remove());
    cats = [];
}

function makeItRainCats() {
    removeCats();
    for (let i = 0; i < 20; i++) {
        createCat();
    }
}

function changeBackgroundColor() {
    backgroundIndex = (backgroundIndex + 1) % colors.length;
    container.style.backgroundColor = colors[backgroundIndex];
}

// Set up the container to allow drop functionality
container.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessary to allow drop
});

container.addEventListener('drop', (e) => {
    if (draggingCat) {
        const rect = container.getBoundingClientRect();
        const left = e.clientX - rect.left;
        const top = e.clientY - rect.top;

        // Ensure the dropped position is within bounds
        draggingCat.style.left = `${Math.max(0, Math.min(container.clientWidth - draggingCat.offsetWidth, left))}px`;
        draggingCat.style.top = `${Math.max(0, Math.min(container.clientHeight - draggingCat.offsetHeight, top))}px`;

        draggingCat = null;
    }
});

rainButton.addEventListener('click', () => {
    makeItRainCats();
    changeBackgroundColor();
});

// Initialize with 6 cats
for (let i = 0; i < 6; i++) {
    createCat();
}

// Use requestAnimationFrame for smoother motion
function gameLoop() {
    applyGravity();
    requestAnimationFrame(gameLoop);
}

// Start the loop
gameLoop();
