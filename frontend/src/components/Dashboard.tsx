import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://coursealchemy-backend.onrender.com/api/courses/allcourses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleRowClick = (courseId: string) => {
    navigate(`/dashboard/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate("/create-course"); // Redirect to the course creation page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white">
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-2xl mt-20 font-bold font-poppins mb-8">
          Courses created till now:
        </h1>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          {courses.length > 0 ? (
            <table className="w-full text-left text-gray-800 border-collapse">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="px-6 py-4 text-sm font-medium">Course Name</th>
                  <th className="px-6 py-4 text-sm font-medium">Description</th>
                  <th className="px-6 py-4 text-sm font-medium">Difficulty</th>
                  <th className="px-6 py-4 text-sm font-medium">Weeks</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course._id}
                    onClick={() => handleRowClick(course._id)}
                    className={`cursor-pointer hover:bg-purple-100 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">{course.courseName}</td>
                    <td className="px-6 py-4 text-sm truncate">{course.description}</td>
                    <td className="px-6 py-4 text-sm">{course.difficulty}</td>
                    <td className="px-6 py-4 text-sm">{course.weeks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                No courses here yet!
              </h2>
              <p className="text-gray-600 text-center mb-4">
                It looks like you haven't created any courses yet. Why not start
                your journey now and inspire others with your knowledge?
              </p>
              <button
                onClick={handleCreateCourse}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-all"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
