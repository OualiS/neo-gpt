import { reject } from 'q';

const axios = require('axios');

async function playAudioFromElevenLabs(prompt: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            console.log('entré dans le gen audio');
            const result = await axios({
                method: 'POST',
                url: `https://api.elevenlabs.io/v1/text-to-speech/TxGEqnHWrfWFTfGW9XjX/stream`,
                data: {
                    text: prompt,
                    model_id: 'eleven_multilingual_v1'
                },
                headers: {
                    Accept: 'audio/mpeg',
                    'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });

            const audioContext = new AudioContext();
            const source = audioContext.createBufferSource();

            await audioContext.decodeAudioData(result.data, (buffer) => {
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(0);
            });
            source.onended = () => {
                resolve(true);
            };
        } catch (error) {
            console.error('Une erreur est survenue:', error);
            reject(error);
        }
    });
}

export { playAudioFromElevenLabs };
