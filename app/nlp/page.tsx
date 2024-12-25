"use client";

import React, { useState } from "react";

interface ApiResponse {
  text: string;
  array_2: string[];
}

const NLPMainPage = () => {
  const [inputText, setInputText] = useState("");
  const [predictionResults, setPredictionResults] = useState<ApiResponse>({
    text: "",
    array_2: [],
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/nlp/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setPredictionResults(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(["An unknown error occurred"]);
      }
    }
  };

  const handleReset = () => {
    setInputText("");
    setPredictionResults({ text: "", array_2: [] });
    setErrors([]);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex row-start-2 items-center sm:items-start max-w-3xl mx-auto w-1/2">
        <div className="min-w-full block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Try out our new NLP model!
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            CRF Model in Natural Language Processing (NLP)!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="input_text"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter text:
              </label>
              <textarea
                rows={4}
                id="input_text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Paste your text here"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
              <button
                type="reset"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>

          {errors.length > 0 && (
            <div className="mt-6">
              <h5 className="mb-2 text-xl font-bold tracking-tight text-red-600 dark:text-red-400">
                Errors:
              </h5>
              <ul className="list-disc pl-5">
                {errors.map((error, index) => (
                  <li
                    key={index}
                    className="font-normal text-red-600 dark:text-red-400"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {predictionResults.text && (
            <div className="mt-6">
              <p className="text-gray-500 dark:text-gray-400">
                <a
                  href="#"
                  className="font-semibold text-gray-900 underline dark:text-white decoration-green-500"
                >
                  B
                </a>
                : Beginning of a named entity ;{" "}
                <a
                  href="#"
                  className="font-semibold text-gray-900 underline dark:text-white decoration-sky-500"
                >
                  I
                </a>
                : Inside of a named entity
                .
              </p>

              <p className="font-normal text-gray-700 dark:text-gray-400">
                <strong>Prediction:</strong>{" "}
                {predictionResults.text.split(" ").map((word, index) => {
                  const tag = predictionResults.array_2[index];
                  let className =
                    "font-normal text-gray-700 dark:text-gray-400";
                  if (tag === "B") {
                    className =
                      "font-semibold text-gray-900 underline dark:text-white decoration-green-500";
                  } else if (tag === "I") {
                    className =
                      "font-semibold text-gray-900 underline dark:text-white decoration-sky-500";
                  }
                  return (
                    <span key={index} className={className}>
                      {word}{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NLPMainPage;
