import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableBranch, RunnableSequence } from "langchain/schema/runnable";

const { fromTemplate } = PromptTemplate;

const llm = new OpenAI({
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

const chat = new ChatOpenAI({
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const modelIdentity =
  "You are a warm and wise mentor named Pupil. You are infinitely patient, infinitely kind, and see great potential in everyone. You are tutoring a student through a module their teacher has prepared.";

async function generateBaseContext({ studentProfile, module }) {
  const promptTemplate = fromTemplate(`{modelIdentity}
Module title: {moduleTitle}.
Description: {moduleDescription}
Student's name: {studentName}
Student's grade: {studentGrade}
Teacher's description of student: {teacherInput}
Student's description of themselves: {studentInput}`);

  const promptData = {
    modelIdentity,
    moduleTitle: module.title,
    moduleDescription: module.description,
    studentName: studentProfile.name,
    studentGrade: studentProfile.grade,
    teacherInput: studentProfile.teacherInput,
    studentInput: studentProfile.studentInput,
  };

  const prompt = await promptTemplate.format(promptData);
  return prompt;
}

export async function generateIntro({ studentProfile, module }) {
  const baseContext = await generateBaseContext({ studentProfile, module });

  const promptTemplate = fromTemplate(`{baseContext}
Write an extremely short and brief introductory message to say hello to the student and introduce them to what you will be talking about today. Stay focused on the lesson module and do not bring up any other topics. At the end, ask them if they are ready to begin the lesson.
Message:`);

  const prompt = await promptTemplate.format({ baseContext });

  const res = await llm.call(prompt);

  return res;
}

export async function handleAnswer({
  studentProfile,
  module,
  questionNumber,
  chatState,
  chatHistory,
  studentAnswer,
}) {
  const baseContext = await generateBaseContext({ studentProfile, module });

  const promptHeader = `You asked your student a question
  Question: ${module.questions[questionNumber]}
  Correct answer: ${module.answers[questionNumber].slice(-1)}
  Student's answer: ${studentAnswer}`;

  const answerAccuracyTemplate = fromTemplate(
    `{promptHeader}
Is the student's answer accurate or inaccurate? If inaccurate, please indicate whether the error is a simple mistake or a fundamental misunderstanding.
Reply ONLY with one of the three options:
Option 1: Assessment: accurate
Option 2: Assessment: inaccurate - simple mistake
Option 3: Assessment: inaccurate - fundamental misunderstanding
Assessment:`
  );

  console.log("a");

  const answerAccuracyChain = RunnableSequence.from([
    answerAccuracyTemplate,
    chat,
    new StringOutputParser(),
  ]);

  const accurateTemplate = fromTemplate(
    `{baseContext}
{promptHeader}
You judged that their answer was accurate. Congratulate them and reinforce the part of their answer that showed their understanding.
Response:`
  ).pipe(chat);

  const inaccurateSimpleTemplate = fromTemplate(
    `{baseContext}
{promptHeader}
You judged their answer was inaccurate, but that it was a simple mistake. Tell them the correct answer and explain their mistake.
Response:`
  ).pipe(chat);

  const inaccurateFundamentalTemplate = fromTemplate(
    `{baseContext}
{promptHeader}
You judged their answer was inaccurate, and that the inaccuracy indicated a fundamental misunderstanding. Prompt them to think about the question in a different way without revealing the answer.
Response:`
  ).pipe(chat);

  const fallbackTemplate = fromTemplate(
    `{baseContext}
{promptHeader}
You were not able to confidently judge the accuracy of your student's answer. Reveal the answer and explain why you are uncertain.
Response:`
  ).pipe(chat);

  const branch = RunnableBranch.from([
    [
      ({ assessment }) => {
        const pre = assessment.toLowerCase();
        return pre.includes("accurate") && !pre.includes("inaccurate");
      },
      accurateTemplate,
    ],
    [
      ({ assessment }) => {
        const pre = assessment.toLowerCase();
        return pre.includes("inaccurate") && pre.includes("simple mistake");
      },
      inaccurateSimpleTemplate,
    ],
    [
      ({ assessment }) => {
        const pre = assessment.toLowerCase();
        return (
          pre.includes("inaccurate") &&
          pre.includes("fundamental misunderstanding")
        );
      },
      inaccurateFundamentalTemplate,
    ],
    fallbackTemplate,
  ]);

  const fullChain = RunnableSequence.from([
    {
      assessment: answerAccuracyChain,
      baseContext: ({ baseContext }) => baseContext,
      promptHeader: ({ promptHeader }) => promptHeader,
    },
    branch,
  ]);

  const result = await fullChain.invoke({
    baseContext,
    promptHeader,
  });

  console.log(result);

  return result.content;
}
