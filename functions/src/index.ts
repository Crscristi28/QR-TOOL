import { onRequest } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import { defineSecret } from "firebase-functions/params";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

export const analyze = onRequest(
  { cors: true, secrets: [geminiApiKey] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { image, prompt } = req.body;

      if (!image) {
        res.status(400).json({ error: "No image data provided" });
        return;
      }

      if (!prompt) {
        res.status(400).json({ error: "No prompt provided" });
        return;
      }

      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: image } },
            { text: prompt },
          ],
        },
      });

      const text = response.text;
      res.json({ text });
    } catch (error) {
      console.error("Analyze error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
