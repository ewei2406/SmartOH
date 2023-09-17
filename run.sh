#!/bin/bash

# Start the backend server
(
  cd backend
  npm install
  npm run dev
) &

# Start the frontend server
(
  cd frontend
  npm install
  npm run dev
) &

# Start the FastAPI server
(
  pip install -r requirements.txt
  cd deep-learning
  uvicorn similarity:app --reload
)
