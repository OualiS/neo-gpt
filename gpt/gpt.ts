const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_GPT3_API_KEY,
});
const openai = new OpenAIApi(configuration)

let initalPrompt = "Créez un assistant de type Jarvis nommé Néo, capable de répondre à des questions générales et de fournir des informations sur divers sujets, comme la météo, l'actualité, les horaires de transport, etc. L'assistant doit également être capable de donner des conseils et de prendre des décisions pour aider son utilisateur dans sa vie quotidienne. Il doit être poli, professionnel et avoir une bonne présence en ligne.\n\n"
let prompt = initalPrompt

const talk = async (transcript : string) => {
    prompt += "\nHuman:" + transcript +"\n"
    console.log('prompt', prompt);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " Néo:"],
      });
      prompt += response.data.choices[0].text
      console.log('response', response);
      return response
}

const resetPrompt = () => {
  console.log('prompt reseted')
  prompt = initalPrompt
}


export {talk, resetPrompt}