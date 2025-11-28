/**
 * Sound System Component
 * 
 * Manages audio playback for atmospheric effects during the demo.
 * Implements Web Audio API with HTML5 audio fallback for browser compatibility.
 * Handles audio preloading, playback control, volume management, and error handling.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 * Performance optimizations: Task 14 - Optimized audio loading and playback
 */

import type { SoundSystem as ISoundSystem, SoundId, AudioAsset } from '../types/demo-types';

/**
 * Sound System Implementation
 * Provides atmospheric audio effects for the demo experience
 */
export class SoundSystem implements ISoundSystem {
  private audioContext: AudioContext | null = null;
  private audioElements: Map<SoundId, HTMLAudioElement> = new Map();
  private audioBuffers: Map<SoundId, AudioBuffer> = new Map();
  private activeNodes: Map<SoundId, AudioBufferSourceNode> = new Map();
  private assets: AudioAsset[];
  private masterVolume: number = 1.0;
  private isMuted: boolean = false;
  private useWebAudio: boolean = true;
  private initialized: boolean = false;

  constructor(assets: AudioAsset[]) {
    this.assets = assets;
    
    // Check if Web Audio API is available
    this.useWebAudio = typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
  }

  /**
   * Initialize the sound system and preload all audio assets
   * Requirements: 2.1
   * Performance optimized: Parallel loading with timeout
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Use Promise.race to timeout if loading takes too long
      const initPromise = this.useWebAudio 
        ? this.initializeWebAudio() 
        : this.initializeHTML5Audio();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Audio initialization timeout')), 5000)
      );

      await Promise.race([initPromise, timeoutPromise]);
      
      this.initialized = true;
      console.log('🔊 Sound System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sound System:', error);
      // Gracefully degrade - continue without audio
      this.initialized = true;
    }
  }

  /**
   * Initialize Web Audio API and preload audio buffers
   * Performance optimized: Parallel loading with priority
   */
  private async initializeWebAudio(): Promise<void> {
    // Create AudioContext
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();

    // Prioritize non-looping sounds (they're likely to be used first)
    const priorityAssets = this.assets.filter(a => !a.loop);
    const backgroundAssets = this.assets.filter(a => a.loop);

    // Load priority assets first
    const priorityPromises = priorityAssets.map(asset => this.loadAudioBuffer(asset));
    await Promise.allSettled(priorityPromises);

    // Load background assets in parallel (don't wait)
    backgroundAssets.forEach(asset => this.loadAudioBuffer(asset));
  }

  /**
   * Load an audio buffer for Web Audio API
   */
  private async loadAudioBuffer(asset: AudioAsset): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    try {
      const response = await fetch(asset.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(asset.id, audioBuffer);
      console.log(`✓ Loaded audio: ${asset.id}`);
    } catch (error) {
      console.error(`Failed to load audio asset ${asset.id}:`, error);
      // Continue without this audio file
    }
  }

  /**
   * Initialize HTML5 Audio elements as fallback
   */
  private async initializeHTML5Audio(): Promise<void> {
    const loadPromises = this.assets.map(asset => this.loadHTML5Audio(asset));
    await Promise.allSettled(loadPromises);
  }

  /**
   * Load an HTML5 Audio element
   */
  private async loadHTML5Audio(asset: AudioAsset): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = asset.url;
      audio.volume = asset.volume * this.masterVolume;
      audio.loop = asset.loop;
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.audioElements.set(asset.id, audio);
        console.log(`✓ Loaded audio: ${asset.id}`);
        resolve();
      }, { once: true });

      audio.addEventListener('error', (error) => {
        console.error(`Failed to load audio asset ${asset.id}:`, error);
        // Continue without this audio file
        resolve();
      }, { once: true });

      // Start loading
      audio.load();
    });
  }

  /**
   * Play a sound effect
   * Requirements: 2.2, 2.3, 2.4, 2.5
   */
  play(soundId: SoundId): void {
    if (!this.initialized) {
      console.warn('Sound System not initialized');
      return;
    }

    if (this.isMuted) {
      return;
    }

    try {
      if (this.useWebAudio && this.audioContext) {
        this.playWebAudio(soundId);
      } else {
        this.playHTML5Audio(soundId);
      }
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
    }
  }

  /**
   * Play sound using Web Audio API
   */
  private playWebAudio(soundId: SoundId): void {
    if (!this.audioContext) {
      return;
    }

    const buffer = this.audioBuffers.get(soundId);
    if (!buffer) {
      console.warn(`Audio buffer not found: ${soundId}`);
      return;
    }

    const asset = this.assets.find(a => a.id === soundId);
    if (!asset) {
      return;
    }

    // Stop existing playback if any
    this.stopWebAudio(soundId);

    // Create source node
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = asset.loop;

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = asset.volume * this.masterVolume;

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Store reference
    this.activeNodes.set(soundId, source);

    // Clean up when finished
    source.onended = () => {
      this.activeNodes.delete(soundId);
    };

    // Start playback
    source.start(0);
  }

  /**
   * Play sound using HTML5 Audio
   */
  private playHTML5Audio(soundId: SoundId): void {
    const audio = this.audioElements.get(soundId);
    if (!audio) {
      console.warn(`Audio element not found: ${soundId}`);
      return;
    }

    // Reset to beginning if already playing
    audio.currentTime = 0;
    
    // Play the audio
    const playPromise = audio.play();
    
    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Failed to play audio ${soundId}:`, error);
      });
    }
  }

  /**
   * Stop a sound effect
   */
  stop(soundId: SoundId): void {
    if (!this.initialized) {
      return;
    }

    try {
      if (this.useWebAudio) {
        this.stopWebAudio(soundId);
      } else {
        this.stopHTML5Audio(soundId);
      }
    } catch (error) {
      console.error(`Failed to stop sound ${soundId}:`, error);
    }
  }

  /**
   * Stop Web Audio playback
   */
  private stopWebAudio(soundId: SoundId): void {
    const node = this.activeNodes.get(soundId);
    if (node) {
      try {
        node.stop();
      } catch (error) {
        // Node may already be stopped
      }
      this.activeNodes.delete(soundId);
    }
  }

  /**
   * Stop HTML5 Audio playback
   */
  private stopHTML5Audio(soundId: SoundId): void {
    const audio = this.audioElements.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    // Clamp volume between 0 and 1
    this.masterVolume = Math.max(0, Math.min(1, volume));

    // Update all HTML5 audio elements
    this.audioElements.forEach((audio, soundId) => {
      const asset = this.assets.find(a => a.id === soundId);
      if (asset) {
        audio.volume = asset.volume * this.masterVolume;
      }
    });

    // Web Audio volume is applied per-playback via gain nodes
  }

  /**
   * Mute all sounds
   */
  mute(): void {
    this.isMuted = true;

    // Stop all currently playing sounds
    if (this.useWebAudio) {
      this.activeNodes.forEach((node, soundId) => {
        this.stopWebAudio(soundId);
      });
    } else {
      this.audioElements.forEach((audio) => {
        audio.pause();
      });
    }
  }

  /**
   * Unmute sounds
   */
  unmute(): void {
    this.isMuted = false;
  }

  /**
   * Check if sound system is muted
   */
  isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Get current master volume
   */
  getVolume(): number {
    return this.masterVolume;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Stop all sounds
    if (this.useWebAudio) {
      this.activeNodes.forEach((node, soundId) => {
        this.stopWebAudio(soundId);
      });
      this.activeNodes.clear();
      
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    } else {
      this.audioElements.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      this.audioElements.clear();
    }

    this.audioBuffers.clear();
    this.initialized = false;
  }
}
