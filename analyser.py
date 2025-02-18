from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

# Initialize FastAPI app
app = FastAPI()

# CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the JSON file
JSON_FILE = "./pcap-analyser/src/preprocessed_dataset.json"

# Global variable to store the loaded dataset
dataset = None

# Load the dataset when the backend starts
def load_dataset():
    global dataset
    if not os.path.exists(JSON_FILE):
        raise FileNotFoundError(f"JSON file not found: {JSON_FILE}")
    with open(JSON_FILE, "r") as file:
        dataset = json.load(file)

# Load the dataset when the backend starts
load_dataset()

# API endpoints
@app.get("/")
def home():
    """Root endpoint to check if the backend is running."""
    return {"status": "success", "message": "PCAP Analyser Backend is running!"}

@app.get("/apps")
def list_apps():
    """List all available apps."""
    try:
        apps = list(dataset.keys())
        return {"status": "success", "apps": apps}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/data")
def get_all_data():
    """Retrieve all preprocessed data."""
    try:
        return {"status": "success", "data": dataset}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/data/averages")
def get_averages():
    """Retrieve only the averages for all apps."""
    try:
        averages = {app: dataset[app]["average"] for app in dataset}
        return {"status": "success", "data": averages}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/data/{app_name}")
def get_app_data(app_name: str):
    """Retrieve data for a specific app."""
    try:
        if app_name not in dataset:
            return {"status": "error", "message": f"App '{app_name}' not found."}
        return {"status": "success", "data": dataset[app_name]}
    except Exception as e:
        return {"status": "error", "message": str(e)}