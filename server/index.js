import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a coding assistant that ONLY writes Luau code. Do NOT include explanations, comments, or markdown formatting. Output ONLY raw Luau code."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });
    const code = response.choices[0].message.content;
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "There was an error connecting to OpenAI." });
  }
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));