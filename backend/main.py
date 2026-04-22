from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from models import Expense, ExpenseCreate, ExpenseResponse
# Fix: Ensure function names match what you use inside
from database import write_expenses, read_expenses 
import uuid
import os
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/expenses")
def add_expense(expense: ExpenseCreate):
    db_data = read_expenses()
    expenses_list = db_data.get("expenses", [])

    # Naya expense object create karna (ID ke saath)
    new_expense = expense.dict()
    new_expense["id"] = str(uuid.uuid4())
    
    expenses_list.append(new_expense)
    
    # Database (JSON file) mein save karna
    write_expenses({"expenses": expenses_list})
    
    return new_expense

@app.get("/expenses", response_model=ExpenseResponse)
def get_expenses(category: Optional[str] = None, sort: Optional[str] = None):
    db_data = read_expenses()
    expenses_list = db_data.get("expenses", [])
    
    print(f"Received filter: category={category}") # Debugging

    if category and category != "All":
        expenses_list = [e for e in expenses_list if e.get('category', '').lower() == category.lower()]
    
    if sort == "date_desc":
        expenses_list.sort(key=lambda x: x.get('date', ''), reverse=True)
        
    current_total = sum(float(e.get('amount', 0)) for e in expenses_list)
    return {"expenses": expenses_list, "total": current_total}

# Agar aapne POST route likha hai toh wo yahan aayega...

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    # Render ke liye yahan "main:app" string format sahi hai
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)