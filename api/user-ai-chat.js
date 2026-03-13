import OpenAI from "openai";

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return json(res, 500, { error: "Missing OPENAI_API_KEY" });
  }

  try {
    const { user, history, messages } = req.body || {};
    if (!user || !Array.isArray(messages)) {
      return json(res, 400, { error: "Invalid request payload" });
    }

    const latestHistory = Array.isArray(history) ? history.slice(-8) : [];
    const conversation = messages.slice(-10).map((message) => ({
      role: message.role,
      content: [{ type: "input_text", text: message.content }],
    }));

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a warm, natural health support assistant inside a BMI dashboard. Sound conversational and human, not robotic. Use the provided user data and chat history. Answer the user's actual question directly. If they ask casual conversation, respond naturally instead of forcing BMI advice. If they ask health questions, connect your answer to their latest BMI, trend, age, and recent records. Avoid repetitive phrasing. Do not claim to diagnose diseases. Keep advice practical, specific, and supportive.",
            },
          ],
        },
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `User profile: ${JSON.stringify(user)}. Recent BMI history: ${JSON.stringify(latestHistory)}.`,
            },
          ],
        },
        ...conversation,
      ],
    });

    const reply = response.output_text?.trim();
    if (!reply) {
      return json(res, 500, { error: "No AI response generated" });
    }

    return json(res, 200, { reply });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : "Failed to process AI chat",
    });
  }
}
