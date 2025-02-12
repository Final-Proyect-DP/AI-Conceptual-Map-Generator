const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const logger = require('../config/logger');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.generateMap = async (req, res) => {
    const { theme, considerations } = req.query;
    const userId = req.user.id;

    if (!theme || !considerations) {
        logger.warn(`Invalid request parameters for user ${userId}`);
        return res.status(400).json({ 
            botMessage: "",
            description: "theme and considerations are required" 
        });
    }

    try {
        logger.info(`Starting map generation for user ${userId}`);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `Generate a concept map in graphviz format about ${theme}, making sure to ${considerations}. Organize the information into topics and subtopics. The result should be exclusively the concept map in graphviz, without additional text.`;
        
        const result = await model.generateContent(prompt);
        const botMessage = await result.response.text();

        const response = {
            botMessage: botMessage,
            description: "Mensaje recibido y procesado correctamente."
        };

        fs.writeFileSync('response.json', JSON.stringify(response, null, 2));
        logger.info(`Map generated and saved for user ${userId}`);

        res.json(response);
    } catch (error) {
        logger.error(`Map generation failed for user ${userId}:`, error);
        res.status(500).json({
            botMessage: "",
            description: "Error generating concept map: " + error.message
        });
    }
};
