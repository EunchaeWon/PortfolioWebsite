"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "eunchae-portfolio-sound";
type SiteAudioTheme = "main" | "projects" | "world";

class SiteAudioEngine {
  private cassetteBuffer: AudioBuffer | null = null;
  private cassetteLoading: Promise<void> | null = null;

  preloadCassette() {
    if (this.cassetteLoading) return this.cassetteLoading;
    const context = this.getContext();
    if (!context) return Promise.resolve();
    this.cassetteLoading = fetch("/umatic-insert.mp3")
      .then((response) => {
        if (!response.ok) throw new Error("Cassette sound unavailable");
        return response.arrayBuffer();
      })
      .then((bytes) => context.decodeAudioData(bytes))
      .then((buffer) => { if (!this.disposed) this.cassetteBuffer = buffer; })
      .catch(() => { this.cassetteLoading = null; });
    return this.cassetteLoading;
  }
  private effects = new Set<AudioNode[]>();

  private retainEffect(source: AudioScheduledSourceNode, nodes: AudioNode[]) {
    this.effects.add(nodes);
    source.onended = () => {
      for (const node of nodes) node.disconnect();
      this.effects.delete(nodes);
      source.onended = null;
    };
  }
  private enabled = false;
  private disposed = false;
  onStateChange?: (running: boolean) => void;

  get running() { return !this.disposed && this.context?.state === "running"; }
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: AudioBufferSourceNode | null = null;
  private mainAmbienceGain: GainNode | null = null;
  private projectsAmbience: AudioBufferSourceNode | null = null;
  private projectsHum: OscillatorNode | null = null;
  private projectsWarble: OscillatorNode | null = null;
  private projectsAmbienceGain: GainNode | null = null;
  private worldAmbience: AudioBufferSourceNode | null = null;
  private worldDrone: OscillatorNode | null = null;
  private worldOvertone: OscillatorNode | null = null;
  private worldPulse: OscillatorNode | null = null;
  private worldBreath: AudioBufferSourceNode | null = null;
  private worldSpaceSources: OscillatorNode[] = [];
  private worldAmbienceGain: GainNode | null = null;
  private monitorNoise: AudioBufferSourceNode | null = null;
  private monitorNoiseGain: GainNode | null = null;
  private theme: SiteAudioTheme = "main";

  private getContext() {
    if (this.disposed) return null;
    if (this.context) return this.context;

    const AudioContextConstructor = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) return null;

    this.context = new AudioContextConstructor();
    this.context.onstatechange = () => this.onStateChange?.(this.running);
    this.master = this.context.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.context.destination);
    return this.context;
  }

  async unlock() {
    const context = this.getContext();
    if (!context) return false;
    try {
      if (context.state !== "running") await context.resume();
    } catch {
      return false;
    }
    if (!this.running) return false;
    if (!this.ambience) {
      this.startAmbience();
      this.applyTheme();
    }
    return true;
  }

  setEnabled(enabled: boolean, immediate = false) {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;
    if (this.enabled === enabled && !immediate) return;
    this.enabled = enabled;
    this.holdGain(master.gain);
    if (immediate) master.gain.setValueAtTime(enabled ? 0.95 : 0, context.currentTime);
    else master.gain.setTargetAtTime(enabled ? 0.95 : 0, context.currentTime, enabled ? 0.08 : 0.035);
  }

  private holdGain(param: AudioParam) {
    const time = this.context!.currentTime;
    // Preserve the in-flight fade instead of resetting its automation timeline.
    if (typeof param.cancelAndHoldAtTime === "function") param.cancelAndHoldAtTime(time);
    else {
      const value = param.value;
      param.cancelScheduledValues(time);
      param.setValueAtTime(value, time);
    }
  }

  private startAmbience() {
    const context = this.context;
    const master = this.master;
    if (!context || !master || this.ambience) return;

    const frameCount = context.sampleRate * 3;
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = buffer.getChannelData(0);
    let drift = 0;

    for (let index = 0; index < frameCount; index += 1) {
      const white = Math.random() * 2 - 1;
      drift = drift * 0.72 + white * 0.28;
      samples[index] = white * 0.48 + drift * 0.52;
    }

    const source = context.createBufferSource();
    const highPass = context.createBiquadFilter();
    const lowPass = context.createBiquadFilter();
    const staticGain = context.createGain();

    source.buffer = buffer;
    source.loop = true;
    highPass.type = "highpass";
    highPass.frequency.value = 190;
    lowPass.type = "lowpass";
    lowPass.frequency.value = 5400;
    staticGain.gain.value = 0;

    source.connect(highPass);
    highPass.connect(lowPass);
    lowPass.connect(staticGain);
    source.start();
    this.ambience = source;
    this.mainAmbienceGain = staticGain;

    // Whole-second loop boundaries avoid fractional-frame resampling at the seam.
    const tapeBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const tapeSamples = tapeBuffer.getChannelData(0);
    let tapeMemory = 0;
    for (let index = 0; index < tapeSamples.length; index += 1) {
      const white = Math.random() * 2 - 1;
      tapeMemory = tapeMemory * 0.78 + white * 0.22;
      tapeSamples[index] = tapeMemory * 0.9;
    }
    const tapeSource = context.createBufferSource();
    const tapeHighPass = context.createBiquadFilter();
    const tapeLowPass = context.createBiquadFilter();
    const tapeGroup = context.createGain();
    const tapeHum = context.createOscillator();
    const tapeHumGain = context.createGain();
    const tapeWarble = context.createOscillator();
    const tapeWarbleDepth = context.createGain();
    tapeSource.buffer = tapeBuffer;
    tapeSource.loop = true;
    tapeHighPass.type = "highpass";
    tapeHighPass.frequency.value = 160;
    tapeHighPass.Q.value = 0.5;
    tapeLowPass.type = "lowpass";
    tapeLowPass.frequency.value = 1800;
    tapeLowPass.Q.value = 0.5;
    tapeGroup.gain.value = 0;
    tapeHum.type = "triangle";
    tapeHum.frequency.value = 57;
    tapeHumGain.gain.value = 0.08;
    tapeWarble.frequency.value = 0.21;
    tapeWarbleDepth.gain.value = 0.9;
    tapeSource.connect(tapeHighPass);
    tapeHighPass.connect(tapeLowPass);
    tapeLowPass.connect(tapeGroup);
    tapeHum.connect(tapeHumGain);
    tapeHumGain.connect(tapeGroup);
    tapeWarble.connect(tapeWarbleDepth);
    tapeWarbleDepth.connect(tapeHum.frequency);
    tapeSource.start();
    tapeHum.start();
    tapeWarble.start();
    this.projectsAmbience = tapeSource;
    this.projectsHum = tapeHum;
    this.projectsWarble = tapeWarble;
    this.projectsAmbienceGain = tapeGroup;

    const worldBuffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
    const worldSamples = worldBuffer.getChannelData(0);
    let caveDrift = 0;
    for (let index = 0; index < worldSamples.length; index += 1) {
      caveDrift = caveDrift * 0.965 + (Math.random() * 2 - 1) * 0.035;
      worldSamples[index] = caveDrift;
    }
    const worldSource = context.createBufferSource();
    const worldLowPass = context.createBiquadFilter();
    const worldGroup = context.createGain();
    const worldDrone = context.createOscillator();
    const worldDroneGain = context.createGain();
    const worldOvertone = context.createOscillator();
    const worldOvertoneGain = context.createGain();
    const worldPulse = context.createOscillator();
    const worldPulseDepth = context.createGain();
    worldSource.buffer = worldBuffer;
    worldSource.loop = true;
    worldLowPass.type = "lowpass";
    worldLowPass.frequency.value = 760;
    worldLowPass.Q.value = 0.72;
    worldGroup.gain.value = 0;
    worldDrone.type = "sine";
    worldDrone.frequency.value = 43;
    worldDroneGain.gain.value = 0.24;
    worldOvertone.type = "triangle";
    worldOvertone.frequency.value = 71;
    worldOvertoneGain.gain.value = 0.06;
    worldPulse.frequency.value = 0.13;
    worldPulseDepth.gain.value = 1.6;
    worldSource.connect(worldLowPass);
    worldLowPass.connect(worldGroup);
    worldDrone.connect(worldDroneGain);
    worldDroneGain.connect(worldGroup);
    worldOvertone.connect(worldOvertoneGain);
    worldOvertoneGain.connect(worldGroup);
    worldPulse.connect(worldPulseDepth);
    worldPulseDepth.connect(worldOvertone.frequency);
    worldSource.start();
    worldDrone.start();
    worldOvertone.start();
    worldPulse.start();
    this.worldAmbience = worldSource;
    this.worldDrone = worldDrone;
    this.worldOvertone = worldOvertone;
    this.worldPulse = worldPulse;
    this.worldAmbienceGain = worldGroup;

    // Slow, detuned space hum: audible low-mid harmonics above the sub drone.
    const spaceGain = context.createGain();
    spaceGain.gain.value = 0.15;
    const spaceFilter = context.createBiquadFilter();
    spaceFilter.type = "lowpass";
    spaceFilter.frequency.value = 420;
    spaceFilter.Q.value = 0.6;
    spaceFilter.connect(spaceGain);
    spaceGain.connect(worldGroup);
    for (const frequency of [108, 108.7, 162]) {
      const voice = context.createOscillator();
      voice.type = "sine";
      voice.frequency.value = frequency;
      voice.connect(spaceFilter);
      voice.start();
      this.worldSpaceSources.push(voice);
    }
    const swell = context.createOscillator();
    const swellDepth = context.createGain();
    swell.frequency.value = 0.075;
    swellDepth.gain.value = 0.065;
    swell.connect(swellDepth);
    swellDepth.connect(spaceGain.gain);
    swell.start();
    this.worldSpaceSources.push(swell);

    // Soft inhalation / exhalation, with a pause between six-second breaths.
    // Keep an integer-duration loop and route it through the World-only bus.
    const breathBuffer = context.createBuffer(1, context.sampleRate * 6, context.sampleRate);
    const breathSamples = breathBuffer.getChannelData(0);
    let breathMemory = 0;
    for (let index = 0; index < breathSamples.length; index += 1) {
      const time = index / context.sampleRate;
      const inhale = time < 1.8 ? Math.sin(Math.PI * time / 1.8) ** 2 : 0;
      const exhale = time > 2.2 && time < 5.2 ? Math.sin(Math.PI * (time - 2.2) / 3) ** 2 : 0;
      breathMemory = breathMemory * 0.65 + (Math.random() * 2 - 1) * 0.35;
      breathSamples[index] = breathMemory * (inhale * 0.65 + exhale * 0.85);
    }
    const breath = context.createBufferSource();
    const breathFilter = context.createBiquadFilter();
    breath.buffer = breathBuffer;
    breath.loop = true;
    breathFilter.type = "lowpass";
    breathFilter.frequency.value = 1250;
    breathFilter.Q.value = 0.5;
    breath.connect(breathFilter);
    breathFilter.connect(worldGroup);
    breath.start();
    this.worldBreath = breath;

    const monitorBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const monitorSamples = monitorBuffer.getChannelData(0);
    let monitorDrift = 0;
    for (let index = 0; index < monitorSamples.length; index += 1) {
      const interference = Math.sin(index / 17) * 0.14 + Math.sin(index / 43) * 0.09;
      const white = Math.random() * 2 - 1;
      monitorDrift = monitorDrift * 0.72 + white * 0.28;
      monitorSamples[index] = monitorDrift * 0.82 + interference * 0.18;
    }

    const monitorSource = context.createBufferSource();
    const monitorHighPass = context.createBiquadFilter();
    const monitorLowPass = context.createBiquadFilter();
    const monitorGain = context.createGain();
    monitorSource.buffer = monitorBuffer;
    monitorSource.loop = true;
    monitorHighPass.type = "highpass";
    monitorHighPass.frequency.value = 220;
    monitorLowPass.type = "lowpass";
    monitorLowPass.frequency.value = 1900;
    monitorGain.gain.value = 0;
    monitorSource.connect(monitorHighPass);
    monitorHighPass.connect(monitorLowPass);
    monitorLowPass.connect(monitorGain);
    monitorSource.start();
    this.monitorNoise = monitorSource;
    this.monitorNoiseGain = monitorGain;
  }

  setTheme(theme: SiteAudioTheme) {
    if (this.theme === theme) return;
    this.theme = theme;
    this.applyTheme();
  }

  private applyTheme() {
    const context = this.context;
    if (!context) return;
    const levels = {
      main: [0.0136, 0, 0],
      projects: [0, 0.016, 0],
      world: [0, 0, 0.052],
    }[this.theme];
    const gains = [this.mainAmbienceGain, this.projectsAmbienceGain, this.worldAmbienceGain];
    gains.forEach((gain, index) => {
      if (!gain) return;
      gain.disconnect();
      if (levels[index] === 0) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.value = 0;
        return;
      }
      gain.connect(this.master!);
      this.holdGain(gain.gain);
      gain.gain.setTargetAtTime(levels[index], context.currentTime, 0.18);
    });
  }

  setMonitorNoise(active: boolean) {
    const context = this.context;
    const gain = this.monitorNoiseGain;
    if (!context || !gain) return;
    gain.disconnect();
    if (active) gain.connect(this.master!);
    this.holdGain(gain.gain);
    gain.gain.setTargetAtTime(active ? 0.032 : 0, context.currentTime, active ? 0.055 : 0.075);
  }

  private tone(
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    delay = 0,
    endFrequency = frequency,
  ) {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(master);
    this.retainEffect(oscillator, [oscillator, gain]);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private noise(duration: number, volume: number, delay = 0, lowPassFrequency = 3600) {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < frameCount; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * (1 - index / frameCount);
    }

    const source = context.createBufferSource();
    const lowPass = context.createBiquadFilter();
    const gain = context.createGain();
    const start = context.currentTime + delay;

    source.buffer = buffer;
    lowPass.type = "lowpass";
    lowPass.frequency.value = lowPassFrequency;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(lowPass);
    lowPass.connect(gain);
    gain.connect(master);
    this.retainEffect(source, [source, lowPass, gain]);
    source.start(start);
    source.stop(start + duration);
  }

  private cassetteMotor(delay: number, duration: number) {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;

    const start = context.currentTime + delay;
    const end = start + duration;
    const motor = context.createOscillator();
    const motorGain = context.createGain();
    const wobble = context.createOscillator();
    const wobbleDepth = context.createGain();

    motor.type = "triangle";
    motor.frequency.setValueAtTime(32, start);
    motor.frequency.exponentialRampToValueAtTime(28, end);
    wobble.type = "sine";
    wobble.frequency.value = 4.8;
    wobbleDepth.gain.value = 0.7;
    motorGain.gain.setValueAtTime(0.0001, start);
    motorGain.gain.exponentialRampToValueAtTime(0.026, start + 0.09);
    motorGain.gain.setValueAtTime(0.022, end - 0.16);
    motorGain.gain.exponentialRampToValueAtTime(0.0001, end);
    wobble.connect(wobbleDepth);
    wobbleDepth.connect(motor.frequency);
    motor.connect(motorGain);
    motorGain.connect(master);
    this.retainEffect(motor, [motor, motorGain, wobble, wobbleDepth]);
    motor.start(start);
    wobble.start(start);
    motor.stop(end + 0.02);
    wobble.stop(end + 0.02);
  }

  playClick() {
    this.tone(520, 0.035, 0.05, "square", 0, 210);
    this.noise(0.025, 0.045, 0, 2400);
  }

  playHover(kind: "standard" | "cassette" | "video") {
    if (kind === "cassette") {
      this.noise(0.018, 0.055, 0, 850);
      this.tone(130, 0.018, 0.026, "triangle", 0, 75);
      return;
    }

    if (kind === "video") {
      this.tone(160, 0.019, 0.03, "triangle", 0, 85);
      this.noise(0.013, 0.0264, 0, 1000);
      return;
    }

    this.tone(140, 0.018, 0.03, "triangle", 0, 76);
    this.noise(0.012, 0.0264, 0, 900);
  }

  playSwitch(turningOn: boolean) {
    this.noise(0.065, 0.12, 0, 1700);
    this.tone(turningOn ? 145 : 110, 0.08, 0.09, "square", 0, turningOn ? 230 : 70);
    this.tone(680, 0.025, 0.035, "triangle", 0.052, 420);
  }

  playCassetteInsert() {
    if (!this.cassetteBuffer) {
      void this.preloadCassette().then(() => {
        if (this.cassetteBuffer && this.enabled && this.running) this.playCassetteInsert();
      });
      return;
    }
    const context = this.context;
    if (!context || !this.master || !this.running) return;
    const start = context.currentTime;
    const split = 0.08;
    for (const [delay, offset, duration] of [
      [0, 0, split],
      [split + 2, split, Math.min(2.5, this.cassetteBuffer.duration) - split],
    ]) {
      const source = context.createBufferSource();
      source.buffer = this.cassetteBuffer;
      const gain = context.createGain();
      gain.gain.setValueAtTime(offset > 0 ? 0 : 1, start + delay);
      if (offset > 0) gain.gain.linearRampToValueAtTime(1, start + delay + 1);
      source.connect(gain);
      gain.connect(this.master);
      this.retainEffect(source, [source, gain]);
      source.start(start + delay, offset, duration);
    }
    document.dispatchEvent(new CustomEvent("portfolio:cassette-timing", {
      detail: {
        resumeAt: split + 2,
        duration: Math.min(2.5, this.cassetteBuffer.duration) + 2,
        elapsed: () => Math.max(0, context.currentTime - start),
      },
    }));
  }

  playTapeStart() {
    this.noise(0.07, 0.085, 0, 2200);
    this.tone(132, 0.09, 0.08, "square", 0.015, 76);
    this.tone(740, 0.055, 0.045, "triangle", 0.09, 980);
  }

  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    this.onStateChange = undefined;
    for (const nodes of this.effects) for (const node of nodes) node.disconnect();
    this.effects.clear();
    this.ambience?.stop();
    this.projectsAmbience?.stop();
    this.projectsHum?.stop();
    this.projectsWarble?.stop();
    this.worldAmbience?.stop();
    this.worldDrone?.stop();
    this.worldOvertone?.stop();
    this.worldPulse?.stop();
    this.worldBreath?.stop();
    for (const source of this.worldSpaceSources) source.stop();
    this.worldSpaceSources = [];
    this.monitorNoise?.stop();
    if (this.context && this.context.state !== "closed") void this.context.close().catch(() => {});
  }
}

export function SiteAudio() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);
  const [started, setStarted] = useState(false);
  const [inAbout, setInAbout] = useState(false);
  const enabledRef = useRef(true);
  const startedRef = useRef(false);
  const engineRef = useRef<SiteAudioEngine | null>(null);
  const muteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleVersion = useRef(0);

  if (!engineRef.current) engineRef.current = new SiteAudioEngine();

  useEffect(() => {
    const update = () => {
      const about = document.getElementById("about");
      setInAbout(Boolean(about && about.getBoundingClientRect().top < window.innerHeight * 0.6));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  useEffect(() => {
    const theme: SiteAudioTheme = pathname.startsWith("/world")
      ? "world"
      : pathname.startsWith("/projects")
        ? "projects"
        : "main";
    engineRef.current?.setTheme(theme);
  }, [pathname]);

  useEffect(() => {
    let savedPreference: string | null = null;
    try { savedPreference = window.localStorage.getItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
    if (savedPreference === "off") {
      enabledRef.current = false;
      setEnabled(false);
    }

    const engine = engineRef.current;
    if (engine) {
      void engine.preloadCassette();
      engine.onStateChange = (running) => {
        startedRef.current = running;
        setStarted(running);
      };
      engine.setTheme(window.location.pathname.startsWith("/world") ? "world" : window.location.pathname.startsWith("/projects") ? "projects" : "main");
    }
    let lastHoverAt = 0;
    const playForTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element) || target.closest(".site-sound-toggle")) return;
      if (!enabledRef.current || !engine) return;

      void engine.unlock().then((ready) => {
        if (!ready || !enabledRef.current) return;
        startedRef.current = true;
        setStarted(true);
        engine.setEnabled(true);

        const control = target.closest("a, button, summary, [role='button']");
        if (!control) return;
        if (control.matches(".project-cassette")) return;
        else if (control.matches(".project-video-trigger")) engine.playTapeStart();
        else engine.playClick();
      });
    };

    const handlePointer = (event: PointerEvent) => playForTarget(event.target);
    const handleHover = (event: PointerEvent) => {
      // Hover is not a browser user activation: never queue resume calls here.
      if (event.pointerType !== "mouse" || !enabledRef.current || !engine?.running) return;
      if (!(event.target instanceof Element)) return;

      const monitor = event.target.closest(".monitor-screen");
      if (monitor && !(event.relatedTarget instanceof Node && monitor.contains(event.relatedTarget))) {
        engine.setMonitorNoise(true);
      }

      const control = event.target.closest("a, button, summary, [role='button']");
      if (!control) return;
      if (control.matches(".site-sound-toggle") && !startedRef.current) return;
      if (event.relatedTarget instanceof Node && control.contains(event.relatedTarget)) return;

      const now = window.performance.now();
      if (now - lastHoverAt < 70) return;
      lastHoverAt = now;

      const kind = control.matches(".project-cassette")
        ? "cassette"
        : control.matches(".project-video-trigger")
          ? "video"
          : "standard";

      engine.playHover(kind);
    };
    const handleHoverEnd = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !engine) return;
      const monitor = event.target.closest(".monitor-screen");
      if (!monitor) return;
      if (event.relatedTarget instanceof Node && monitor.contains(event.relatedTarget)) return;
      engine.setMonitorNoise(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && event.target instanceof Element) {
        playForTarget(event.target);
      } else if (enabledRef.current && engine) {
        void engine.unlock().then((ready) => {
          if (!ready || !enabledRef.current) return;
          startedRef.current = true;
          setStarted(true);
          engine.setEnabled(true);
        });
      }
    };

    const handleCassette = () => {
      if (!enabledRef.current || !engine) return;
      // Already unlocked: schedule the original click in this same event,
      // without waiting for resume or fading over the short click transient.
      if (engine.running) {
        engine.setEnabled(true, true);
        engine.playCassetteInsert();
        return;
      }
      void engine.unlock().then((ready) => {
        if (!ready || !enabledRef.current) return;
        engine.setEnabled(true, true);
        engine.playCassetteInsert();
      });
    };
    document.addEventListener("portfolio:cassette-insert", handleCassette);
    document.addEventListener("pointerdown", handlePointer, true);
    document.addEventListener("pointerover", handleHover, true);
    document.addEventListener("pointerout", handleHoverEnd, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("portfolio:cassette-insert", handleCassette);
      document.removeEventListener("pointerdown", handlePointer, true);
      document.removeEventListener("pointerover", handleHover, true);
      document.removeEventListener("pointerout", handleHoverEnd, true);
      document.removeEventListener("keydown", handleKey, true);
      engine?.destroy();
      if (muteTimer.current) clearTimeout(muteTimer.current);
      toggleVersion.current += 1;
      startedRef.current = false;
      setStarted(false);
      if (engineRef.current === engine) engineRef.current = new SiteAudioEngine();
    };
  }, []);

  const toggleSound = async () => {
    const engine = engineRef.current;
    if (!engine) return;
    const version = ++toggleVersion.current;
    if (muteTimer.current) clearTimeout(muteTimer.current);
    const nextEnabled = !(enabledRef.current && engine.running);
    enabledRef.current = nextEnabled;
    setEnabled(nextEnabled);
    if (nextEnabled) {
      const ready = await engine.unlock();
      if (version !== toggleVersion.current || engine !== engineRef.current) return;
      if (ready) {
        engine.setEnabled(true);
        engine.playSwitch(true);
        startedRef.current = true;
        setStarted(true);
        engine.setMonitorNoise(Boolean(document.querySelector(".monitor-screen:hover")));
      } else {
        startedRef.current = false;
        setStarted(false);
      }
    } else {
      if (engine.running) {
        engine.playSwitch(false);
      }
      muteTimer.current = setTimeout(() => {
        if (version === toggleVersion.current) engine.setEnabled(false);
      }, 105);
    }
    try { window.localStorage.setItem(STORAGE_KEY, nextEnabled ? "on" : "off"); } catch { /* Sound works without storage. */ }
  };

  return (
    <button
      className="site-sound-toggle"
      type="button"
      data-enabled={enabled && started}
      data-compact={inAbout || pathname.startsWith("/world") || pathname.startsWith("/projects")}
      aria-pressed={enabled && started}
      aria-label={enabled && !started ? "Start site sound" : `Turn site sound ${enabled ? "off" : "on"}`}
      onClick={toggleSound}
    >
      <span className="site-sound-switch" aria-hidden="true">
        <Image
          src={enabled && started ? "/ui/sound-switch-on-v2.png" : "/ui/sound-switch-off-v2.png"}
          alt=""
          width={273}
          height={401}
          priority
        />
      </span>
      <span className="site-sound-label">
        {enabled && !started ? "Start sound" : `Sound ${enabled ? "on" : "off"}`}
      </span>
    </button>
  );
}
