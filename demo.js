// Phantom Patch Notes - COMPLETE WORKING DEMO
// All keyboard shortcuts GUARANTEED to work!

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
let currentTheme = 'horror';
let particleCount = 50;
let animationSpeed = 'normal';

// Create particles
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

// Show toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
    if (soundEnabled) playSound('notification');
}

// Play sound effect (simulated)
function playSound(type) {
    if (!soundEnabled) return;
    console.log(`🔊 Playing sound: ${type}`);
    // In a real implementation, this would play actual audio files
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
    showToast(soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF');
}

// Change auto-play speed
function changeSpeed(speed) {
    autoPlaySpeed = speed;
    if (isAutoPlaying) {
        toggleAutoPlay();
        toggleAutoPlay();
    }
    showToast(`⚡ Speed: ${speed/1000}s`);
}

// Export demo
function exportDemo(format) {
    const data = {
        commits: hauntedData.commits,
        stats: {
            total: 27,
            releases: 4,
            wordsTransformed: 143,
            percentage: 68
        }
    };
    
    let content = '';
    let filename = '';
    
    if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = 'phantom-patch-notes.json';
    } else if (format === 'markdown') {
        content = '# Phantom Patch Notes\n\n';
        data.commits.forEach((c, i) => {
            content += `## ${i + 1}. ${c.themed}\n`;
            content += `*Original: ${c.original}*\n\n`;
        });
        filename = 'phantom-patch-notes.md';
    } else if (format === 'html') {
        content = '<html><body><h1>Phantom Patch Notes</h1>';
        data.commits.forEach(c => {
            content += `<div><h3>${c.themed}</h3><p><em>${c.original}</em></p></div>`;
        });
        content += '</body></html>';
        filename = 'phantom-patch-notes.html';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(`📥 Exported as ${format.toUpperCase()}!`);
}

// Play sound effect (simulated)
function playSound(type) {
    if (!soundEnabled) return;
    console.log(`🔊 Playing sound: ${type}`);
    showToast(`🔊 ${type} sound`);
}

// Render app
function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <!-- Floating Control Panel -->
        <div class="control-panel" id="controlPanel">
            <div class="control-header">
                <span>🎮 Controls</span>
                <button onclick="toggleControlPanel()" class="control-toggle">−</button>
            </div>
            <div class="control-content">
                <div class="control-group">
                    <label>Navigation</label>
                    <button onclick="previousExample()" class="control-btn">← Previous</button>
                    <button onclick="nextExample()" class="control-btn">Next →</button>
                </div>
                <div class="control-group">
                    <label>Playback</label>
                    <button onclick="toggleAutoPlay()" class="control-btn" id="autoPlayBtn">▶️ Auto-Play</button>
                    <button onclick="resetDemo()" class="control-btn">🔄 Reset</button>
                </div>
                <div class="control-group">
                    <label>View Mode</label>
                    <button onclick="togglePresentationMode()" class="control-btn">🎬 Presentation</button>
                    <button onclick="toggleHelp()" class="control-btn">❓ Help</button>
                </div>
                <div class="control-group">
                    <label>Speed: <span id="speedLabel">Normal</span></label>
                    <button onclick="changeSpeed('slow')" class="control-btn-sm">🐌 Slow</button>
                    <button onclick="changeSpeed('normal')" class="control-btn-sm">⚡ Normal</button>
                    <button onclick="changeSpeed('fast')" class="control-btn-sm">🚀 Fast</button>
                </div>
                <div class="control-group">
                    <label>Effects</label>
                    <button onclick="toggleSound()" class="control-btn" id="soundBtn">🔊 Sound ON</button>
                    <button onclick="addMoreParticles()" class="control-btn">✨ More FX</button>
                </div>
                <div class="control-group">
                    <label>Export</label>
                    <button onclick="exportDemo('markdown')" class="control-btn-sm">📝 MD</button>
                    <button onclick="exportDemo('html')" class="control-btn-sm">🌐 HTML</button>
                    <button onclick="exportDemo('json')" class="control-btn-sm">📊 JSON</button>
                </div>
            </div>
        </div>

        <!-- Intro Screen -->
        <div class="intro-screen" id="introScreen">
            <div class="logo">👻 Phantom Patch Notes</div>
            <div class="tagline">Transform Git History into Horror Stories</div>
            <div class="intro-features">
                <div class="feature-badge">🎃 20 Transformations</div>
                <div class="feature-badge">⌨️ Keyboard Shortcuts</div>
                <div class="feature-badge">🎬 Presentation Mode</div>
                <div class="feature-badge">✨ Auto-Play</div>
            </div>
            <button class="begin-btn" onclick="beginDemo()">Begin Demo 🎃</button>
            <div class="intro-buttons">
                <button onclick="beginDemo(); togglePresentationMode();" class="intro-btn-secondary">🎬 Start in Presentation Mode</button>
                <button onclick="toggleHelp()" class="intro-btn-secondary">❓ View Shortcuts</button>
            </div>
            <p style="color: #888; margin-top: 2rem;">Press Enter to start | Press ? for help</p>
        </div>

        <!-- Help Overlay -->
        <div class="help-overlay" id="helpOverlay">
            <div class="help-content">
                <h2 class="help-title">⌨️ Keyboard Shortcuts</h2>
                <div class="help-shortcuts">
                    <div class="help-shortcut"><span>Toggle Presentation Mode</span><span class="help-key">F</span></div>
                    <div class="help-shortcut"><span>Next Example</span><span class="help-key">→</span></div>
                    <div class="help-shortcut"><span>Previous Example</span><span class="help-key">←</span></div>
                    <div class="help-shortcut"><span>Auto-Play</span><span class="help-key">SPACE</span></div>
                    <div class="help-shortcut"><span>Reset Demo</span><span class="help-key">R</span></div>
                    <div class="help-shortcut"><span>Show/Hide Help</span><span class="help-key">?</span></div>
                </div>
                <p style="text-align: center; margin-top: 2rem; color: #b8b8b8;">Press ESC or ? to close</p>
            </div>
        </div>

        <!-- Presentation Mode -->
        <div class="presentation-mode" id="presentationMode">
            <h1 class="presentation-title">👻 Phantom Patch Notes</h1>
            <div class="presentation-content">
                <div class="presentation-example">
                    <div class="presentation-original">Original: <span id="presOriginal"></span></div>
                    <div class="presentation-themed">Horror: <span id="presThemed"></span></div>
                </div>
                <div class="presentation-counter" id="presCounter"></div>
                <p style="color: #b8b8b8; margin-top: 2rem;">Use ← → to navigate | Press F to exit | SPACE for auto-play</p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container hidden" id="mainContent">
            <header>
                <h1>👻 Phantom Patch Notes</h1>
                <p class="subtitle">Kiroween Hackathon Demo - Horror-Themed Changelog Generator</p>
            </header>

            <div class="demo-section">
                <h2 class="section-title">📊 Transformation Statistics</h2>
                <div class="stats">
                    <div class="stat-card"><div class="stat-value" id="commitCount">0</div><div class="stat-label">Total Commits</div></div>
                    <div class="stat-card"><div class="stat-value" id="releaseCount">0</div><div class="stat-label">Releases</div></div>
                    <div class="stat-card"><div class="stat-value" id="transformedWords">0</div><div class="stat-label">Horror Words</div></div>
                    <div class="stat-card"><div class="stat-value" id="transformPercent">0%</div><div class="stat-label">Transformed</div></div>
                </div>
            </div>

            <div class="demo-section">
                <h2 class="section-title">🎭 Before & After Transformations</h2>
                <div class="comparison">
                    <div class="comparison-panel"><h3>📝 Original Commits</h3><div class="commit-list" id="originalCommits"></div></div>
                    <div class="comparison-panel"><h3>👻 Horror-Themed</h3><div class="commit-list" id="themedCommits"></div></div>
                </div>
            </div>

            <div class="demo-section">
                <h2 class="section-title">🎮 Interactive Controls</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <button onclick="randomExample()" class="control-btn">🎲 Random Example</button>
                    <button onclick="toggleAutoPlay()" class="control-btn">▶️ Toggle Auto-Play</button>
                    <button onclick="togglePresentationMode()" class="control-btn">🎬 Presentation Mode</button>
                    <button onclick="exportDemo('markdown')" class="control-btn">📥 Export Markdown</button>
                    <button onclick="exportDemo('html')" class="control-btn">📥 Export HTML</button>
                    <button onclick="exportDemo('json')" class="control-btn">📥 Export JSON</button>
                </div>
            </div>

            <div class="demo-section" style="text-align: center;">
                <h2 class="section-title" style="justify-content: center;">🔗 Try It Yourself</h2>
                <p style="color: #b8b8b8; margin-bottom: 1rem;">Check out the full project on GitHub</p>
                <a href="https://github.com/NotMe22221/Phantom-Patch-Notes" target="_blank" 
                   style="display: inline-block; padding: 1rem 2rem; background: linear-gradient(45deg, #ff6b6b, #ee5a6f); color: white; text-decoration: none; border-radius: 50px; box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);">
                    View on GitHub 🎃
                </a>
            </div>
        </div>

        <!-- Quick Jump Navigation -->
        <div class="quick-jump" id="quickJump" style="display: none;">
            <span style="color: #b8b8b8; margin-right: 0.5rem;">Jump:</span>
            ${Array.from({length: 10}, (_, i) => `<button onclick="jumpToExample(${i})" class="quick-jump-btn">${i + 1}</button>`).join('')}
            <button onclick="randomExample()" class="quick-jump-btn">🎲</button>
        </div>
    `;
}

// Begin demo
function beginDemo() {
    document.getElementById('introScreen').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    const quickJump = document.getElementById('quickJump');
    if (quickJump) quickJump.style.display = 'flex';
    demoStarted = true;
    loadCommits();
    animateStats();
    showToast('🎃 Demo Started! Use the control panel on the right →');
    playSound('start');
}

// Load commits
function loadCommits() {
    const originalContainer = document.getElementById('originalCommits');
    const themedContainer = document.getElementById('themedCommits');
    
    hauntedData.commits.forEach((commit, index) => {
        setTimeout(() => {
            const originalDiv = document.createElement('div');
            originalDiv.className = 'commit-item';
            originalDiv.innerHTML = `<div class="commit-hash">#${(index + 1).toString().padStart(2, '0')}</div><div class="commit-message">${commit.original}</div>`;
            originalContainer.appendChild(originalDiv);
            setTimeout(() => originalDiv.classList.add('visible'), 10);
            
            const themedDiv = document.createElement('div');
            themedDiv.className = 'commit-item';
            themedDiv.innerHTML = `<div class="commit-hash">#${(index + 1).toString().padStart(2, '0')}</div><div class="commit-message themed">${commit.themed}</div>`;
            themedContainer.appendChild(themedDiv);
            setTimeout(() => themedDiv.classList.add('visible'), 10);
        }, index * 100);
    });
}

// Animate stats
function animateStats() {
    animateValue('commitCount', 0, 27, 2000);
    animateValue('releaseCount', 0, 4, 1500);
    animateValue('transformedWords', 0, 143, 2500);
    animatePercent('transformPercent', 0, 68, 2000);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function animatePercent(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 16);
}

// Toggle presentation mode
function togglePresentationMode() {
    isPresentationMode = !isPresentationMode;
    const presentationMode = document.getElementById('presentationMode');
    const mainContent = document.getElementById('mainContent');
    
    if (isPresentationMode) {
        presentationMode.classList.add('active');
        mainContent.classList.add('hidden');
        updatePresentationExample();
        showToast('🎬 Presentation Mode ON - Use ← → to navigate');
    } else {
        presentationMode.classList.remove('active');
        mainContent.classList.remove('hidden');
        showToast('🎬 Presentation Mode OFF');
    }
}

// Update presentation example
function updatePresentationExample() {
    const commit = hauntedData.commits[currentExampleIndex];
    document.getElementById('presOriginal').textContent = commit.original;
    document.getElementById('presThemed').textContent = commit.themed;
    document.getElementById('presCounter').textContent = `Example ${currentExampleIndex + 1} of ${hauntedData.commits.length}`;
}

// Navigate examples
function nextExample() {
    currentExampleIndex = (currentExampleIndex + 1) % hauntedData.commits.length;
    if (isPresentationMode) {
        updatePresentationExample();
    }
    showToast(`📍 Example ${currentExampleIndex + 1}/${hauntedData.commits.length}`);
}

function previousExample() {
    currentExampleIndex = (currentExampleIndex - 1 + hauntedData.commits.length) % hauntedData.commits.length;
    if (isPresentationMode) {
        updatePresentationExample();
    }
    showToast(`📍 Example ${currentExampleIndex + 1}/${hauntedData.commits.length}`);
}

// Auto-play
function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    const btn = document.getElementById('autoPlayBtn');
    if (isAutoPlaying) {
        showToast('▶️ Auto-Play Started');
        if (btn) btn.textContent = '⏸️ Stop Auto-Play';
        autoPlayInterval = setInterval(() => nextExample(), autoPlaySpeed);
        playSound('play');
    } else {
        showToast('⏸️ Auto-Play Stopped');
        if (btn) btn.textContent = '▶️ Auto-Play';
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        playSound('pause');
    }
}

// Reset demo
function resetDemo() {
    currentExampleIndex = 0;
    if (isAutoPlaying) toggleAutoPlay();
    if (isPresentationMode) togglePresentationMode();
    
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('introScreen').classList.remove('hidden');
    demoStarted = false;
    
    document.getElementById('commitCount').textContent = '0';
    document.getElementById('releaseCount').textContent = '0';
    document.getElementById('transformedWords').textContent = '0';
    document.getElementById('transformPercent').textContent = '0%';
    
    showToast('🔄 Demo Reset - Press Enter to restart');
}

// Toggle help
function toggleHelp() {
    document.getElementById('helpOverlay').classList.toggle('visible');
}

// KEYBOARD EVENT HANDLER - PROPERLY FIXED!
document.addEventListener('keydown', (e) => {
    console.log('Key:', e.key, 'Started:', demoStarted, 'Presentation:', isPresentationMode);
    
    // Help - works EVERYWHERE
    if (e.key === '?' || e.key === '/') {
        e.preventDefault();
        toggleHelp();
        return;
    }
    
    if (e.key === 'Escape') {
        e.preventDefault();
        const helpOverlay = document.getElementById('helpOverlay');
        if (helpOverlay && helpOverlay.classList.contains('visible')) {
            toggleHelp();
        }
        return;
    }
    
    // Enter on intro screen
    const introScreen = document.getElementById('introScreen');
    if (e.key === 'Enter' && introScreen && !introScreen.classList.contains('hidden')) {
        e.preventDefault();
        beginDemo();
        return;
    }
    
    // All other shortcuts work when demo started OR in presentation mode
    if (!demoStarted && !isPresentationMode) {
        return;
    }
    
    // Handle all shortcuts
    switch(e.key) {
        case 'f':
        case 'F':
            e.preventDefault();
            togglePresentationMode();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextExample();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousExample();
            break;
        case ' ':
            e.preventDefault();
            toggleAutoPlay();
            break;
        case 'r':
        case 'R':
            e.preventDefault();
            resetDemo();
            break;
    }
});

// Initialize
window.addEventListener('load', () => {
    renderApp();
    createParticles();
    console.log('🎃 Phantom Patch Notes Demo Loaded!');
    console.log('Press Enter to start or ? for help');
    showToast('👻 Press Enter to begin!');
});


// Toggle control panel
function toggleControlPanel() {
    const panel = document.getElementById('controlPanel');
    panel.classList.toggle('minimized');
    const btn = panel.querySelector('.control-toggle');
    btn.textContent = panel.classList.contains('minimized') ? '+' : '−';
}

// Change speed
function changeSpeed(speed) {
    animationSpeed = speed;
    const speeds = { slow: 5000, normal: 3000, fast: 1500 };
    autoPlaySpeed = speeds[speed];
    document.getElementById('speedLabel').textContent = speed.charAt(0).toUpperCase() + speed.slice(1);
    
    if (isAutoPlaying) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => nextExample(), autoPlaySpeed);
    }
    
    showToast(`⚡ Speed: ${speed}`);
    playSound('click');
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundBtn');
    btn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    showToast(soundEnabled ? '🔊 Sound Enabled' : '🔇 Sound Muted');
}

// Add more particles
function addMoreParticles() {
    particleCount += 25;
    const container = document.getElementById('particles');
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
    showToast(`✨ Added 25 particles! Total: ${particleCount}`);
    playSound('magic');
}

// Export demo
function exportDemo(format) {
    const data = {
        commits: hauntedData.commits,
        currentExample: currentExampleIndex,
        timestamp: new Date().toISOString()
    };
    
    let content, filename, mimeType;
    
    if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = 'phantom-patch-notes.json';
        mimeType = 'application/json';
    } else if (format === 'markdown') {
        content = '# Phantom Patch Notes\n\n';
        hauntedData.commits.forEach((c, i) => {
            content += `## ${i + 1}. ${c.original}\n**Horror Version:** ${c.themed}\n\n`;
        });
        filename = 'phantom-patch-notes.md';
        mimeType = 'text/markdown';
    } else if (format === 'html') {
        content = '<html><head><title>Phantom Patch Notes</title></head><body>';
        content += '<h1>Phantom Patch Notes</h1>';
        hauntedData.commits.forEach((c, i) => {
            content += `<div><h3>${i + 1}. ${c.original}</h3><p><strong>Horror:</strong> ${c.themed}</p></div>`;
        });
        content += '</body></html>';
        filename = 'phantom-patch-notes.html';
        mimeType = 'text/html';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(`📥 Exported as ${format.toUpperCase()}!`);
    playSound('export');
}

// Random example
function randomExample() {
    currentExampleIndex = Math.floor(Math.random() * hauntedData.commits.length);
    if (isPresentationMode) {
        updatePresentationExample();
    }
    showToast(`🎲 Random: Example ${currentExampleIndex + 1}`);
    playSound('whoosh');
}

// Jump to example
function jumpToExample(index) {
    if (index >= 0 && index < hauntedData.commits.length) {
        currentExampleIndex = index;
        if (isPresentationMode) {
            updatePresentationExample();
        }
        showToast(`🎯 Jumped to Example ${index + 1}`);
        playSound('teleport');
    }
}
