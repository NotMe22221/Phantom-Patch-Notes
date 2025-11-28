// Phantom Patch Notes - CLEAN WORKING DEMO

const hauntedData = {
    commits: [
        { original: "Add user authentication system", themed: "Summoned spectral guardians from the void" },
        { original: "Fix memory leak in session handler", themed: "Banished the phantom that haunted our memory" },
        { original: "Add password reset functionality", themed: "Conjured dark rituals for forgotten souls" },
        { original: "Improve login performance with caching", themed: "Accelerated the ritual with eldritch optimizations" },
        { original: "Remove deprecated OAuth v1 support", themed: "Cast the cursed relics into eternal darkness" },
        { original: "Add real-time notification system", themed: "Awakened the whispers from beyond" },
        { original: "Fix race condition in message queue", themed: "Sealed the temporal rift in the shadow realm" },
        { original: "Add WebSocket connection pooling", themed: "Opened portals to the netherworld" },
        { original: "Improve notification delivery speed", themed: "Hastened the arrival of dark omens" },
        { original: "Breaking: Change notification API structure", themed: "BREAKING: Shattered the ancient covenant" },
        { original: "Add dark mode theme engine", themed: "Embraced the eternal darkness within" },
        { original: "Fix theme switching animation glitch", themed: "Exorcised the glitching specter" },
        { original: "Add custom theme creator", themed: "Forged cursed artifacts of customization" },
        { original: "Improve theme rendering performance", themed: "Unleashed unholy rendering speed" },
        { original: "Add database query optimization", themed: "Summoned ancient database demons" },
        { original: "Fix infinite loop in parser", themed: "Broke the eternal curse of recursion" },
        { original: "Add image optimization pipeline", themed: "Compressed souls into digital artifacts" },
        { original: "Improve bundle size with tree shaking", themed: "Pruned the dead branches from the cursed tree" },
        { original: "Deprecate synchronous API methods", themed: "Condemned the blocking rituals to oblivion" },
        { original: "Add automated testing suite", themed: "Summoned automated spirits to guard our code" }
    ]
};

let currentExampleIndex = 0;
let isPresentationMode = false;
let isAutoPlaying = false;
let autoPlayInterval = null;
let demoStarted = false;
let soundEnabled = true;
let autoPlaySpeed = 3000;

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

function playSound(type) {
    if (!soundEnabled) return;
    console.log(`🔊 ${type}`);
}

function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="intro-screen" id="introScreen">
            <div class="logo">👻 Phantom Patch Notes</div>
            <div class="tagline">Transform Git History into Horror Stories</div>
            <div class="intro-features">
                <div class="feature-badge">🎃 20 Transformations</div>
                <div class="feature-badge">⌨️ Keyboard Shortcuts</div>
                <div class="feature-badge">🎬 Presentation Mode</div>
            </div>
            <button class="begin-btn" onclick="beginDemo()">Begin Demo 🎃</button>
            <div class="intro-buttons">
                <button onclick="toggleHelp()" class="intro-btn-secondary">❓ View Shortcuts</button>
            </div>
            <p style="color: #888; margin-top: 2rem;">Press Enter | Press ? for help</p>
        </div>

        <div class="help-overlay" id="helpOverlay">
            <div class="help-content">
                <h2 class="help-title">⌨️ Keyboard Shortcuts</h2>
                <div class="help-shortcuts">
                    <div class="help-shortcut"><span>Presentation Mode</span><span class="help-key">F</span></div>
                    <div class="help-shortcut"><span>Next Example</span><span class="help-key">→</span></div>
                    <div class="help-shortcut"><span>Previous Example</span><span class="help-key">←</span></div>
                    <div class="help-shortcut"><span>Auto-Play</span><span class="help-key">SPACE</span></div>
                    <div class="help-shortcut"><span>Reset Demo</span><span class="help-key">R</span></div>
                    <div class="help-shortcut"><span>Help</span><span class="help-key">?</span></div>
                </div>
                <p style="text-align: center; margin-top: 2rem; color: #b8b8b8;">Press ESC or ? to close</p>
            </div>
        </div>

        <div class="presentation-mode" id="presentationMode">
            <h1 class="presentation-title">👻 Phantom Patch Notes</h1>
            <div class="presentation-content">
                <div class="presentation-example">
                    <div class="presentation-original">Original: <span id="presOriginal"></span></div>
                    <div class="presentation-themed">Horror: <span id="presThemed"></span></div>
                </div>
                <div class="presentation-counter" id="presCounter"></div>
                <p style="color: #b8b8b8; margin-top: 2rem;">← → navigate | F exit | SPACE auto-play</p>
            </div>
        </div>

        <div class="container hidden" id="mainContent">
            <header>
                <h1>👻 Phantom Patch Notes</h1>
                <p class="subtitle">Kiroween Hackathon Demo</p>
            </header>

            <div class="demo-section">
                <h2 class="section-title">📊 Statistics</h2>
                <div class="stats">
                    <div class="stat-card"><div class="stat-value" id="commitCount">0</div><div class="stat-label">Commits</div></div>
                    <div class="stat-card"><div class="stat-value" id="releaseCount">0</div><div class="stat-label">Releases</div></div>
                    <div class="stat-card"><div class="stat-value" id="transformedWords">0</div><div class="stat-label">Horror Words</div></div>
                    <div class="stat-card"><div class="stat-value" id="transformPercent">0%</div><div class="stat-label">Transformed</div></div>
                </div>
            </div>

            <div class="demo-section">
                <h2 class="section-title">🎭 Transformations</h2>
                <div class="comparison">
                    <div class="comparison-panel"><h3>📝 Original</h3><div class="commit-list" id="originalCommits"></div></div>
                    <div class="comparison-panel"><h3>👻 Horror</h3><div class="commit-list" id="themedCommits"></div></div>
                </div>
            </div>

            <div class="demo-section">
                <h2 class="section-title">🎮 Controls</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                    <button onclick="previousExample()" class="control-btn">← Previous</button>
                    <button onclick="nextExample()" class="control-btn">Next →</button>
                    <button onclick="randomExample()" class="control-btn">🎲 Random</button>
                    <button onclick="toggleAutoPlay()" class="control-btn" id="autoPlayBtn">▶️ Auto-Play</button>
                    <button onclick="togglePresentationMode()" class="control-btn">🎬 Presentation</button>
                    <button onclick="exportDemo('markdown')" class="control-btn">📥 Export MD</button>
                    <button onclick="exportDemo('html')" class="control-btn">📥 Export HTML</button>
                    <button onclick="exportDemo('json')" class="control-btn">📥 Export JSON</button>
                    <button onclick="resetDemo()" class="control-btn">🔄 Reset</button>
                </div>
            </div>

            <div class="demo-section" style="text-align: center;">
                <h2 class="section-title" style="justify-content: center;">🔗 GitHub</h2>
                <a href="https://github.com/NotMe22221/Phantom-Patch-Notes" target="_blank" 
                   style="display: inline-block; padding: 1rem 2rem; background: linear-gradient(45deg, #ff6b6b, #ee5a6f); color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);">
                    View on GitHub 🎃
                </a>
            </div>
        </div>
    `;
}

function beginDemo() {
    demoStarted = true;
    document.getElementById('introScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    playSound('start');
    showToast('🎃 Demo Started!');
    updateDisplay();
}

function toggleHelp() {
    const helpOverlay = document.getElementById('helpOverlay');
    helpOverlay.classList.toggle('visible');
}

function updateDisplay() {
    const commit = hauntedData.commits[currentExampleIndex];
    
    // Update stats
    document.getElementById('commitCount').textContent = hauntedData.commits.length;
    document.getElementById('releaseCount').textContent = '3';
    const wordCount = hauntedData.commits.reduce((sum, c) => sum + c.themed.split(' ').length, 0);
    document.getElementById('transformedWords').textContent = wordCount;
    document.getElementById('transformPercent').textContent = '100%';
    
    // Update commits
    const originalList = document.getElementById('originalCommits');
    const themedList = document.getElementById('themedCommits');
    
    originalList.innerHTML = '';
    themedList.innerHTML = '';
    
    const displayCommits = hauntedData.commits.slice(0, currentExampleIndex + 1);
    
    displayCommits.forEach((c, i) => {
        const originalItem = document.createElement('div');
        originalItem.className = 'commit-item';
        originalItem.innerHTML = `
            <div class="commit-hash">#${String(i + 1).padStart(3, '0')}</div>
            <div class="commit-message">${c.original}</div>
        `;
        originalList.appendChild(originalItem);
        
        const themedItem = document.createElement('div');
        themedItem.className = 'commit-item';
        themedItem.innerHTML = `
            <div class="commit-hash">#${String(i + 1).padStart(3, '0')}</div>
            <div class="commit-message themed">${c.themed}</div>
        `;
        themedList.appendChild(themedItem);
        
        setTimeout(() => {
            originalItem.classList.add('visible');
            themedItem.classList.add('visible');
        }, i * 50);
    });
    
    // Update presentation mode
    if (isPresentationMode) {
        document.getElementById('presOriginal').textContent = commit.original;
        document.getElementById('presThemed').textContent = commit.themed;
        document.getElementById('presCounter').textContent = `${currentExampleIndex + 1} / ${hauntedData.commits.length}`;
    }
}

function nextExample() {
    if (currentExampleIndex < hauntedData.commits.length - 1) {
        currentExampleIndex++;
        updateDisplay();
        playSound('next');
        showToast(`Example ${currentExampleIndex + 1}/${hauntedData.commits.length}`);
    }
}

function previousExample() {
    if (currentExampleIndex > 0) {
        currentExampleIndex--;
        updateDisplay();
        playSound('prev');
        showToast(`Example ${currentExampleIndex + 1}/${hauntedData.commits.length}`);
    }
}

function randomExample() {
    const newIndex = Math.floor(Math.random() * hauntedData.commits.length);
    currentExampleIndex = newIndex;
    updateDisplay();
    playSound('random');
    showToast(`🎲 Random: ${currentExampleIndex + 1}/${hauntedData.commits.length}`);
}

function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    const btn = document.getElementById('autoPlayBtn');
    
    if (isAutoPlaying) {
        btn.textContent = '⏸️ Auto-Play';
        btn.classList.add('active');
        showToast('▶️ Auto-play started');
        autoPlayInterval = setInterval(() => {
            if (currentExampleIndex < hauntedData.commits.length - 1) {
                nextExample();
            } else {
                currentExampleIndex = 0;
                updateDisplay();
            }
        }, autoPlaySpeed);
    } else {
        btn.textContent = '▶️ Auto-Play';
        btn.classList.remove('active');
        showToast('⏸️ Auto-play stopped');
        clearInterval(autoPlayInterval);
    }
}

function togglePresentationMode() {
    isPresentationMode = !isPresentationMode;
    const presMode = document.getElementById('presentationMode');
    const mainContent = document.getElementById('mainContent');
    
    if (isPresentationMode) {
        presMode.classList.add('active');
        mainContent.classList.add('hidden');
        updateDisplay();
        showToast('🎬 Presentation Mode');
    } else {
        presMode.classList.remove('active');
        mainContent.classList.remove('hidden');
        showToast('📊 Normal Mode');
    }
}

function resetDemo() {
    currentExampleIndex = 0;
    isAutoPlaying = false;
    isPresentationMode = false;
    clearInterval(autoPlayInterval);
    
    const btn = document.getElementById('autoPlayBtn');
    if (btn) {
        btn.textContent = '▶️ Auto-Play';
        btn.classList.remove('active');
    }
    
    document.getElementById('presentationMode').classList.remove('active');
    document.getElementById('mainContent').classList.remove('hidden');
    
    updateDisplay();
    showToast('🔄 Demo Reset');
}

function exportDemo(format) {
    let content = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'markdown') {
        content = '# Phantom Patch Notes - Transformations\n\n';
        hauntedData.commits.forEach((c, i) => {
            content += `## ${i + 1}. ${c.original}\n`;
            content += `**Horror:** ${c.themed}\n\n`;
        });
        filename = 'phantom-patch-notes.md';
        mimeType = 'text/markdown';
    } else if (format === 'html') {
        content = '<html><head><title>Phantom Patch Notes</title></head><body>';
        content += '<h1>Phantom Patch Notes - Transformations</h1>';
        hauntedData.commits.forEach((c, i) => {
            content += `<h2>${i + 1}. ${c.original}</h2>`;
            content += `<p><strong>Horror:</strong> ${c.themed}</p>`;
        });
        content += '</body></html>';
        filename = 'phantom-patch-notes.html';
        mimeType = 'text/html';
    } else if (format === 'json') {
        content = JSON.stringify(hauntedData, null, 2);
        filename = 'phantom-patch-notes.json';
        mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(`📥 Exported as ${format.toUpperCase()}`);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!demoStarted && e.key === 'Enter') {
        beginDemo();
        return;
    }
    
    if (!demoStarted) return;
    
    // Help overlay
    if (e.key === '?') {
        toggleHelp();
        return;
    }
    
    // Close help with ESC
    if (e.key === 'Escape') {
        const helpOverlay = document.getElementById('helpOverlay');
        if (helpOverlay.classList.contains('visible')) {
            helpOverlay.classList.remove('visible');
        }
        return;
    }
    
    // Navigation
    if (e.key === 'ArrowRight') {
        nextExample();
    } else if (e.key === 'ArrowLeft') {
        previousExample();
    } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
    } else if (e.key === 'f' || e.key === 'F') {
        togglePresentationMode();
    } else if (e.key === 'r' || e.key === 'R') {
        resetDemo();
    }
});

// Initialize
createParticles();
renderApp();
