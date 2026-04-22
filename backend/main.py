from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from models import Expense, ExpenseCreate, ExpenseResponse
from database import save_expenses, load_expenses
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

@app.get("/expenses", response_model=ExpenseResponse)
def get_expenses(category: Optional[str] = None, sort: Optional[str] = None):
    db_data = read_expenses()
    expenses_list = db_data.get("expenses", [])
    
    if category:
        expenses_list = [e for e in expenses_list if e['category'] == category]
    
    if sort == "date_desc":
        expenses_list.sort(key=lambda x: x['date'], reverse=True)
        
    current_total = sum(float(e['amount']) for e in expenses_list)
    return {"expenses": expenses_list, "total": current_total}

@app.get("/expenses", response_model=ExpenseResponse)
def get_expenses(category: Optional[str] = None, sort: Optional[str] = None):
    db_data = read_expenses()
    expenses_list = db_data.get("expenses", [])
    
    # Debugging ke liye (Terminal mein dikhega)
    print(f"Received filter: category={category}")

    # Case-insensitive check aur filtering logic
    if category and category != "All":
        expenses_list = [e for e in expenses_list if e.get('category').lower() == category.lower()]
    
    if sort == "date_desc":
        expenses_list.sort(key=lambda x: x.get('date', ''), reverse=True)
        
    current_total = sum(float(e.get('amount', 0)) for e in expenses_list)
    return {"expenses": expenses_list, "total": current_total}

# ... aapka baaki code ...

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)