
import { GoogleGenAI, Type } from "@google/genai";
import { VisualizationData } from "../types";

/**
 * Generates the Three.js code for a requested physics concept.
 */
export const generatePhysicsVisualization = async (topic: string, apiKey: string): Promise<Omit<VisualizationData, 'id' | 'timestamp'>> => {
  if (!apiKey) throw new Error("API Key is missing");

  // Initialize client with the user's key for this specific request
  const ai = new GoogleGenAI({ apiKey: apiKey });
  // Updated to gemini-3-pro-preview for better reasoning and higher rate limits
  const modelId = "gemini-3-pro-preview";

  const systemInstruction = `
    You are a world-class creative coder, expert in Three.js, GLSL shaders, and high-level theoretical physics. 
    Your goal is to visualize complex, abstract, or "gnarly" physics concepts (like extra dimensions, quantum fields, relativity, topology) using Three.js.

    Output Requirements:
    1.  Return a valid JSON object.
    2.  The visual style should be "hyper-realistic", "neon-cyberpunk", or "ethereal". 
    3.  **IMPORTANT:** The scene has 'UnrealBloomPass' enabled. To make things glow, use 'emissive' materials with colors > 1.0 or set mesh colors to high intensity (e.g., 0x00ffff * 2.0). Use this to highlight energy, particles, or singularities.
    4.  Provide 'setupCode' and 'animationCode' strings that will be executed via 'new Function'.
    
    INTERACTIVITY & CONTROLS:
    - The user has 'OrbitControls' enabled automatically. You do NOT need to implement camera rotation logic unless you want a specific auto-rotate effect.
    - You can define custom controls (sliders) for the user to tweak variables in real-time (e.g. speed, dimensions, chaos factor).
    - Define them in the 'controls' array.
    - In 'animationCode', a 'params' object is available. Access values via 'params.controlId'.
    - ALWAYS use 'params' for variables that define motion, color intensity, or geometric distortion.

    Variables available in 'setupCode' scope:
    - scene: THREE.Scene
    - camera: THREE.PerspectiveCamera (default positioned at z=5)
    - renderer: THREE.WebGLRenderer
    - THREE: The THREE.js namespace object
    
    Variables available in 'animationCode' scope:
    - scene: THREE.Scene
    - camera: THREE.PerspectiveCamera
    - renderer: THREE.WebGLRenderer
    - THREE: The THREE.js namespace
    - time: number (elapsed time in seconds)
    - params: object (key-value pairs matching the defined controls)

    Coding Rules:
    - Do NOT create the scene, camera, or renderer. They are provided.
    - Do NOT use 'import'. Use the 'THREE' object provided.
    - Do NOT load external assets.
    - Clean up is handled externally.
    - Use extensive math in 'animationCode'.

    Example Concept: "Strange Attractor"
    Example Response Structure (simplified):
    {
      "title": "Lorenz Attractor",
      "description": "A chaotic system...",
      "controls": [
        { "id": "speed", "label": "Simulation Speed", "type": "range", "min": 0.1, "max": 5, "step": 0.1, "defaultValue": 1 },
        { "id": "sigma", "label": "Sigma (Prandtl)", "type": "range", "min": 1, "max": 20, "step": 0.1, "defaultValue": 10 }
      ],
      "setupCode": "const geometry = new THREE.BufferGeometry(); ... const mat = new THREE.PointsMaterial({color: 0x00ff00, size: 0.1}); scene.add(points);",
      "animationCode": "const points = scene.getObjectByName('attractor'); // update positions based on params.speed and params.sigma",
      "explanation": "The Lorenz attractor is..."
    }
  `;

  const prompt = `Visualize this concept: "${topic}". Make it look mind-bending. Utilize the Bloom effect by making core elements glow. Define 2-4 controls.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 4096 }, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            setupCode: { type: Type.STRING, description: "JavaScript code body for setup." },
            animationCode: { type: Type.STRING, description: "JavaScript code body for animation loop." },
            explanation: { type: Type.STRING, description: "Scientific explanation of what is being seen." },
            controls: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["range"] }, 
                  min: { type: Type.NUMBER },
                  max: { type: Type.NUMBER },
                  step: { type: Type.NUMBER },
                  defaultValue: { type: Type.NUMBER }
                },
                required: ["id", "label", "type", "min", "max", "defaultValue"]
              }
            }
          },
          required: ["title", "description", "setupCode", "animationCode", "explanation"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini.");
    }

    const data = JSON.parse(response.text);
    return data as Omit<VisualizationData, 'id' | 'timestamp'>;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
