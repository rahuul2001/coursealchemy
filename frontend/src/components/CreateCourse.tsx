import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [weeks, setWeeks] = useState(4);
  const [parsedCourseStructure, setParsedCourseStructure] = useState([]);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fileFormat, setFileFormat] = useState("txt");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.token) {
      setToken(userData.token);
      console.log("User ID:", userData.userId);
    } else {
      console.warn("No user logged in.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/courses/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseName, description, difficulty, weeks }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const courseArray = data.courseStructure
          .split("----------")
          .map((week: string) => {
            const [weekHeader, ...weekContent] = week.trim().split(" - ");
            const weekNumberMatch = weekHeader.match(/Week (\d+): (.+)/);
            if (weekNumberMatch) {
              return {
                "Week Number": parseInt(weekNumberMatch[1], 10),
                "Topic Title": weekNumberMatch[2].trim(),
                "Week Content": weekContent.join(" - ").trim(),
              };
            }
            return null;
          })
          .filter((week: any) => week);

        setParsedCourseStructure(courseArray);
        console.log("Parsed Course Structure:", courseArray);
      } else {
        console.error("Failed to generate course structure.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/courses/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName,
          description,
          difficulty,
          weeks,
          courseStructure: parsedCourseStructure,
          token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Course saved successfully:", data);
        setSuccessMessage("Course successfully saved to dashboard!");
      } else {
        console.error("Failed to save course.");
        alert("Failed to save course.");
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleDownload = () => {
    const content =
      `Course Title: ${courseName}\nNumber of Weeks: ${weeks}\nDescription: ${description}\nDifficulty Level: ${difficulty}\n\nCourse Structure:\n` +
      parsedCourseStructure
        .map(
          (week) =>
            `Week ${week["Week Number"]}: ${week["Topic Title"]}\n${week["Week Content"]}\n\n`
        )
        .join("");

    if (fileFormat === "txt") {
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${courseName || "course"}.txt`;
      link.click();
    } else if (fileFormat === "pdf") {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "A4",
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const horizontalMargin = 40;
      const wrappedText = doc.splitTextToSize(
        content,
        pageWidth - horizontalMargin
      );

      doc.text(wrappedText, 20, 30);
      doc.save(`${courseName || "course"}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white flex items-center justify-center">
      <div className="m-12 w-full max-w-3xl bg-white text-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center font-poppins mb-6 text-purple-600">
          Create a New Course
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input fields */}
          <div>
            <label
              htmlFor="courseName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              What do you want to name your course?
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Could you tell us about what do you expect in this course?
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
          </div>
          {/* Difficulty and Weeks */}
          <div>
            <label
              htmlFor="difficulty"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Choose a difficulty level:
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="weeks"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              For how many weeks do you want to structure this course?
            </label>
            <input
              type="number"
              id="weeks"
              value={weeks}
              onChange={(e) => setWeeks(parseInt(e.target.value, 10))}
              min="1"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg transition duration-300 transform hover:scale-105 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/50 active:scale-95 active:bg-purple-800"
          >
            Generate Course
          </button>
        </form>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {parsedCourseStructure.length > 0 && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Generated Course Structure
            </h2>
            <ul className="list-disc pl-6">
              {parsedCourseStructure.map((week, index) => (
                <li key={index}>
                  <strong>{`Week ${week["Week Number"]}: ${week["Topic Title"]}`}</strong>
                  <p>{week["Week Content"]}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg transition duration-300 transform hover:scale-105 hover:bg-green-700 shadow-lg hover:shadow-green-500/50 active:scale-95 active:bg-green-800"
            >
              Save to Dashboard
            </button>
            <div className="mt-4 flex items-center space-x-4">
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="txt">.txt</option>
                <option value="pdf">.pdf</option>
              </select>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg transition duration-300 transform hover:scale-105 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50 active:scale-95 active:bg-blue-800"
              >
                Download as {fileFormat.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateCourse;
