from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import openai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize SentenceTransformer model and OpenAI API key
model = SentenceTransformer('all-MiniLM-L6-v2')
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()


def your_similarity_function(target_string: str, string_list: list[str]):
    # Compute embeddings for both lists
    embeddings1 = model.encode([target_string], convert_to_tensor=True)
    embeddings2 = model.encode(string_list, convert_to_tensor=True)

    # Compute cosine-similarities
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    return cosine_scores.tolist()

def compute_current_topic(question_list):


    messages = [ {"role": "system", "content": 
                "You are a intelligent assistant."} ]


    prompts = [
        f"You are a bot designed to summarize a list of questions from students in the waiting list for a computer science office hours. Given the below questions, what are three words or less that would be most helpful for other students to know to identify whether they have similar problems? The questions are:  {str(question_list)}",
        "How would you summarize these problems in one thought and three or fewer words? Keep your response to a single line."
    ]
    for i in range(2):
        message = prompts[i]

        if message:
            messages.append(
                {"role": "user", "content": message},
            )
            chat = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=messages
            )
        reply = chat.choices[0].message.content
        print(f"ChatGPT: {reply}")
        if i == 1:
            return reply
        messages.append({"role": "assistant", "content": reply})

    return reply

class SimilarityInput(BaseModel):
    target_string: str
    string_list: list[str]

"""
    {
        "target_string": "What is Dijkstra's algorithm?",
        "string_list": [
            "How does bubble sort work?",
            "What is dynamic programming?",
            "How do you find the shortest path in a weighted graph?"
        ]
    }
"""
@app.post("/similarity")
def calculate_similarity(data: SimilarityInput):
    
    target_string = data.target_string
    string_list = data.string_list

    if not target_string or not string_list:
        raise HTTPException(status_code=400, detail="Both target_string and string_list must be provided")

    try:
        similarity_scores = your_similarity_function(target_string, string_list)
        return {"similarity_scores": similarity_scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class TopicInput(BaseModel):
    questions: list[str]

"""
    {
        "questions": [
            "How does bubble sort work?",
            "What is dynamic programming?",
            "How do you find the shortest path in a weighted graph?"
        ]
    }
"""
@app.post("/current-topic")
def get_current_topic(data: TopicInput):

    question_list = data.questions

    if not question_list:
        raise HTTPException(status_code=400, detail="No questions provided")

    try:
        current_topic = compute_current_topic(question_list)
        return {"current_topic": current_topic}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

