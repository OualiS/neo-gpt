import React, { useRef, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { talk, resetPrompt } from '../ai/gpt.ts';
import { compareTwoStrings } from 'string-similarity';

import { NNLP } from '../nnlp/NNLP';
import { playAudioFromElevenLabs } from '../ai/elevenlabs';

const nnlpInstance = new NNLP();

const CORPUS = [
    {
        intent: 'light.switch',
        utterances: [
            'Turn on the {room} light',
            'turn on the {room} room light',
            'The {room} room light has been turned on',
            'The light in the {room} room has been turned on',
            'Allumer la lumière du {room}.'
        ],
        answers: []
    }
];

nnlpInstance.loadCorpus(CORPUS);

// You can add actions to be performed when the sentence is spoken.
nnlpInstance.addAction('light.switch', function (_intent, _result) {
    // You can do what you want here
    console.log('light.switch action fired');
    console.log('_intent', _intent);
    console.log('_result', _result);
});

// #endregion

const Neo = () => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const recognition = SpeechRecognition.getRecognition();

    const restarListening = () =>
        setTimeout(() => {
            recognition.start();
            console.log('Listenin again');
        }, 1000);

    const [isInConversation, setIsInConversation] = useState(false);

    const wordsToBeginConv = ['néo', 'Néo', 'neo', 'Neo'];
    const wordToCloseConv = ['merci', 'Merci'];

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    let synth = window.speechSynthesis;
    let jarvisIsSpeaking;

    recognition.onend = (e) => {
        recognition.stop();
        if ((wordsToBeginConv.some((el) => transcript.includes(el)) || isInConversation) && transcript !== '') {
            // if (!isInConversation) console.log("Begin a conversation");
            setIsInConversation(true);
            talk(transcript).then((res) => {
                // console.log(res.data.choices[0].text);
                resetTranscript();
                const response = res;
                const isCommand = /(\[.*?\])/.test(response);
                let regexpResult;
                if (isCommand) {
                    regexpResult = /(\[.*?\])/.exec(response);
                    if (regexpResult && regexpResult.length > 0) {
                        const command = regexpResult[0];
                        console.log('Automation command detected : ', command);
                        CORPUS.forEach((intent) => {
                            intent.utterances.forEach((utterance) => {
                                const matchScore = compareTwoStrings(utterance, command);
                                console.log('string match score', matchScore);
                                if (matchScore > 0.5) {
                                    console.log('command', command);
                                    nnlpInstance.process(command.replace('[', '').replace(']', ''));
                                }
                            });
                        });
                    }
                }

                console.log('response', response);
                // let utterThis = new SpeechSynthesisUtterance(
                //   response.replace(/(\[.*?\])|(Néo:|Neo:|néo|neo)/gi, "")
                // );
                //
                // synth.speak(utterThis);
                //
                // utterThis.onend = (event) => {

                //   // console.log(`Response duration : ${event.elapsedTime} seconds.`);
                //   restarListening();
                // };
                const AudioContext = window.AudioContext || window.webkitAudioContext;

                playAudioFromElevenLabs(response.replace(/(\[.*?\])|(Néo:|Neo:|néo|neo)/gi, ''))
                    .then((isFinishToTalk) => {
                        if (isFinishToTalk) {
                            restarListening();
                            console.log('gen audio finit');
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                jarvisIsSpeaking = synth.speaking;
                animate();
            });
            if (wordToCloseConv.some((el) => transcript.includes(el))) {
                // console.log("Conversation ended");
                setIsInConversation(false);
                resetPrompt();
                resetTranscript();
            }
        } else {
            // console.log("Not in conversation and no word for begin one");
            restarListening();
            resetTranscript();
        }
    };

    const audioElement = new Audio();
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audioElement);

    const ref = useRef < HTMLCanvasElement > null;

    useEffect(() => {
        // const canvas = ref.current;
    }, []);

    let canvasContext;

    if (ref.current) canvasContext = ref.current.getContext('2d');

    const analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    let x;
    function animate() {
        if (!canvasContext) return;
        x = 0;
        canvasContext.clearRect(0, 0, ref.current.width, ref.current.height);
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            let barHeight = Math.floor(Math.random() * 100);

            canvasContext.fillStyle = 'white';
            canvasContext.fillRect(x, ref.current.height - barHeight, ref.current.width / analyser.frequencyBinCount, barHeight);
            x += synth.speaking ? ref.current.width / analyser.frequencyBinCount : 0;
        }

        if (synth.speaking) {
            requestAnimationFrame(animate);
        } else {
            x = 1;
        }
    }

    return (
        <div>
            <div className="flex justify-center mt-72 ">
                {listening ? (
                    <img src="/microphone_1.png" className="z-10" width={50} />
                ) : (
                    <img
                        onClick={SpeechRecognition.startListening}
                        src="/microphone_0.png"
                        width={50}
                        className="z-10 animate-pulse"
                    />
                )}
            </div>
            <div className="text-sky-400 mt-20">
                <p className="">{transcript}</p>
            </div>

            <div className="">
                {/* <canvas
          ref={ref}
          id="visualizer"
          width="500"
          height="200"
          className="rounded-full"
        ></canvas> */}
            </div>
        </div>
    );
};
export default Neo;
