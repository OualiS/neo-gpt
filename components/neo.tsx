import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { talk, resetPrompt } from "../gpt/gpt";
import { useRef, useEffect, useState } from "react";

const Neo = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const restarListening = () =>
    setTimeout(() => {
      recognition!.start();
      console.log("Listenin again");
    }, 1000);

  const [isInConversation, setIsInConversation] = useState(false);

  const wordsToBeginConv = ["néo", "Néo", "neo", "Neo"];
  const wordToCloseConv = ["merci", "Merci"];

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  let synth: SpeechSynthesis = window.speechSynthesis;
  let jarvisIsSpeaking: boolean;

  const recognition = SpeechRecognition.getRecognition();
  recognition.onend = (e) => {
    recognition!.stop();
    if (
      (wordsToBeginConv.some((el) => transcript.includes(el)) ||
        isInConversation) &&
      transcript !== ""
    ) {
      // if (!isInConversation) console.log("Begin a conversation");
      setIsInConversation(true);
      talk(transcript).then((res) => {
        // console.log(res.data.choices[0].text);
        resetTranscript();
        let utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(
          res.data.choices[0].text.replace(/neo:|néo:|Neo:|Néo:/gi, "")
        );
        synth.speak(utterThis);

        utterThis.onend = (event) => {
          // console.log(`Response duration : ${event.elapsedTime} seconds.`);
          restarListening();
        };
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

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
  }, []);

  let canvasContext: CanvasRenderingContext2D | null;

  if (ref.current) canvasContext = ref.current.getContext("2d");

  const analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  let x;
  function animate() {
    if (!canvasContext) return;
    x = 0;
    canvasContext.clearRect(0, 0, ref.current!.width, ref.current!.height);
    analyser.getByteFrequencyData(data);
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      let barHeight = Math.floor(Math.random() * 100);

      canvasContext.fillStyle = "white";
      canvasContext.fillRect(
        x,
        ref.current!.height - barHeight,
        ref.current!.width / analyser.frequencyBinCount,
        barHeight
      );
      x += synth.speaking ? ref.current!.width / analyser.frequencyBinCount : 0;
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
        <canvas
          ref={ref}
          id="visualizer"
          width="500"
          height="200"
          className="rounded-full"
        ></canvas>
      </div>
    </div>
  );
};
export default Neo;
