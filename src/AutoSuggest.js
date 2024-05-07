import React, { useState, useEffect } from "react";

const AutoSuggest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://dictionaryapi.com/api/v3/references/sd2/json/${searchTerm}?key=95454221-2935-4778-b4e6-be2ca5ede0cb`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setError(null);
          const processedData = data.map((entry) => {
            if (typeof entry === "string") {
              return { word: entry };
            } else {
              return {
                word: entry.meta.id,
                pronunciation: entry.hwi.prs?.[0]?.mw,
                partOfSpeech: entry.fl,
                definitions: entry.shortdef,
              };
            }
          });
          setSearchResults(processedData);
        } else {
          setError("Unexpected data format from the API");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    const delayDebounce = setTimeout(handleSearch, 10);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (word) => {
    setSearchTerm(word);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Type a word..."
      />
      {error && <p>{error}</p>}
      <ul>
        {searchResults.map((result, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(result.word)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <p>Word: {result.word}</p>
              {result.pronunciation && (
                <p>Pronunciation: {result.pronunciation}</p>
              )}
              {result.partOfSpeech && (
                <p>Part of Speech: {result.partOfSpeech}</p>
              )}
              {result.definitions && (
                <ul>
                  {result.definitions.map((def, idx) => (
                    <li key={idx}>{def}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoSuggest;
