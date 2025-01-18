import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCourseStructure(req, res) {
  const { courseName, description, difficulty, weeks } = req.body;

  if (!courseName || !description || !difficulty || !weeks) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            You are an expert course designer. Create a detailed course structure based on the given parameters:
            - Course Name
            - Description
            - Difficulty Level
            - Number of Weeks
            Format the output strictly as:
            "Week X: Topic Title - Description of topics for the week."
            Separate each week with "----------" (a dotted line).
            No additional text should be included.`,
        },
        {
          role: "user",
          content: `
            Generate a course structure for a course named "${courseName}".
            Description: ${description}.
            Difficulty Level: ${difficulty}.
            Number of Weeks: ${weeks}.`,
        },
      ],
    });

    const courseStructure = response.choices[0].message.content.trim();
    res.status(200).json({ courseStructure });
  } catch (error) {
    console.error("Error generating course structure:", error.message);
    res.status(500).json({ error: "Failed to generate course structure." });
  }
}
