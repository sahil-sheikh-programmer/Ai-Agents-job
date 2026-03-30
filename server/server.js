
import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Groq from "groq-sdk"
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors({
  origin: "*"
  
}));
app.use(express.static("public"));




app.use(express.json());


/* ================================
   🔥 CONFIG
================================ */


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================================
   USER DATA (RAG STYLE)
================================ */

const userData = `
Name: Sahil Sheikh
Skills: React, Node.js, REST APIs
Projects: AI Voice Agent Platform
Experience: 1 year as frontend developer at softgrowth infotech Company
`;

/* ================================
   AI GENERATE EMAIL
================================ */

app.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;

    const prompt = `
You are a professional job assistant.

Using the following candidate details:
${userData}

Write a professional job application email.

User request: ${input}

Return format:
Subject: ...
Body: ...
`;

    const aiRes = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log("AI Response:", aiRes);  

    const fullText = aiRes.choices[0].message.content;
console.log("Full AI Text:", fullText);
    const subject = fullText.match(/Subject:(.*)/)?.[1]?.trim() || "Job Application";
    const body = fullText.split("Body:")[1]?.trim() || fullText;

    res.json({
      email: { subject, body },
    });

  } catch (err) {
    console.error("AI error:", err.message);

    // fallback (important)
    res.json({
      email: {
        subject: "Frontend Developer Application",
        body: "Dear Hiring Manager, I am Sahil Sheikh, a frontend developer skilled in React and Node.js. I would love to contribute to your team. Please find my resume attached.\n\nBest regards,\nSahil Sheikh"
      }
    });
  }
});

/* ================================
   📩 SEND EMAIL
================================ */

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
      attachments: [
        {
          filename: "resume.pdf",
          path: "./resume.pdf",
        },
      ],
    });

    res.json({ message: "Email sent successfully ✅" });

  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Email failed" });
  }
});

/* ================================
   🚀 START SERVER
================================ */
app.get("/test", (req, res) => {
  res.send("Backend working 🚀");
});

app.listen(port, () => {
  console.log(`🚀 AI Email Agent running on port ${port}`);
});