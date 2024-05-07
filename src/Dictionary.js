import React, { useState } from "react";
import "./style.css";

const Dictionary = () => {
  const [inputWord, setInputWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [shortDefinitions, setShortDefinitions] = useState([]);
  const [error, setError] = useState("");

  const apiKey = "95454221-2935-4778-b4e6-be2ca5ede0cb"; // Use your actual API key

  const handleSearchClick = async () => {
    const url = `https://www.dictionaryapi.com/api/v3/references/sd2/json/${inputWord}?key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length) {
        const firstResult = data[0];
        setDefinition(
          firstResult.def[0]?.sseq[0][0][1]?.dt[0][1] || "No definition found"
        );
        setPronunciation(firstResult.hwi.prs[0]?.mw || "");
        setPartOfSpeech(firstResult.fl || "");
        setShortDefinitions(firstResult.shortdef || []);

        const audio = firstResult.hwi.prs[0]?.sound?.audio;
        const subdirectory = audio?.startsWith("bix")
          ? "bix"
          : audio?.startsWith("gg")
          ? "gg"
          : audio?.match(/^[^a-zA-Z]/)
          ? "number"
          : audio?.charAt(0);

        setAudioUrl(
          audio
            ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audio}.mp3`
            : ""
        );
        setError("");
      } else {
        setError("No definition found.");
        clearFields();
      }
    } catch (error) {
      console.error("Error fetching the definition:", error);
      setError("Error fetching the definition.");
      clearFields();
    }
  };

  const clearFields = () => {
    setDefinition("");
    setPronunciation("");
    setPartOfSpeech("");
    setShortDefinitions([]);
    setAudioUrl("");
  };

  const handleInputChange = (event) => {
    setInputWord(event.target.value);
  };

  const handlePlayClick = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <input
          type="text"
          value={inputWord}
          onChange={handleInputChange}
          placeholder="Enter a word..."
        />
        <button onClick={handleSearchClick}>Search</button>
        <button onClick={handlePlayClick} disabled={!audioUrl}>
          Play Pronunciation
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="result-container">
        <span className="word-value">{inputWord}</span>
        <p className="label">Pronunciation:</p>
        <span className="value">{pronunciation}</span>
        <p className="label">Part of Speech:</p>
        <span className="value">{partOfSpeech}</span>
        <p className="label">Definition:</p>
        <span className="value">{definition}</span>
        <p className="label">Short Definitions:</p>
        <span className="value">{shortDefinitions.join(", ")}</span>
      </div>
    </div>
  );
};

export default Dictionary;
