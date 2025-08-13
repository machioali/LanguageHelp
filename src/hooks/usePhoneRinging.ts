'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface RingingState {
  isRinging: boolean;
  incomingCall: any | null;
}

export function usePhoneRinging() {
  const [ringingState, setRingingState] = useState<RingingState>({
    isRinging: false,
    incomingCall: null
  });
  
  const audioRef = useRef<HTMLAudioElement | { play: () => void } | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    // Create a more realistic and LOUD phone ringing sound using Web Audio API
    const createRingingTone = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playRingTone = () => {
        // Create multiple oscillators for a STRONG ring tone
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const oscillator3 = audioContext.createOscillator(); // Add third oscillator for power
        const gainNode = audioContext.createGain();
        const distortion = audioContext.createWaveShaper(); // Add distortion for urgency
        
        // Strong ring frequencies (traditional phone + harmonics)
        oscillator1.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator2.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 
        oscillator3.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        
        // Use sawtooth for more aggressive sound
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'square';
        oscillator3.type = 'triangle';
        
        // Create mild distortion curve for urgency
        const makeDistortionCurve = (amount: number) => {
          const samples = 44100;
          const curve = new Float32Array(samples);
          for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
          }
          return curve;
        };
        
        distortion.curve = makeDistortionCurve(2);
        distortion.oversample = '4x';
        
        // Connect oscillators to distortion and gain
        oscillator1.connect(distortion);
        oscillator2.connect(gainNode);
        oscillator3.connect(gainNode);
        distortion.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // MUCH LOUDER volume - this will be attention-grabbing
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.7, audioContext.currentTime + 0.1); // Increase to 0.7 (very loud)
        gainNode.gain.exponentialRampToValueAtTime(0.4, audioContext.currentTime + 0.4); // Sustain
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 1.2); // Longer ring
        
        // Start and stop the tones with longer duration
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator3.start(audioContext.currentTime + 0.1); // Slight delay for complexity
        
        oscillator1.stop(audioContext.currentTime + 1.2);
        oscillator2.stop(audioContext.currentTime + 1.2);
        oscillator3.stop(audioContext.currentTime + 1.2);
      };
      
      return playRingTone;
    };

    try {
      const ringToneGenerator = createRingingTone();
      
      // Create a wrapper function for the audio
      const playRing = () => {
        try {
          ringToneGenerator();
        } catch (error) {
          console.log('Could not play ring tone:', error);
        }
      };
      
      // Store in ref for cleanup
      (audioRef as any).current = { play: playRing };
    } catch (error) {
      console.log('Web Audio API not supported, falling back to HTML audio');
      // Fallback to HTML audio
      const audio = new Audio();
      // Create a data URL for a simple ring tone
      const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBDuM0fTQfC8Mj';
      audio.src = audioData;
      audio.loop = false;
      audioRef.current = audio;
    }
  }, []);

  const startRinging = useCallback((incomingCall: any) => {
    setRingingState({
      isRinging: true,
      incomingCall
    });

    // Start continuous ringing
    const playRingCycle = () => {
      if (audioRef.current) {
        try {
          // Use any to avoid TypeScript confusion between custom play function and HTMLAudioElement.play
          (audioRef.current as any).play();
        } catch (error) {
          console.log('Could not play ring sound:', error);
        }
      }
    };

    // Play immediately
    playRingCycle();

    // Then repeat every 2 seconds for a more urgent phone ring pattern
    ringIntervalRef.current = setInterval(playRingCycle, 2000);

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Incoming Call', {
        body: `${incomingCall.clientName} is calling for ${incomingCall.language} interpretation`,
        icon: '/phone-ring.png', // You can add an icon
        tag: 'incoming-call',
        requireInteraction: true,
      });
    }
  }, []);

  const stopRinging = useCallback(() => {
    setRingingState({
      isRinging: false,
      incomingCall: null
    });

    // Clear the ring interval
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }

    // Stop any currently playing audio
    if (audioRef.current && 'pause' in audioRef.current) {
      (audioRef.current as HTMLAudioElement).pause();
      (audioRef.current as HTMLAudioElement).currentTime = 0;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
      }
    };
  }, []);

  return {
    isRinging: ringingState.isRinging,
    incomingCall: ringingState.incomingCall,
    startRinging,
    stopRinging
  };
}
