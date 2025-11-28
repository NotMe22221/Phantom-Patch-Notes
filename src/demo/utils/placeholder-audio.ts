/**
 * Placeholder Audio Data
 * 
 * Provides minimal silent audio data URLs for testing the Sound System
 * without requiring actual audio files.
 */

/**
 * Minimal silent MP3 data (base64 encoded)
 * This is a very short silent MP3 file that can be used as a placeholder
 */
const SILENT_MP3_BASE64 = 
  'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4S/VWh6AAAAAAAAAAAAAAAAAAAAAP/7kGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';

/**
 * Create a data URL for a silent audio file
 */
export function createSilentAudioDataURL(): string {
  return `data:audio/mp3;base64,${SILENT_MP3_BASE64}`;
}

/**
 * Get placeholder audio URLs for all sound effects
 * These can be used for testing when actual audio files are not available
 */
export function getPlaceholderAudioURLs(): Record<string, string> {
  const silentURL = createSilentAudioDataURL();
  
  return {
    'ambient-background': silentURL,
    'generate-effect': silentURL,
    'select-effect': silentURL,
    'hover-effect': silentURL,
    'export-effect': silentURL
  };
}
