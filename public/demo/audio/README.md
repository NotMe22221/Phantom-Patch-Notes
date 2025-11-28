# Demo Audio Assets

This directory contains audio files for the Kiroween demo sound system.

## Required Audio Files

The following audio files are required for the demo:

1. **ambient.mp3** - Ambient horror background music (looping)
   - Duration: 30-60 seconds
   - Volume: Low (0.3)
   - Loop: Yes
   - Description: Atmospheric horror background music with subtle tension

2. **generate.mp3** - Patch note generation sound effect
   - Duration: 1-2 seconds
   - Volume: Medium (0.6)
   - Loop: No
   - Description: Eerie sound effect when generating patch notes

3. **select.mp3** - Release selection sound effect
   - Duration: 0.5-1 second
   - Volume: Medium-Low (0.4)
   - Loop: No
   - Description: Subtle selection sound for timeline interactions

4. **hover.mp3** - Hover sound effect
   - Duration: 0.2-0.5 seconds
   - Volume: Low (0.2)
   - Loop: No
   - Description: Soft atmospheric sound for hover interactions

5. **export.mp3** - Export completion sound effect
   - Duration: 2-3 seconds
   - Volume: Medium-High (0.7)
   - Loop: No
   - Description: Dramatic sound effect for export completion

## Audio Format Requirements

- Format: MP3 (for broad browser compatibility)
- Sample Rate: 44.1 kHz recommended
- Bit Rate: 128-192 kbps
- Channels: Stereo or Mono

## Placeholder Files

For development and testing, you can use silent audio files or royalty-free sound effects.

### Creating Placeholder Silent Audio

You can create silent MP3 files using ffmpeg:

```bash
# Create 1 second of silence
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 -acodec libmp3lame silent.mp3
```

### Royalty-Free Sound Resources

- [Freesound.org](https://freesound.org/) - Creative Commons audio
- [Zapsplat.com](https://www.zapsplat.com/) - Free sound effects
- [Incompetech.com](https://incompetech.com/) - Royalty-free music

## Testing Without Audio

The Sound System is designed to gracefully degrade if audio files are missing. The demo will continue to function without audio, with errors logged to the console.
