# PRINCIPIA 🌌

**G-3 Reality Engine**

Principia is a next-generation visualization tool that bridges the gap between abstract theoretical physics and visceral visual intuition. By combining **Google Gemini 3 Pro** with **Three.js**, it allows users to input any scientific concept—from "Quantum Entanglement" to "Non-Euclidean Geometry"—and instantly generates a hyper-realistic, interactive 3D simulation in real-time.

<div> </div>

---

## ✨ Features

*   **Generative Physics**: Type any concept, and the AI derives the mathematical proofs and generates custom WebGL shader code on the fly.
*   **Gemini 3.0 Pro Integration**: Powered by Google's latest reasoning model for high-fidelity code generation and scientific accuracy.
*   **Mind-Melting Visuals**:
    *   **Post-Processing**: Integrated Unreal Bloom Pass for neon, sci-fi aesthetics.
    *   **Procedural Idle Engine**: Generates elegant mathematical structures (Quantum Clouds, Galactic Spirals, Hyper-Tori) when the system is resting.
*   **Interactive Simulation**:
    *   **Dynamic Controls**: The AI generates specific sliders (e.g., "Gravity", "Chaos Factor", "Light Speed") for each unique visualization.
    *   **Orbit & Zoom**: Full camera control to inspect manifolds from every angle.
*   **Shareable Reality**: Generate unique, state-preserving links to share your specific visualization parameters with others.
*   **Theater Mode**: Collapse the UI for a cinematic, immersive experience.
*   **Privacy First**: Runs entirely client-side. Your API key is stored locally in your browser and connects directly to Google.

## 🛠 Tech Stack

*   **Core**: [React 19](https://react.dev/), TypeScript, [Vite](https://vitejs.dev/)
*   **3D Engine**: [Three.js](https://threejs.org/) (WebGL)
*   **AI**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini 3 Pro Preview)
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **Effects**: Three.js EffectComposer (UnrealBloomPass)

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google AI Studio API Key (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/derejealemu/Principia-Reality-Engine
    cd Principia-Reality-Engine
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Launch**
    Open your browser and navigate to `http://localhost:3000`.

---

## 🎮 How to Use

1.  **Initialize**: Enter your Gemini API Key when prompted (stored locally).
2.  **Visualize**: 
    *   Type a prompt (e.g., *"Black Hole Accretion Disk"*) in the search bar.
    *   Or select a preset from the **Mind-Melters** list (Cosmos, Quantum, Chaos).
3.  **Interact**:
    *   **Rotate/Zoom**: Drag and scroll to explore the 3D space.
    *   **Controls Tab**: Open the slider menu to tweak simulation parameters in real-time.
    *   **View Tab**: Adjust camera distance or enable auto-rotation.
4.  **Share**: Click the Share icon to generate a unique URL for your creation.

---

## 📂 Project Structure

*   `src/components/VisualizationCanvas.tsx`: The heart of the app. Handles Three.js initialization, code execution, and the render loop.
*   `src/services/geminiService.ts`: Interacts with the Gemini API, defining the prompt engineering and system instructions.
*   `src/components/ControlPanel.tsx`: The main UI for inputs, history, and dynamic sliders.
*   `src/App.tsx`: State management (Persistence, URL routing, API Key handling).

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for better system prompts, new post-processing effects, or UI improvements:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ⚛️ and 🤖</p>
</div>
