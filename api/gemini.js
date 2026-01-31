import { GoogleGenAI } from "@google/genai";

// Initialize the API
const genAI = new GoogleGenAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function processImages(fileList) {
  // 1. Convert File objects to the GoogleGenAI inlineData format
  const imageParts = await Promise.all(
    Array.from(fileList).map(fileToGenerativePart)
  );

  const prompt = "Identify the item in each image. Return a structured list with the item name and a brief description.";

  try {
    // 2. Send the array of images + the prompt
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Error identifying items:", error);
  }
}

// Helper function to convert a browser File object to Base64
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type
    },
  };
}

// Example usage with an <input type="file" multiple id="fileInput">
const fileInput = document.querySelector('#fileInput');
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    processImages(e.target.files);
  }
});