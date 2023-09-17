// const { Configuration, OpenAIApi } = require("openai");
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: "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", //process.env.NEXT_PUBLIC_GPT3_API_KEY,
});
const openai = new OpenAIApi(configuration);

let systemPrompt =
  "Créez un assistant de type Jarvis nommé Néo, capable de répondre à des questions générales et de fournir des informations sur divers sujets, comme la météo, l'actualité, les horaires de transport, etc. L'assistant doit également être capable de donner des conseils et de prendre des décisions pour aider son utilisateur dans sa vie quotidienne. Il doit être poli, professionnel et avoir une bonne présence en ligne. Tu vas pouvoir aussi détecter mes commandes domotique, si tu en reçois une tu répondra que la commande est confirmé puis entre crochet et en anglais tu recapitulera la commande.\n\n";

let messagesContent = [{ role: "system", content: systemPrompt }];

// const oldtalk = async (transcript : string) => {
//     prompt += "\nHuman:" + transcript +"\n"
//     // console.log('prompt', prompt);

//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: prompt,
//         temperature: 0.9,
//         max_tokens: 150,
//         top_p: 1,
//         frequency_penalty: 0.0,
//         presence_penalty: 0.6,
//         stop: [" Human:", " Néo:"],
//       });
//       prompt += response.data.choices[0].text
//       // console.log('response', response);
//       return response
// }

const talk = async (transcript) => {
  messagesContent.push({ role: "user", content: transcript });
  // console.log('prompt', prompt);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesContent,
    });

    const gptResponse = response.data.choices[0].message.content;

    messagesContent.push({
      role: "assistant",
      content: gptResponse,
    });
    return gptResponse;
  } catch (error) {
    return "Une erreur est survenue, veuillez réessayer.";
  }
};

talk("Bonjour");

// const resetPrompt = () => {
//   console.log('prompt reseted')
//   prompt = initalPrompt
// }

export { talk };
