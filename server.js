console.log("Starting backend...");

require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

/* ==============================
   CORS FIX (Handles 405)
============================== */

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

/* ==============================
   HEALTH CHECK ROUTE
============================== */

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* ==============================
   CONTACT ROUTE
============================== */

app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields required" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact from ${name}`,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `
        });

        res.json({ success: true });

    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Email failed" });
    }
});

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});