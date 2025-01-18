import express from "express";
import { generateCourseStructure } from "../controllers/courseGeneratorController.js";
import jwt from "jsonwebtoken";
import Course from "../models/Course.js";

const router = express.Router();

router.post("/generate", generateCourseStructure);

router.post("/save", async (req, res) => {
  try {
    const {
      courseName,
      description,
      difficulty,
      weeks,
      courseStructure,
      token,
    } = req.body;

    // verify user token
    console.log("token: ", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    console.log("decoded", decoded);
    const userId = decoded.userId;

    // create course
    const newCourse = await Course.create({
      courseName,
      description,
      difficulty,
      weeks,
      courseStructure,
      userId,
    });

    res
      .status(201)
      .json({ message: "Course saved successfully", course: newCourse });
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).json({ error: "Failed to save course" });
  }
});

// fetch all courses for a user
router.get("/allcourses", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.userId;

    const courses = await Course.find({ userId });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// fetch course details for an id
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});




export default router;
