import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const chatWithCohere = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Falta el campo 'prompt'" });
    }

    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: prompt,
        chat_history: [2],
        model: "command-r-plus",
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer C4FlzNlHa5mhtVyYtjf40LVQTvHODBM5Gxi6rYY6`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.text || response.data.reply;
    res.json({ response: reply });
  } catch (error) {
    console.error("Error al comunicarse con Cohere:", error.message);
    res.status(500).json({ error: "Error al procesar la solicitud del chatbot" });
  }
};
