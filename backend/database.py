import json
import os

DB_FILE = "backend/data/expenses.json"

def read_expenses():
    if not os.path.exists(DB_FILE):
        return {"expenses": [], "total": 0.0}
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, ValueError):
        return {"expenses": [], "total": 0.0}

def write_expenses(data):
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)
