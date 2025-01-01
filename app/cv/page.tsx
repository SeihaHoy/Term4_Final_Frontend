"use client";

import React, { useState } from "react";

const CVMainPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [predictedImage, setPredictedImage] = useState<string | null>(null);
  const [OCR, setOCR] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!selectedFile) {
      setErrors(["Please select a file to upload."]);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/cv/create/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      console.log("Predicted image:", data.image_pred);
      setPredictedImage(`http://localhost:8000${data.image_pred}`);
      setOCR(data.text);
    } catch (error) {
      console.error("Failed to upload file:", error);
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(["An unknown error occurred."]);
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPredictedImage(null);
    setErrors([]);
    console.log("Resetting form");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex row-start-2 items-center sm:items-start max-w-3xl mx-auto w-1/2">
        <div className="min-w-full block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Computer Vision
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Upload an image to test our Khmer Text recognition model.
          </p>

          <form onSubmit={handleSubmit}>
            {preview ? (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Selected file"
                  className="max-w-full h-auto mb-4"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
            <div className="flex space-x-4 my-4">
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
          {predictedImage && (
            <div className="mt-4">
              <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Predicted Image:
              </h5>
              <img
                src={predictedImage}
                alt="Predicted file"
                className="max-w-full h-auto mb-4"
              />
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {Array.isArray(OCR) ? OCR.join(", ") : ""}
              </p>
            </div>
          )}
          {errors.length > 0 && (
            <div className="mt-4 text-red-500">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CVMainPage;
