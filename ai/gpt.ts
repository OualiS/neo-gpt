// const { Configuration, OpenAIApi } = require("openai");
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_GPT3_API_KEY
});
const openai = new OpenAIApi(configuration);

let systemPrompt =
    "Tu es un assistant de type Jarvis comme dans Iron Man nommé Néo, capable de répondre à des questions générales et de fournir des informations sur divers sujets, comme la météo, l'actualité, les horaires de transport, etc. L'assistant doit également être capable de donner des conseils et de prendre des décisions pour aider son utilisateur dans sa vie quotidienne. Il doit être poli, professionnel et avoir une bonne présence en ligne. Tu vas pouvoir aussi détecter mes commandes domotique, si tu en reçois une tu répondra que la commande est confirmé puis entre crochet et en anglais tu recapitulera la commande.\n\n";

let messagesContent: ChatCompletionRequestMessage[] = [{ role: 'system', content: systemPrompt }];
const talk = async (transcript: string) => {
    messagesContent.push({ role: 'user', content: transcript });
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4-0613',
            messages: messagesContent
        });

        const gptResponse = response.data.choices[0].message?.content;

        messagesContent.push({
            role: 'assistant',
            content: gptResponse ?? 'Problème lors de la réponse !'
        });
        return gptResponse;
    } catch (error) {
        return 'Une erreur est survenue, veuillez réessayer.';
    }
};

const resetPrompt = () => {
    console.log('prompt reseted');
    messagesContent = [{ role: 'system', content: systemPrompt }];
};

export { talk, resetPrompt };
