import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export async function generateIntro({ studentProfile, module }) {
  const llm = new OpenAI({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
  });

  const promptTemplate =
    PromptTemplate.fromTemplate(`You are a warm, and friendly tutoring AI tutoring a student through a module their teacher has prepared.
The module is titled {moduleTitle}.
Here is a brief description: {moduleDescription}
The student is named {studentName} and they are in grade {studentGrade}
As some background on the student, their teacher describes them with this statement: {teacherInput}
The student describes themselves with this statement: {studentInput}
Write a very short introductory message to say hello to the student and introduce them to what you will be talking about today.
Message: `);

  const promptData = {
    moduleTitle: module.title,
    moduleDescription: module.description,
    studentName: studentProfile.name,
    studentGrade: studentProfile.grade,
    teacherInput: studentProfile.teacherInput,
    studentInput: studentProfile.studentInput,
  };

  const prompt = await promptTemplate.format(promptData);

  const res = await llm.call(prompt);

  return res;
}
