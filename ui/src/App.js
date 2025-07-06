import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [choices, setChoices] = useState([]);
  const [randomChocie, setRandomChoices] = useState(null)
  const [result, setResult] = useState(null);
  const [winnerClass, setWinnerClass] = useState("");
  const [gameHistory, setGameHistory] = useState(() => {
  const saved = localStorage.getItem("gameHistory");
  return saved ? JSON.parse(saved) : [];
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [playerScore, setPlayerScore] = useState(() => {
  const saved = localStorage.getItem("playerScore");
  return saved ? parseInt(saved) : 0;
  });
  const [computerScore, setComputerScore] = useState(() => {
  const saved = localStorage.getItem("computerScore");
  return saved ? parseInt(saved) : 0;
  });
  const emojiMap = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
  lizard: "🤏",
  spock: "🖖",
  dead: "💀"
};
  useEffect(() => {
    fetch("http://localhost:8000/choices")
      .then(res => res.json())
      .then(data => setChoices(data));
  }, []);

  async function handleClick(id) {
    if (isDisabled) return;

    setIsDisabled(true);

    function getChoiceNameById(choiceId) {
      const choice = choices.find(c => c.id === choiceId);
      return choice ? choice.name : null;
    }

    try {
      const response = await fetch("http://localhost:8000/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ player: id })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      let winner = "tie";
      if (data.results === "win") {
        winner = "player";
        setPlayerScore(score => score + 1);
      } else if (data.results === "lose") {
        winner = "computer";
        setComputerScore(score => score + 1);
      }

      setWinnerClass(winner);

      setGameHistory(prev => [
        {
          player: data.player,
          computer: data.computer,
          result: data.results
        },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      setResult({
        player: getChoiceNameById(id),
        computer: "dead",
        results: "error"
      });

      setWinnerClass("tie");

    } finally {
      setTimeout(() => {
        setWinnerClass("");
        setIsDisabled(false);
      }, 1000);
    }
  }
  
  useEffect(() => {
    localStorage.setItem("playerScore", playerScore);
  }, [playerScore]);

  useEffect(() => {
    localStorage.setItem("computerScore", computerScore);
  }, [computerScore]);

  useEffect(() => {
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }, [gameHistory]);

  function fetchRandom() {
    fetch("http://localhost:8000/choice")
      .then(res => res.json())
      .then(data => setRandomChoices(data));
  }

  return (
    <body style={{ backgroundColor: '#dbe8d8' }}>
      <div style={{
          padding: 40, textAlign: "center" }}>
      <h1>Rock - Paper - Scissors - Lizard - Spock</h1>

      {choices.map(c => (
        <button key={c.id} onClick={() => handleClick(c.id)} style={{ fontSize: 60, margin: 10}}>
          {emojiMap[c.name]}
        </button>
      ))}
      </div>

      <div class="parent">
        <div class="result">
            <div class="child">
              <h2 style={{ display: "flex", justifyContent: "center" }}> PLAYER </h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h2 className={  winnerClass === "player"
                                ? "winner"
                                : winnerClass === "tie"
                                ? "tie"
                                : ""} style={{ fontSize: 50, margin: 10}}>
                                  {result ? emojiMap[result.player] : "🖐️"}
                </h2>
                </div>
                <h2 style={{ fontSize: 50, margin: 10, display: "flex", justifyContent: "center" }}>{playerScore}</h2>
            </div>

            <div class="child" style={{ width: "10%" }}>
              <div class="center">
                <div class="center-buttons" >
                  <button onClick={() => fetchRandom()} style={{ fontSize: 60, margin: 10}} title="Get random choice">{randomChocie ? emojiMap[randomChocie.name] : "❓"} </button>
                </div>
                <div class="center-buttons">
                  <button onClick={() => {
                      setPlayerScore(0);
                      setComputerScore(0);
                      setGameHistory([]);
                      setResult(null);
                      setRandomChoices(null);
                      localStorage.removeItem("playerScore");
                      localStorage.removeItem("computerScore");
                      localStorage.removeItem("gameHistory");
                      }}
                      style={{ fontSize: 60, margin: 10}}
                      title="Restart the game"
                      >🔄</button>
                </div>
              </div>
            </div>

            <div class="child">
              <h2 style={{ display: "flex", justifyContent: "center" }}> COMPUTER </h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h2 className={  winnerClass === "computer"
                                ? "winner"
                                : winnerClass === "tie"
                                ? "tie"
                                : ""} style={{ fontSize: 50, margin: 10}}>
                                  {result ? emojiMap[result.computer] : "🖐️"}
                </h2>
                </div>
                <h2 style={{ fontSize: 50, margin: 10, display: "flex", justifyContent: "center"}}>{computerScore}</h2>
            </div>
        </div>
      <div class="list-parrent">
        <ul style={{ fontFamily: "monospace", padding: 0 }}>
          {gameHistory.map((r, idx) => {
            let bgColor = "";
            if (r.result === "win") bgColor = "#d4ffd4";
            else if (r.result === "lose") bgColor = "#ffd4d4";
            else if (r.result === "tie") bgColor = "#e0e0e0";

            return (
              <li
                key={idx}
                style={{
                  fontSize: 18,
                  backgroundColor: bgColor,
                  padding: "5px 10px",
                  marginBottom: 4,
                  borderRadius: 8,
                  listStyle: "none",
                }}
              >
                YOU: {emojiMap[r.player]} &nbsp;
                CPU: {emojiMap[r.computer]} &nbsp;
                RESULT: {r.result.toUpperCase()}
              </li>
            );
          })}
        </ul>
        </div>
      </div>
    </body>
  );
}

export default App;
