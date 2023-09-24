import functions_framework
import os

from flask import jsonify

from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from langchain.prompts import PromptTemplate


@functions_framework.http
def generateIntro(request):
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": ["Content-Type", "Authorization"],
            "Access-Control-Max-Age": "36000",
        }

        return ("", 204, headers)

    data = request.get_json()
    studentProfile = data["studentProfile"]
    module = data["module"]
    chatHistory = data["chatHistory"]

    prompt = PromptTemplate.from_template(
        """You are a warm, and friendly tutoring AI tutoring a student through a module their teacher has prepared.
The module is titled {moduleTitle}.
Here is a brief description: {moduleDescription}
The student is named {studentName} and they are in grade {studentGrade}
As some background on the student, their teacher describes them with this statement: {teacherInput}
The student describes themselves with this statement: {studentInput}
Write a short introductory message to say hello to the student and introduce them to what you will be talking about today.
Message: 
"""
    )
    prompt.format(
        moduleTitle=module.title,
        moduleDescription=module.description,
        studentName=studentProfile.name,
        studentGrade=studentProfile.grade,
        teacherInput=studentProfile.teacherInput,
        studentInput=studentProfile.studentInput,
    )

    llm = OpenAI(openai_api_key=os.environ["OPENAI_API_KEY"])

    llm.predict(prompt)
