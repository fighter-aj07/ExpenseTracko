import json
import os

# Current file (database.py) ki location se absolute path nikalna
# Isse local aur server dono jagah sahi path milega
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "data", "expenses.json")

def read_expenses():
    if not os.path.exists(DB_FILE):
        return {"expenses": [], "total": 0.0}
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, ValueError):
        return {"expenses": [], "total": 0.0}

def write_expenses(data):
    # Ensure folder exists
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)