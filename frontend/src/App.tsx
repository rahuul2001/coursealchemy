import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import CreateCourse from "./components/CreateCourse";
import Dashboard from "./components/Dashboard";
import CourseDetails from "./components/CourseDetails";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // check local storage for existing token on app load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <Router>
      <Routes>
        {/* Protected route: If there's no token, redirect to SignIn */}
        <Route
          path="/"
          element={
            token ? (
              <>
                <Header />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/dashboard/:courseId"
          element={
            token ? (
              <>
                <Header />
                <CourseDetails />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        {/* Sign In route: If user is already logged in, redirect to Main */}
        <Route
          path="/signin"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <SignIn onSignIn={(tok) => handleSetToken(tok)} />
            )
          }
        />

        <Route
          path="/create-course"
          element={
            token ? (
              <>
                <Header />
                <CreateCourse />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              <>
                <Header />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        {/* Sign Up route: If user is already logged in, redirect to Main */}
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <SignUp onSignUp={(tok) => handleSetToken(tok)} />
            )
          }
        />

        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<Navigate to={token ? "/" : "/signin"} />} />
      </Routes>
    </Router>
  );
};

export default App;
