const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
    res.send("Server is running ✅");
});

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

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
            ]
        });

        const code = response.choices[0].message.content;
        res.json({ code });

    } catch (err) {
        console.error("OpenAI Error:", err);
        res.status(500).json({ error: "There was an error connecting to OpenAI." });
    }
});

// تشغيل الخادم
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
