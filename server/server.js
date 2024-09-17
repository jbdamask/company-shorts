import express from "express";
import cors from "cors";
// import OpenAI from "openai";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_MODEL = process.env.PERPLEXITY_MODEL;
console.log("PERPLEXITY_MODEL", PERPLEXITY_MODEL);

// const openai = new OpenAI({
//   apiKey: PERPLEXITY_API_KEY,
//   basePath: "https://api.perplexity.ai",  
// });

app.get("/", (req, res) => {
  res.send("Hello from Replit!");
});

app.post("/api/research", async (req, res) => {
  const { url } = req.body;

  const prompt = `${url} Research information about the company found at this URL. 
    Once you identify the company, you should search for additional information, including 
    general web search, Crunchbase, and other business sites, but should 
    use the company's website as your primary source. Include sections for Business Model 
    and Services, Company Growth, Corporate Partnerships and Notable Customers, and Market Position. 
    Populate these sections with relevant information that you find. Include a list of 
    references in your output with URLs as plain text.`;

  const messages = [
    {
      role: "system",
      content: `You are an expert company research analyst who 
            provides factual, succinct, up to date, and informative reports 
            to business users. When asked for a report, you will use
            all of the tools at your disposal to perform the research. 
            Sometimes, you may find different companies with the same or 
            similar names to the one you've been asked to research. Therefore,
            you must self-review your analysis steps and be sure that the research
            you provide makes sense in the context of the company the user asked for.
            DO NOT include information about companies other than the one requested.`,
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        // model: "llama-3-sonar-large-32k-online",
        model: PERPLEXITY_MODEL,
        messages: messages,
      },
      {
        headers: {
          "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 180000 // 3 minutes timeout
      }
    );

    const result = response.data.choices[0].message.content;
    console.log(scrubSensitiveInfo(result));
    res.json({ result });
  } catch (error) {
    console.error("Error:", scrubSensitiveInfo(error.toString()));
    if (error.response) {
      // Log the response from the API
      console.error("Response data:", scrubSensitiveInfo(JSON.stringify(error.response.data)));
      console.error("Response status:", error.response.status);
      console.error("Response headers:", scrubSensitiveInfo(JSON.stringify(error.response.headers)));
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

function scrubSensitiveInfo(text) {
  // Replace API keys and other sensitive information
  return text.replace(/([A-Za-z0-9_-]{20,})/g, "[REDACTED]");
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
