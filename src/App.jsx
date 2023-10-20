import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [model, setModel] = useState();
  const [objectName, setObjectName] = useState();
  const [detectScore, setDetectScore] = useState();

  async function loadModel() {
    try {
      const dataset = await cocoModel.load();
      setModel(dataset);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predict() {
    const detection = await model.detect(document.getElementById("Source"));
    if (detection.length > 0) {
      detection.map((result, i) => {
        setDetectScore(result.score);
        setObjectName(result.class);
      });
    }
  }

  const videoOption = {
    width: 720,
    height: 480,
    facingMode: "environment",
  };

  return (
    <>
      <div className="container">
        <h1 className="text-blue-400 font-bold text-4xl text-center">Testing</h1>
        <h3>{objectName ? objectName.toString() : ""}</h3>
        <h3>{detectScore ? detectScore.toString() : ""}</h3>
        <button onClick={() => predict()}>Tebak Objek</button>
        <div className="flex justify-center">
          <Webcam id="Source" audio={false} videoConstraints={videoOption} className="text-center" />
        </div>
      </div>
    </>
  );
}

export default App;
