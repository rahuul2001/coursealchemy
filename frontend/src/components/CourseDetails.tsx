import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [fileFormat, setFileFormat] = useState("txt");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`https://coursealchemy-backend.onrender.com/api/courses/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleDownload = () => {
    const content =
      `Course Title: ${course.courseName}\n` +
      `Number of Weeks: ${course.weeks}\n` +
      `Description: ${course.description}\n` +
      `Difficulty Level: ${course.difficulty}\n\n` +
      `Course Structure:\n` +
      course.courseStructure
        .map(
          (week: any) =>
            `Week ${week["Week Number"]}: ${week["Topic Title"]}\n${week["Week Content"]}\n\n`
        )
        .join("");

    if (fileFormat === "txt") {
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${course.courseName || "course"}.txt`;
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
      doc.save(`${course.courseName || "course"}.pdf`);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center text-white">
        <p className="mt-20 text-lg font-medium animate-pulse">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white py-12 px-6">
      <div className="mt-20 container mx-auto max-w-4xl bg-white text-gray-800 rounded-lg shadow-lg p-8">
        {/* Course Header */}
        <h2 className="text-3xl font-bold text-purple-600 mb-4 font-poppins">
          {course.courseName}
        </h2>
        <p className="text-xl mb-4">{course.description}</p>
        <div className="mb-6">
          <p className="text-md font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Difficulty:</span> {course.difficulty}
          </p>
          <p className="text-md font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Weeks:</span> {course.weeks}
          </p>
        </div>

        {/* Course Structure */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Structure</h3>
          <div className="space-y-6">
            {course.courseStructure.map((week: any, index: number) => (
              <div
                key={index}
                className="bg-white border-l-4 border-purple-600 p-4 rounded-lg shadow-sm"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Week {week["Week Number"]}: {week["Topic Title"]}
                </h4>
                <p className="text-gray-700 text-sm">{week["Week Content"]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Download Widget */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Download Course Details</h3>
          <div className="flex items-center space-x-4">
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
      </div>
    </div>
  );
};

export default CourseDetails;
