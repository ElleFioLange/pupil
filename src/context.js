import { createContext } from "react";

export const initGlobalState = {
  studentProfile: {
    id: 1,
    name: "Jake",
    grade: 4,
    teacherInput:
      "Jake is a very hardworking young man, but he seems to struggle in math. Algebra questions in particular are tough for him, but he is good with his times tables",
    studentInput:
      "I really like reading books about racecars and superheroes. I have a red racecar bed and love to imagine racing fast!",
  },
  chatState: "intro",
  chatHistory: [
    {
      user: "student",
      content: "Hi this is a test message from the student",
    },
    {
      user: "model",
      content: "Hi this is a test message from the model",
    },
    {
      user: "student",
      content: "Hi this is a test message from the student",
    },
    {
      user: "model",
      content: "Hi this is a test message from the model",
    },
    {
      user: "student",
      content: "Hi this is a test message from the student",
    },
    {
      user: "model",
      content: "Hi this is a test message from the model",
    },
    {
      user: "student",
      content: "Hi this is a test message from the student",
    },
    {
      user: "model",
      content: "Hi this is a test message from the model",
    },
    {
      user: "student",
      content: "Hi this is a test message from the student",
    },
    {
      user: "model",
      content: "Hi this is a test message from the model",
    },
    {
      user: "student",
      content: "Hi this is a test message from the student",
    },
  ],
  module: {
    id: 1,
    title: "Algebra basics",
    description:
      "This module is meant to introduce students to the basics of algebra.",
    background: `Remember the three basic steps when solving algebra problems:
1. Get all the variables to one side.
2. Get all the constants to the other side.
3. Multiply or divide to cancel out any factors.

Also make sure to follow PEMDAS!
1. Parentheses
2. Exponents
3. Multiplication / Division
4. Addition / Subtraction`,
    questions: ["Solve for x: 8x - 15 = 25", "Solve for x: 3x + 10 = 8x"],
    answers: [
      ["8x - 15 = 25", "8x = 40", "x = 5"],
      ["3x + 10 = 8x", "-5x + 10 = 0", "-5x = -10", "x = 2"],
    ],
  },
};

export const GlobalContext = createContext(null);
