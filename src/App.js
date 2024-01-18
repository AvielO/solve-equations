import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import Confetti from "react-confetti";
import correctAnswerSound from "./correct-answer.mp3";
import wrongAnswerSound from "./wrong-answer.mp3";
import "./App.css";

const nerdamer = require("nerdamer/all.min");

function App() {
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [rightAnswer, setRightAnswer] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [equationClasses, setEquationClasses] = useState("");
  const [showWrongAnswerMessage, setShowWrongAnswerMessage] = useState(false);

  const createNewEquation = (event) => {
    setUserAnswer("");
    if (event) {
      event.preventDefault();
    }

    let newEquation;
    let firstXOrNot, secondXOrNot, thirdXOrNot, fourthXOrNot;
    let firstRandomNumber,
      secondRandomNumber,
      thirdRandomNumber,
      fourthRandomNumber;

    do {
      newEquation = ``;
      firstRandomNumber = Math.floor(Math.random() * 11);
      firstXOrNot = Math.floor(Math.random() * 2);
      const firstOperator = Math.floor(Math.random() * 2);
      secondRandomNumber = Math.floor(Math.random() * 11);
      secondXOrNot = Math.floor(Math.random() * 2);
      thirdRandomNumber = Math.floor(Math.random() * 11);
      thirdXOrNot = Math.floor(Math.random() * 2);
      const secondOperator = Math.floor(Math.random() * 2);
      fourthRandomNumber = Math.floor(Math.random() * 11);
      fourthXOrNot = Math.floor(Math.random() * 2);

      if (firstRandomNumber !== 0) {
        newEquation += `${firstRandomNumber !== 0 ? firstRandomNumber : ""}${
          firstXOrNot === 1 ? "x" : ""
        }`;
        newEquation += `${firstOperator === 1 ? "+" : "-"}`;
      }

      newEquation += `${secondRandomNumber}${secondXOrNot === 1 ? "x" : ""}`;
      newEquation += ` = `;
      if (thirdRandomNumber !== 0) {
        newEquation += `${thirdRandomNumber !== 0 ? thirdRandomNumber : ""}${
          thirdXOrNot === 1 ? "x" : ""
        }`;
        newEquation += `${secondOperator === 1 ? "+" : "-"}`;
      }
      newEquation += `${fourthRandomNumber}${fourthXOrNot === 1 ? "x" : ""}`;
    } while (
      (firstXOrNot === secondXOrNot &&
        secondXOrNot === thirdXOrNot &&
        thirdXOrNot === fourthXOrNot) ||
      (firstRandomNumber === 0 &&
        secondRandomNumber === 0 &&
        thirdRandomNumber === 0 &&
        fourthRandomNumber === 0) ||
      (firstRandomNumber === secondRandomNumber &&
        secondRandomNumber === thirdRandomNumber &&
        thirdRandomNumber === fourthRandomNumber)
    );

    setQuestion(newEquation);
  };

  const onChangeAnswer = (event) => {
    setUserAnswer(event.target.value);
  };

  const onSubmitAnswer = (event) => {
    event.preventDefault();
    setUserAnswer("");
    let answer = nerdamer.solve(question, "x").toString();
    answer = answer.slice(0, -1);
    answer = answer.slice(1);
    setRightAnswer(answer);
    if (`${userAnswer}` == rightAnswer) {
      setShowConfetti(true);
      setEquationClasses("correct-answer");
      const audioElement = document.getElementById("correctAnswerAudio");
      if (audioElement) {
        audioElement.play();
      }
      createNewEquation();
    } else {
      setEquationClasses("wrong-answer");
      const audioElement = document.getElementById("wrongAnswerAudio");
      if (audioElement) {
        audioElement.play();
      }
      setShowWrongAnswerMessage(true);
    }
    setTimeout(() => {
      setShowConfetti(false);
      setShowWrongAnswerMessage(false);
      setEquationClasses("");
    }, 3500);
  };

  useEffect(() => {
    try {
      let solution = nerdamer.solve(question, "x").toString();
      solution = solution.slice(0, -1);
      solution = solution.slice(1);
      setRightAnswer(solution);
    } catch (e) {
      createNewEquation();
    }
  }, [question]);

  return (
    <div className="App">
      <div>
        <h1>האתר הרשמי לפתירת משוואות</h1>
        <h2>נוצר לכבוד מאיה</h2>
        <h3>באתר תוכלי לתרגל משוואות עד שתגיעי לשליטה מוחלטת</h3>
      </div>
      <div className={"equation-container " + equationClasses}>
        <BlockMath math={`${question}`} />
      </div>
      <div>{userAnswer && <InlineMath math={`(${userAnswer}) :תשובתך`} />}</div>
      {showWrongAnswerMessage && (
        <div className="wrong-answer-message">
          לא נורא! אני בטוח שתצליחי בניסיון הבא
        </div>
      )}
      <form onSubmit={onSubmitAnswer}>
        <input type="text" value={userAnswer} onChange={onChangeAnswer}></input>
        <button className="answer-button">שלחי תשובה</button>
      </form>
      <button className="new-question-button" onClick={createNewEquation}>
        קחי שאלה חדשה
      </button>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={400}
        />
      )}
      <audio id="correctAnswerAudio" hidden>
        <source src={correctAnswerSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio id="wrongAnswerAudio" hidden>
        <source src={wrongAnswerSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
