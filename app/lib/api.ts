const FUNCTIONS_REGION = "us-central1";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const ANALYZE_URL = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net/analyze`;

export const analyzeImage = async (image: string, prompt: string): Promise<string> => {
  const res = await fetch(ANALYZE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, prompt }),
  });

  if (!res.ok) throw new Error("API request failed");

  const data = await res.json();
  return data.text?.trim() || "";
};
