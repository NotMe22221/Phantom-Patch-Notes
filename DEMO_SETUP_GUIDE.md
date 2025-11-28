# Phantom Patch Notes - Demo Setup Guide

## 🎃 Kiroween Hackathon Demo

This guide will help you set up and run the Phantom Patch Notes demo for the Kiroween hackathon presentation.

---

## Table of Contents

1. [Pre-Presentation Checklist](#pre-presentation-checklist)
2. [Hardware Setup](#hardware-setup)
3. [Software Installation](#software-installation)
4. [Audio Setup and Testing](#audio-setup-and-testing)
5. [Running the Demo](#running-the-demo)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Presenter Notes](#presenter-notes)
8. [Troubleshooting](#troubleshooting)
9. [Fallback Plan](#fallback-plan)

---

## Pre-Presentation Checklist

Complete this checklist **at least 1 hour before** your presentation:

### Hardware
- [ ] Presentation laptop is fully charged
- [ ] Power adapter is connected and working
- [ ] HDMI/DisplayPort cable is available
- [ ] Audio cable or Bluetooth is configured
- [ ] Mouse/trackpad is working (backup for keyboard shortcuts)
- [ ] Presentation remote is tested (if using)

### Software
- [ ] Node.js v18+ is installed
- [ ] All dependencies are installed (`npm install`)
- [ ] Demo builds successfully (`npm run build`)
- [ ] Demo runs locally (`npm run demo`)
- [ ] Browser is updated to latest version

### Audio
- [ ] All 5 audio files are present in `/public/demo/audio/`
- [ ] Audio plays through speakers/projector
- [ ] Volume levels are tested and adjusted
- [ ] Backup audio device is available

### Display
- [ ] Projector connection is tested
- [ ] Display resolution is set correctly (1920x1080 recommended)
- [ ] Full-screen mode works properly
- [ ] Colors and contrast are visible from back of room

### Demo Content
- [ ] Haunted repository data loads correctly
- [ ] All 27 commits are visible
- [ ] Theme transformations are working
- [ ] Export functionality is tested
- [ ] Statistics display correctly

---

## Hardware Setup

### Presentation Laptop Requirements

**Minimum Specifications:**
- **CPU:** Intel i5 / AMD Ryzen 5 or better
- **RAM:** 8GB minimum, 16GB recommended
- **GPU:** Integrated graphics sufficient, dedicated GPU preferred
- **Display:** 1920x1080 resolution minimum
- **Audio:** Built-in speakers or external audio output
- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, or Edge 120+

### Display Configuration

1. **Connect to Projector/Display**
   - Use HDMI or DisplayPort for best quality
   - Avoid VGA if possible (color quality issues)
   - Test connection before presentation

2. **Set Display Mode**
   - **Recommended:** Mirror mode (same content on laptop and projector)
   - **Alternative:** Extended mode (demo on projector, notes on laptop)
   - Ensure projector is set as primary display if using extended mode

3. **Adjust Resolution**
   - Set to 1920x1080 for optimal display
   - If projector doesn't support 1080p, use 1280x720
   - Test that all UI elements are visible at chosen resolution

4. **Test Visibility**
   - View demo from back of presentation room
   - Ensure text is readable from furthest seat
   - Adjust font sizes if needed (presentation mode helps with this)

### Audio Configuration

1. **Choose Audio Output**
   - **Option A:** Projector/display audio (if available)
   - **Option B:** External speakers connected to laptop
   - **Option C:** Laptop built-in speakers (backup only)

2. **Test Audio Levels**
   - Play each sound effect to test volume
   - Ambient background should be subtle (30% volume)
   - Effect sounds should be clear but not jarring
   - Adjust system volume to 70-80% for optimal balance

3. **Backup Audio Device**
   - Have Bluetooth speaker as backup
   - Test Bluetooth connection before presentation
   - Ensure backup device is fully charged

---

## Software Installation

### Step 1: Install Node.js

**Windows:**
```bash
# Download from nodejs.org or use winget
winget install OpenJS.NodeJS.LTS
```

**macOS:**
```bash
# Using Homebrew
brew install node
```

**Linux:**
```bash
# Using apt (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# Using dnf (Fedora)
sudo dnf install nodejs npm
```

**Verify Installation:**
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher
```

### Step 2: Clone and Install Project

```bash
# Clone the repository
git clone https://github.com/your-org/phantom-patch-notes.git
cd phantom-patch-notes

# Install dependencies
npm install

# This may take 2-5 minutes depending on your connection
```

### Step 3: Build the Demo

```bash
# Build the demo application
npm run build

# This creates optimized production files in /dist
```

### Step 4: Verify Demo Works

```bash
# Start the demo server
npm run demo

# Open browser to http://localhost:3000
# You should see the intro screen
```

---

## Audio Setup and Testing

### Audio File Locations

All audio files must be placed in: `/public/demo/audio/`

**Required Files:**
1. `ambient.mp3` - Background atmospheric music (looping)
2. `generate.mp3` - Patch note generation sound effect
3. `select.mp3` - Release selection sound effect
4. `hover.mp3` - UI hover sound effect
5. `export.mp3` - Export completion sound effect

### Audio File Specifications

**Format:** MP3 (recommended) or OGG
**Bitrate:** 128kbps minimum, 192kbps recommended
**Sample Rate:** 44.1kHz
**Duration:**
- `ambient.mp3`: 30-60 seconds (will loop)
- Other effects: 0.5-2 seconds each

### Testing Audio

1. **Start the Demo**
   ```bash
   npm run demo
   ```

2. **Open Browser Console** (F12)
   - Look for audio loading messages
   - Check for any audio loading errors

3. **Test Each Sound**
   - **Ambient:** Should start playing on intro screen
   - **Generate:** Press Space to start auto-play, listen for generation sound
   - **Select:** Should play when release is selected
   - **Hover:** Hover over UI elements
   - **Export:** Complete demo to hear export sound

4. **Adjust Volumes**
   - Edit `/src/demo/config/demo-config.ts`
   - Modify `volume` values (0.0 to 1.0)
   - Rebuild and test again

### Audio Troubleshooting

**No Sound Playing:**
- Check browser console for errors
- Verify audio files exist in correct location
- Check system volume is not muted
- Try different browser (Chrome recommended)

**Audio Too Loud/Quiet:**
- Adjust individual volumes in `demo-config.ts`
- Adjust system volume
- Test in actual presentation room

**Audio Stuttering:**
- Close other applications
- Check CPU usage (should be < 50%)
- Reduce animation complexity if needed

---

## Running the Demo

### Starting the Demo

1. **Open Terminal/Command Prompt**
   ```bash
   cd phantom-patch-notes
   npm run demo
   ```

2. **Open Browser**
   - Navigate to: `http://localhost:3000`
   - **Recommended Browser:** Chrome or Edge
   - Ensure browser is in full-screen mode (F11)

3. **Wait for Intro Screen**
   - Logo should fade in with animation
   - Tagline appears: "Transform Git History into Horror Stories"
   - "Begin Demo" button glows
   - Ambient music starts playing

4. **Begin Presentation**
   - Click "Begin Demo" button or press Enter
   - Demo transitions to main interface
   - Haunted repository data loads automatically

### Demo Modes

**Manual Mode (Default):**
- You control each step with keyboard shortcuts
- Best for interactive presentations
- Allows you to pause and explain features

**Auto-Play Mode:**
- Press `Space` to start
- Demo runs automatically through all steps
- Best for hands-free demonstrations
- You can narrate while demo runs

**Presentation Mode:**
- Press `F` to toggle
- Enters full-screen with larger fonts
- Hides non-essential UI elements
- Optimized for projector visibility

---

## Keyboard Shortcuts

### Essential Shortcuts

| Key | Action | When to Use |
|-----|--------|-------------|
| `Space` | Toggle auto-play mode | Start/stop automated demo |
| `F` | Toggle presentation mode | Enter/exit full-screen |
| `→` | Next demo step | Advance manually |
| `←` | Previous demo step | Go back if needed |
| `R` | Reset demo | Start over from beginning |
| `?` | Show keyboard help | Display shortcut reference |
| `Esc` | Close help overlay | Hide shortcut reference |

### Detailed Shortcut Guide

**Space - Toggle Auto-Play**
- Starts automated demo sequence
- Press again to stop auto-play
- Useful for hands-free presentation
- Demo will progress through: Generate → Select → Scroll → Export

**F - Toggle Presentation Mode**
- Enters full-screen display
- Increases all font sizes by 50%
- Hides input fields and config options
- Shows theme showcase prominently
- Press again to exit presentation mode

**Right Arrow (→) - Next Step**
- Manually advance to next demo step
- Works even when auto-play is off
- Useful for paced presentation
- Steps: Intro → Generate → Select → View → Export → Complete

**Left Arrow (←) - Previous Step**
- Go back to previous demo step
- Useful if you need to repeat something
- Cannot go before first step

**R - Reset Demo**
- Returns to initial state
- Clears all generated content
- Resets to intro screen
- Useful for multiple demo runs

**? - Show Help**
- Displays keyboard shortcut overlay
- Shows all available shortcuts
- Useful for quick reference during demo

**Esc - Close Help**
- Hides the keyboard shortcut overlay
- Returns focus to demo

### Shortcut Tips

- **Practice shortcuts before presentation** - Muscle memory helps
- **Keep keyboard shortcut cheat sheet nearby** - Quick reference
- **Don't rely solely on shortcuts** - Mouse/trackpad as backup
- **Test shortcuts on presentation laptop** - Some keyboards differ
- **Avoid browser shortcuts** - Demo prevents conflicts, but be aware

---

## Presenter Notes

### Demo Flow and Timing

**Total Demo Duration:** 5-7 minutes (manual) or 3-4 minutes (auto-play)

#### 1. Introduction (30 seconds)
**What to Say:**
> "Welcome to Phantom Patch Notes - a tool that transforms boring git commit messages into spine-chilling horror stories. Let me show you how it works."

**What to Do:**
- Show intro screen
- Point out logo and tagline
- Click "Begin Demo" or press Enter

#### 2. Repository Loading (15 seconds)
**What to Say:**
> "We've pre-loaded a haunted repository with 27 commits across 4 releases. These commits represent typical development work - features, bug fixes, and breaking changes."

**What to Do:**
- Let haunted repository load
- Point out commit list if visible
- Mention the diversity of commit types

#### 3. Patch Note Generation (45 seconds)
**What to Say:**
> "Now watch as we transform these mundane commits into horror-themed patch notes. Notice how 'Add user authentication' becomes 'Summoned spectral guardians from the void'."

**What to Do:**
- Press Space to start auto-play OR manually trigger generation
- Let generation animation play
- Point out the transformation happening
- Listen for generation sound effect

#### 4. Theme Showcase (60 seconds)
**What to Say:**
> "Here's the magic - our theme engine analyzes each commit and replaces key words with horror vocabulary. Look at the side-by-side comparison showing original text on the left and themed version on the right."

**What to Do:**
- Point to theme showcase panel
- Highlight specific transformations
- Hover over themed text to show tooltips
- Explain the transformation logic

#### 5. Release Selection (30 seconds)
**What to Say:**
> "Let's select a release to see the full patch notes. Notice how the timeline animates and the release details cascade in."

**What to Do:**
- Select a release (auto-play does this automatically)
- Let cascade animation complete
- Point out the timeline visualization
- Listen for selection sound effect

#### 6. Statistics Display (45 seconds)
**What to Say:**
> "The statistics show us exactly what was transformed - we processed 27 commits, applied 143 horror-themed words, and transformed 68% of the text. These numbers count up in real-time."

**What to Do:**
- Point to statistics panel
- Let counter animation complete
- Hover over stats for detailed breakdown
- Explain the transformation percentage

#### 7. Export Functionality (45 seconds)
**What to Say:**
> "Finally, we can export these horror-themed patch notes in multiple formats - Markdown, HTML, or JSON. Watch the dramatic export animation with particle effects."

**What to Do:**
- Trigger export (auto-play does this automatically)
- Let export animation play
- Show format selection options
- Point out the glowing download button
- Listen for export sound effect

#### 8. Conclusion (30 seconds)
**What to Say:**
> "And that's Phantom Patch Notes - turning your git history into horror stories. Perfect for Halloween releases, themed documentation, or just having fun with your changelog. Questions?"

**What to Do:**
- Show completed export
- Offer to reset and show again if time permits
- Open for questions

### Presentation Tips

**Before You Start:**
- Arrive 15 minutes early to set up
- Test audio and display
- Have backup plan ready
- Practice keyboard shortcuts
- Know your talking points

**During Presentation:**
- Speak clearly and project voice
- Face the audience, not the screen
- Use keyboard shortcuts smoothly
- Don't rush through animations
- Pause for questions if appropriate

**If Something Goes Wrong:**
- Stay calm and professional
- Use fallback plan if needed
- Explain what should be happening
- Have screenshots as backup
- Humor helps ("Even our demo is haunted!")

**Engagement Tips:**
- Ask audience about their changelog pain points
- Show enthusiasm for the horror theme
- Invite questions throughout
- Offer to show specific features
- Share repository link for them to try

### Timing Variations

**Quick Demo (2-3 minutes):**
- Use auto-play mode
- Skip detailed explanations
- Focus on visual impact
- Show only key features

**Standard Demo (5-7 minutes):**
- Use manual mode
- Explain each feature
- Show theme showcase
- Display statistics
- Complete full export

**Extended Demo (10-12 minutes):**
- Use manual mode
- Deep dive into transformations
- Show multiple releases
- Explain technical details
- Take questions throughout
- Show code if interested

---

## Troubleshooting

### Common Issues and Solutions

#### Demo Won't Start

**Symptoms:**
- Browser shows blank page
- "Cannot connect" error
- Server won't start

**Solutions:**
1. Check if port 3000 is already in use:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```

2. Kill process using port 3000 or use different port:
   ```bash
   # Use different port
   PORT=3001 npm run demo
   ```

3. Rebuild the project:
   ```bash
   npm run clean
   npm install
   npm run build
   npm run demo
   ```

4. Check Node.js version:
   ```bash
   node --version  # Must be v18+
   ```

#### No Audio Playing

**Symptoms:**
- Animations work but no sound
- Console shows audio loading errors
- Muted icon appears

**Solutions:**
1. Check audio files exist:
   ```bash
   ls public/demo/audio/
   # Should show: ambient.mp3, generate.mp3, select.mp3, hover.mp3, export.mp3
   ```

2. Check browser console (F12) for errors

3. Try different browser (Chrome recommended)

4. Check system volume and browser audio permissions

5. Disable audio in config if files are missing:
   ```typescript
   // In demo-config.ts
   export const audioEnabled = false;
   ```

#### Animations Are Choppy

**Symptoms:**
- Stuttering animations
- Low frame rate
- Delayed responses

**Solutions:**
1. Close other applications to free up CPU/RAM

2. Disable animations in config:
   ```typescript
   // In demo-config.ts
   export const animationsEnabled = false;
   ```

3. Use simpler animations:
   ```typescript
   // In demo-config.ts
   export const animationComplexity = 'low';
   ```

4. Check CPU usage (should be < 70% during demo)

5. Try different browser (Chrome has best performance)

#### Presentation Mode Not Working

**Symptoms:**
- F key doesn't enter full-screen
- Fonts don't scale
- Elements don't hide

**Solutions:**
1. Check if browser supports Full-Screen API:
   - Chrome: Yes
   - Firefox: Yes
   - Safari: Yes (may need permission)
   - Edge: Yes

2. Try manual full-screen (F11 key)

3. Check browser permissions for full-screen

4. Use maximized window as fallback

#### Keyboard Shortcuts Not Working

**Symptoms:**
- Keys don't trigger actions
- Wrong actions triggered
- Shortcuts conflict with browser

**Solutions:**
1. Ensure focus is on demo window (click on page)

2. Check if typing in input field (shortcuts disabled in inputs)

3. Try different browser

4. Use mouse/trackpad as backup

5. Check keyboard layout (US layout recommended)

#### Haunted Repository Not Loading

**Symptoms:**
- No commits shown
- Empty timeline
- Loading spinner forever

**Solutions:**
1. Check browser console for errors

2. Verify haunted repo data in config:
   ```bash
   # Check file exists
   ls src/demo/config/demo-config.ts
   ```

3. Rebuild project:
   ```bash
   npm run build
   ```

4. Use preview mode as fallback:
   ```typescript
   // In demo-config.ts
   export const usePreviewMode = true;
   ```

#### Display Issues on Projector

**Symptoms:**
- Text too small
- Colors washed out
- UI elements cut off

**Solutions:**
1. Enter presentation mode (F key) - increases font sizes

2. Adjust projector settings:
   - Increase brightness
   - Adjust contrast
   - Check color mode (vivid/presentation mode)

3. Change display resolution:
   - Try 1280x720 if 1080p doesn't work
   - Ensure aspect ratio is 16:9

4. Use browser zoom (Ctrl/Cmd + +)

#### Export Not Working

**Symptoms:**
- Export button doesn't respond
- No download triggered
- Error in console

**Solutions:**
1. Check browser console for errors

2. Verify export functionality:
   ```bash
   # Test export in development
   npm run test src/server/core/export.test.ts
   ```

3. Try different export format (Markdown, HTML, JSON)

4. Check browser download permissions

5. Use manual export as fallback (copy/paste from UI)

---

## Fallback Plan

### If Technical Issues Occur

**Level 1: Minor Issues**
- Audio not working → Continue without audio, explain what sounds would play
- Animations choppy → Disable animations, focus on content
- Keyboard shortcuts not working → Use mouse/trackpad

**Level 2: Moderate Issues**
- Demo won't start → Use pre-recorded video (see below)
- Display issues → Use laptop screen, gather audience closer
- Export not working → Show pre-exported examples

**Level 3: Critical Issues**
- Complete system failure → Use static screenshots
- No internet/power → Use printed handouts
- Projector failure → Laptop screen demo for small group

### Pre-Recorded Video Backup

**Create Before Presentation:**
1. Record full demo run using screen recording software
2. Include audio narration
3. Export as MP4 (1920x1080, 30fps)
4. Test video plays on presentation laptop
5. Have video ready to play if live demo fails

**Recording Tools:**
- **Windows:** Xbox Game Bar (Win + G)
- **macOS:** QuickTime Player (Cmd + Shift + 5)
- **Linux:** OBS Studio
- **Cross-platform:** OBS Studio, Loom

### Static Screenshot Backup

**Prepare Screenshots:**
1. Intro screen with logo and tagline
2. Haunted repository commit list
3. Patch note generation in progress
4. Theme showcase with transformations
5. Statistics display with numbers
6. Export options and download button
7. Final exported patch notes

**Save as:**
- Format: PNG
- Resolution: 1920x1080
- Location: `/demo-backup/screenshots/`

### Printed Handouts

**Prepare Handouts:**
1. One-page overview of Phantom Patch Notes
2. Example transformations (before/after)
3. Key features list
4. Repository link and QR code
5. Contact information

**Print:**
- 20-30 copies
- Color if possible
- Bring to presentation

### Explanation-Only Fallback

**If All Else Fails:**
- Explain concept verbally
- Draw diagrams on whiteboard
- Show code on laptop screen
- Discuss technical approach
- Answer questions
- Share repository link for later exploration

### Emergency Contacts

**Technical Support:**
- Team member 1: [Phone number]
- Team member 2: [Phone number]
- IT support: [Phone number]

**Venue Support:**
- AV technician: [Phone number]
- Venue coordinator: [Phone number]

---

## Additional Resources

### Demo Files Location

```
phantom-patch-notes/
├── public/demo/audio/          # Audio files
├── src/demo/                   # Demo source code
├── src/demo/config/            # Demo configuration
├── DEMO_SETUP_GUIDE.md         # This file
├── KEYBOARD_SHORTCUTS.md       # Quick reference
└── PRESENTER_NOTES.md          # Detailed presenter guide
```

### Useful Commands

```bash
# Start demo
npm run demo

# Build demo
npm run build

# Run tests
npm test

# Clean and rebuild
npm run clean && npm install && npm run build

# Check for errors
npm run lint

# Start in different port
PORT=3001 npm run demo
```

### Links and Documentation

- **Repository:** https://github.com/your-org/phantom-patch-notes
- **Full Documentation:** `/docs/README.md`
- **API Documentation:** `/docs/API.md`
- **Theme Documentation:** `/docs/THEMES.md`
- **Contributing Guide:** `/CONTRIBUTING.md`

---

## Post-Presentation

### After Your Demo

1. **Gather Feedback**
   - Note what worked well
   - Note what could be improved
   - Collect audience questions

2. **Share Resources**
   - Send repository link to interested attendees
   - Share demo video if recorded
   - Provide contact information

3. **Clean Up**
   - Stop demo server (Ctrl+C)
   - Close browser windows
   - Disconnect from projector
   - Pack up equipment

4. **Document Issues**
   - Note any technical problems
   - Record solutions that worked
   - Update this guide with improvements

---

## Questions?

If you have questions about the demo setup:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [FAQ](./FAQ.md)
3. Contact the development team
4. Open an issue on GitHub

---

**Good luck with your presentation! 🎃👻**

*Remember: Even if something goes wrong, stay calm and professional. The audience is interested in the concept, not perfect execution.*
