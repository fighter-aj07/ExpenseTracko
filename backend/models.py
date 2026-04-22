from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    description: str
    date: str
    idempotency_key: str

class Expense(ExpenseCreate):
    id: str = Field(default_factory=lambda: str(uuid4()))

class ExpenseResponse(BaseModel):
    expenses: List[Expense]
    total: float
