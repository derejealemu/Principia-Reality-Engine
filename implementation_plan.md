# Principia Feature Implementation Plan

## Overview
This document outlines the plan to implement three key features for the Principia Reality Engine:
1.  **Screenshot & Video Export**: Allow users to capture high-quality images and video loops of their visualizations.
2.  **Color Customization**: Enable users to customize the primary and secondary colors of the visualization.
3.  **Audio Reactivity**: Make the visualizations react to audio input (microphone or system audio).

## Phase 1: Screenshot & Video Export
**Goal**: Users can save what they see.

### 1.1 Screenshot
*   **UI**: Add a "Camera" icon button to the Control Panel (View tab or top header).
*   **Logic**:
    *   Use `renderer.domElement.toDataURL('image/png')` to capture the current frame.
    *   Trigger a download of the image file.
    *   *Note*: Must render the scene immediately before capture to ensure the buffer is not cleared (unless `preserveDrawingBuffer: true` is set, but that impacts performance. Better to render explicitly for the screenshot).

### 1.2 Video Export (GIF/WebM)
*   **UI**: Add a "Record" button (Circle icon).
*   **Library**: Use `ccapture.js` or `webm-writer` (or a lightweight alternative like `gif.js` if GIF is preferred, but WebM is better for quality).
*   **Logic**:
    *   Start recording frames from the canvas.
    *   Capture for a set duration (e.g., 5s, 10s) or until "Stop" is pressed.
    *   Encode and download the video file.

## Phase 2: Color Customization
**Goal**: Users can change the aesthetic.

### 2.1 State Management
*   **Update `VisualizationData` / `ViewSettings`**:
    *   Add `color1` (Primary) and `color2` (Secondary) to the state.
    *   Default to Neon Blue (`#00f3ff`) and Neon Purple (`#bc13fe`).

### 2.2 UI Controls
*   **Color Pickers**: Add two color input fields (`<input type="color">`) to the "View" tab in `ControlPanel`.
*   **Presets**: Add a few preset palettes (e.g., "Cyberpunk", "Golden Hour", "Matrix").

### 2.3 Rendering Integration
*   **Update `VisualizationCanvas`**:
    *   Pass `colors` prop to the canvas.
    *   **Challenge**: The *generated* code from Gemini might hardcode colors (e.g., `0x00ff00`).
    *   **Solution**:
        *   Inject a `uniforms` object or a `theme` object into the `setupCode` and `animationCode` scope.
        *   Update the Gemini System Instruction to use `params.color1` and `params.color2` instead of hardcoded hex values.
        *   For existing/legacy visualizations, we might not be able to force color changes unless we regex-replace hex codes (risky) or just accept it only works for new gens.
        *   *Better approach*: Instruct Gemini to *always* use `theme.primary` and `theme.secondary`.

## Phase 3: Audio Reactivity
**Goal**: Visualizations move to music.

### 3.1 Audio Analysis Engine
*   **Web Audio API**:
    *   Create an `AudioContext`.
    *   Create an `AnalyserNode`.
    *   Source: Microphone (`navigator.mediaDevices.getUserMedia`) or maybe a file upload (simpler for privacy/permissions). Microphone is more "live".

### 3.2 State & Logic
*   **Analysis Data**: Calculate `frequencyData` (FFT) and `timeDomainData` (Waveform).
*   **Derived Values**: Calculate `bass`, `mid`, `treble` averages.

### 3.3 Rendering Integration
*   **Pass Audio Data**: Pass an `audio` object to the `animationCode` scope.
    *   `audio.level`: Overall volume (0-1).
    *   `audio.bass`: Bass energy.
*   **Gemini Update**: Instruct Gemini to use `audio.level` to modulate scale, intensity, or bloom.
    *   *Example*: `mesh.scale.setScalar(1 + audio.bass * 0.5);`

## Execution Order
1.  **Color Customization**: Easiest to implement and high impact. Requires updating the Prompt/System Instruction.
2.  **Screenshot**: Low hanging fruit, very useful.
3.  **Video Export**: More complex due to encoding libraries.
4.  **Audio Reactivity**: Most complex, requires permission handling and significant prompt engineering.

## Next Steps
*   Begin with **Phase 2 (Color Customization)** as it requires changing how we prompt Gemini, which affects all future generations.
*   Then move to **Phase 1 (Screenshot)**.
