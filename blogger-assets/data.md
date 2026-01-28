Done — below is the upgraded course document with **3 code samples per section**, and BOTH projects now include **Undo + Redo** (multi-step), using an **undo stack + redo stack** (snapshots).

---

# Python Starter Course — Farewell Document (3 Samples/Section + Full Projects with Undo/Redo)

## 1) Introduction to Python, VS Code Setup, Hello World

### Introduction

Python is simple, readable, and powerful — used in automation, web, data science, AI, scripting, and apps.

### Explanation

You learned how to install Python, use VS Code, run `.py` files, and read output.

### Importance

If you can run code confidently, you can build anything step-by-step.

### Code Samples (3)

```python
# Sample 1: First program
print("Hello World")
```

```python
# Sample 2: Multiple prints
print("Welcome to Python!")
print("Programmer’s Picnic — Python Starter Course")
```

```python
# Sample 3: Printing with variables
course = "Python Starter"
batch = "7 PM"
print("Course:", course)
print("Batch:", batch)
```

---

## 2) Input, print, and f-strings (`f""`) in detail

### Introduction

Input makes programs interactive.

### Explanation

- `input()` returns **string**
- Convert using `int()`, `float()`
- f-strings give clean formatting: `f"{x}"`

### Importance

Every real program takes input and shows structured output.

### Code Samples (3)

```python
# Sample 1: Simple input
name = input("Enter name: ")
print("Hello", name)
```

```python
# Sample 2: Type conversion
age = int(input("Enter age: "))
print("Next year:", age + 1)
```

```python
# Sample 3: f-string formatting
name = input("Name: ")
marks = float(input("Marks: "))
print(f"Student: {name} | Marks: {marks:.2f}")
```

---

## 3) Arithmetic Operators + BODMAS Priorities

### Introduction

Math operations power billing, scoring, averages, discounts, GST, etc.

### Explanation

Operators:
`+ - * / // % **`
Precedence (high → low): `()`, `**`, `* / // %`, `+ -`

### Importance

Correct precedence prevents wrong logic and wrong calculations.

### Code Samples (3)

```python
# Sample 1: All operators
a, b = 10, 3
print(a + b, a - b, a * b)
print(a / b, a // b, a % b)
print(a ** b)
```

```python
# Sample 2: Precedence demo
print(10 + 2 * 3)      # 16
print((10 + 2) * 3)    # 36
```

```python
# Sample 3: Real use (average + remainder)
total = 251
students = 4
print("Average:", total / students)
print("Remaining:", total % students)
```

---

## 4) Conditional and Logical Operators

### Introduction

Conditions allow decision-making.

### Explanation

Relational: `> < >= <= == !=`
Logical: `and`, `or`, `not`

### Importance

Used in eligibility, grading, filters, validation, security checks.

### Code Samples (3)

```python
# Sample 1: Relational checks
x = 12
print(x > 10)
print(x == 12)
```

```python
# Sample 2: Logical AND/OR
age = 19
has_id = True
print(age >= 18 and has_id)
print(age < 18 or not has_id)
```

```python
# Sample 3: Combined condition
marks = 72
attendance = 80
print(marks >= 33 and attendance >= 75)
```

---

## 5) If-Else in full detail + Ternary

### Introduction

If-else chooses actions based on conditions.

### Explanation

- `if` checks first condition
- `elif` checks more
- `else` fallback
- ternary = compact if-else

### Importance

This is the backbone of program “intelligence”.

### Code Samples (3)

```python
# Sample 1: if-else
n = int(input("Enter n: "))
if n % 2 == 0:
    print("Even")
else:
    print("Odd")
```

```python
# Sample 2: if-elif-else
m = int(input("Marks: "))
if m >= 90:
    print("A+")
elif m >= 75:
    print("A")
elif m >= 60:
    print("B")
else:
    print("Needs practice")
```

```python
# Sample 3: ternary
score = int(input("Score: "))
status = "Pass" if score >= 33 else "Fail"
print(status)
```

---

## 6) Loops — while (basics)

### Introduction

Loops repeat instructions.

### Explanation

`while condition:` runs until condition becomes false.

### Importance

Used in menus, retries, validation, games.

### Code Samples (3)

```python
# Sample 1: counting
i = 1
while i <= 5:
    print(i)
    i += 1
```

```python
# Sample 2: sum of numbers
n = 5
i = 1
s = 0
while i <= n:
    s += i
    i += 1
print("Sum:", s)
```

```python
# Sample 3: input until correct
while True:
    x = input("Type YES to continue: ").strip().upper()
    if x == "YES":
        print("Great!")
        break
    print("Try again...")
```

---

## 7) For loops using `range()`

### Introduction

For loop is best when repetition count is known.

### Explanation

- `range(stop)`
- `range(start, stop)`
- `range(start, stop, step)`

### Importance

Used in tables, sequences, arrays/lists, patterns.

### Code Samples (3)

```python
# Sample 1
for i in range(5):
    print(i)
```

```python
# Sample 2
for i in range(1, 6):
    print(i)
```

```python
# Sample 3
for i in range(10, 0, -2):
    print(i)
```

---

## 8) While loops (practice / deeper)

### Explanation + Importance

Used when repetition depends on user choice or a condition.

### Code Samples (3)

```python
# Sample 1: password attempts
pwd = "python"
attempts = 0
while attempts < 3:
    g = input("Password: ")
    if g == pwd:
        print("Login OK")
        break
    attempts += 1
else:
    print("Locked")
```

```python
# Sample 2: keep taking numbers until 0
total = 0
while True:
    n = int(input("Enter number (0 to stop): "))
    if n == 0:
        break
    total += n
print("Total:", total)
```

```python
# Sample 3: menu-style loop mini
while True:
    print("1.Add  2.Exit")
    ch = input("Choice: ")
    if ch == "1":
        print("Added (demo)")
    elif ch == "2":
        break
    else:
        print("Invalid")
```

---

## 9) Nested loops — prime numbers

### Introduction

Nested loops help check multiple factors or combinations.

### Explanation

Prime: divisible by only 1 and itself.

### Importance

Builds strong logic + breaking/optimizing.

### Code Samples (3)

```python
# Sample 1: prime check basic
n = int(input("n: "))
if n < 2:
    print("Not prime")
else:
    prime = True
    for i in range(2, n):
        if n % i == 0:
            prime = False
            break
    print("Prime" if prime else "Not prime")
```

```python
# Sample 2: optimized prime check
n = int(input("n: "))
if n < 2:
    print("Not prime")
else:
    prime = True
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            prime = False
            break
    print("Prime" if prime else "Not prime")
```

```python
# Sample 3: primes in a range
start, end = 2, 50
for n in range(start, end + 1):
    prime = n >= 2
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            prime = False
            break
    if prime:
        print(n, end=" ")
print()
```

---

## 10) Nested loops — pattern programs

### Introduction

Patterns teach row/column thinking.

### Explanation

Outer loop = rows, inner loop = columns.

### Importance

Strengthens logic and loop confidence quickly.

### Code Samples (3)

```python
# Sample 1: left triangle
rows = 5
for r in range(1, rows + 1):
    for c in range(r):
        print("*", end="")
    print()
```

```python
# Sample 2: numbers per row
rows = 5
for r in range(1, rows + 1):
    for c in range(1, r + 1):
        print(c, end=" ")
    print()
```

```python
# Sample 3: reverse triangle
rows = 5
for r in range(rows, 0, -1):
    for c in range(r):
        print("*", end="")
    print()
```

---

## 11) List

### Explanation

Ordered, mutable collection.

### Importance

Most used DS for storing sequences.

### Code Samples (3)

```python
# Sample 1
a = [10, 20, 30]
print(a[0], a[-1])
```

```python
# Sample 2
a = [1, 2, 3]
a.append(4)
a.remove(2)
print(a)
```

```python
# Sample 3
nums = [5, 2, 9, 1]
nums.sort()
print(nums)
```

---

## 12) Dictionary

### Explanation

Key-value records.

### Importance

Perfect for StudentDB, JSON, fast lookup.

### Code Samples (3)

```python
# Sample 1
student = {"roll": 1, "name": "Amit"}
print(student["name"])
```

```python
# Sample 2
student = {"roll": 1, "name": "Amit"}
student["marks"] = 88
print(student)
```

```python
# Sample 3
db = {101: {"name": "Ravi"}, 102: {"name": "Neha"}}
for roll, info in db.items():
    print(roll, info["name"])
```

---

## 13) Tuple

### Explanation

Ordered but immutable.

### Importance

Fixed data, unpacking, safer than list for constants.

### Code Samples (3)

```python
# Sample 1
t = (10, 20)
print(t)
```

```python
# Sample 2
x, y = (5, 7)
print(x, y)
```

```python
# Sample 3
coords = [(1, 2), (3, 4)]
for x, y in coords:
    print(x + y)
```

---

## 14) Set

### Explanation

Unique unordered collection.

### Importance

Remove duplicates, set operations.

### Code Samples (3)

```python
# Sample 1
s = {1, 2, 2, 3}
print(s)
```

```python
# Sample 2
a = {1, 2, 3}
b = {3, 4}
print(a | b)  # union
```

```python
# Sample 3
a = {1, 2, 3}
b = {2, 3, 5}
print(a & b)  # intersection
print(a - b)  # difference
```

---

## 15) Frozen DS (frozenset)

### Explanation

Immutable set.

### Importance

Used when uniqueness + immutability is needed (safe keys, fixed groups).

### Code Samples (3)

```python
# Sample 1
fs = frozenset([1, 2, 2, 3])
print(fs)
```

```python
# Sample 2
group = frozenset(["A", "B"])
print("A" in group)
```

```python
# Sample 3 (frozenset as dict key)
d = {frozenset([1, 2]): "pair"}
print(d[frozenset([1, 2])])
```

---

## 16) Menu using infinite while loops

### Explanation

Menu repeats until Exit is chosen.

### Importance

Base of console apps (StudentDB, quiz apps, tools).

### Code Samples (3)

```python
# Sample 1
while True:
    print("1. Hi  2. Exit")
    ch = input("Choice: ")
    if ch == "1":
        print("Hi!")
    elif ch == "2":
        break
```

```python
# Sample 2 (validated choice)
while True:
    ch = input("Enter 1/2: ").strip()
    if ch in ("1", "2"):
        print("OK")
        break
    print("Invalid")
```

```python
# Sample 3 (menu with actions)
items = []
while True:
    print("1.Add 2.View 3.Exit")
    ch = input("Choice: ")
    if ch == "1":
        items.append(input("Item: "))
    elif ch == "2":
        print(items)
    elif ch == "3":
        break
```

---

## 17) Pickle

### Explanation

Stores Python objects directly in binary format.

### Importance

Fast persistence for Python-only apps.

### Code Samples (3)

```python
# Sample 1: dump/load dict
import pickle
data = {"a": 1}
pickle.dump(data, open("x.pkl", "wb"))
print(pickle.load(open("x.pkl", "rb")))
```

```python
# Sample 2: dump/load list
import pickle
nums = [1, 2, 3]
with open("nums.pkl", "wb") as f:
    pickle.dump(nums, f)
with open("nums.pkl", "rb") as f:
    print(pickle.load(f))
```

```python
# Sample 3: safe load with try
import pickle, os
if os.path.exists("x.pkl"):
    try:
        obj = pickle.load(open("x.pkl", "rb"))
        print(obj)
    except Exception:
        print("Corrupt file or wrong format")
```

---

# 18) FULL PROJECT — StudentDB (Dictionary + Pickle) ✅ WITH UNDO/REDO

**Undo/Redo rules**

- Any change (Add/Update/Delete) → pushes snapshot to Undo stack + clears Redo stack
- Undo restores previous snapshot
- Redo reapplies snapshot

```python
# studentdb_pickle_undo_redo.py
import pickle
import os
import copy

FILE_NAME = "studentdb.pkl"

def load_db():
    if os.path.exists(FILE_NAME):
        try:
            with open(FILE_NAME, "rb") as f:
                db = pickle.load(f)
            if isinstance(db, dict):
                # Ensure keys are ints where possible
                cleaned = {}
                for k, v in db.items():
                    try:
                        ik = int(k)
                    except Exception:
                        continue
                    cleaned[ik] = v
                return cleaned
        except Exception:
            pass
    return {}

def save_db(db):
    with open(FILE_NAME, "wb") as f:
        pickle.dump(db, f)

def input_int(prompt):
    while True:
        s = input(prompt).strip()
        if s.isdigit():
            return int(s)
        print("Please enter a valid number.")

def snapshot(db):
    return copy.deepcopy(db)

def push_undo(undo_stack, redo_stack, db):
    undo_stack.append(snapshot(db))
    redo_stack.clear()

def add_student(db, undo_stack, redo_stack):
    push_undo(undo_stack, redo_stack, db)

    roll = input_int("Enter roll: ")
    if roll in db:
        print("Roll already exists. Use update option.")
        return
    name = input("Enter name: ").strip()
    marks = input_int("Enter marks (0-100): ")
    db[roll] = {"roll": roll, "name": name, "marks": marks}
    print("Student added.")

def view_all(db):
    if not db:
        print("No records found.")
        return
    print("\n--- All Students ---")
    for roll in sorted(db.keys()):
        s = db[roll]
        print(f"Roll: {s['roll']} | Name: {s['name']} | Marks: {s['marks']}")

def search_student(db):
    roll = input_int("Enter roll to search: ")
    s = db.get(roll)
    if not s:
        print("Student not found.")
        return
    print(f"Found -> Roll: {s['roll']} | Name: {s['name']} | Marks: {s['marks']}")

def update_student(db, undo_stack, redo_stack):
    roll = input_int("Enter roll to update: ")
    if roll not in db:
        print("Student not found.")
        return

    push_undo(undo_stack, redo_stack, db)

    s = db[roll]
    print(f"Current -> Name: {s['name']} | Marks: {s['marks']}")
    new_name = input("Enter new name (blank = keep): ").strip()
    new_marks = input("Enter new marks (blank = keep): ").strip()

    if new_name:
        s["name"] = new_name
    if new_marks:
        if new_marks.isdigit():
            s["marks"] = int(new_marks)
        else:
            print("Invalid marks. Keeping old marks.")

    db[roll] = s
    print("Student updated.")

def delete_student(db, undo_stack, redo_stack):
    roll = input_int("Enter roll to delete: ")
    if roll not in db:
        print("Student not found.")
        return

    push_undo(undo_stack, redo_stack, db)

    del db[roll]
    print("Student deleted.")

def do_undo(db, undo_stack, redo_stack):
    if not undo_stack:
        print("Nothing to undo.")
        return db
    redo_stack.append(snapshot(db))
    prev = undo_stack.pop()
    print("Undo done.")
    return prev

def do_redo(db, undo_stack, redo_stack):
    if not redo_stack:
        print("Nothing to redo.")
        return db
    undo_stack.append(snapshot(db))
    nxt = redo_stack.pop()
    print("Redo done.")
    return nxt

def main():
    db = load_db()
    undo_stack = []
    redo_stack = []

    print("StudentDB (Pickle) loaded. Records:", len(db))

    while True:
        print("""
=========================
 StudentDB (Pickle)
=========================
1. Add Student
2. View All Students
3. Search Student
4. Update Student
5. Delete Student
6. Undo
7. Redo
8. Save
9. Save & Exit
10. Exit (No Save)
""")
        choice = input("Choose option: ").strip()

        if choice == "1":
            add_student(db, undo_stack, redo_stack)
        elif choice == "2":
            view_all(db)
        elif choice == "3":
            search_student(db)
        elif choice == "4":
            update_student(db, undo_stack, redo_stack)
        elif choice == "5":
            delete_student(db, undo_stack, redo_stack)
        elif choice == "6":
            db = do_undo(db, undo_stack, redo_stack)
        elif choice == "7":
            db = do_redo(db, undo_stack, redo_stack)
        elif choice == "8":
            save_db(db)
            print("Saved.")
        elif choice == "9":
            save_db(db)
            print("Saved. Bye!")
            break
        elif choice == "10":
            print("Bye! (Not saved)")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
```

---

# 19) FULL PROJECT — StudentDB (Dictionary + JSON) ✅ WITH UNDO/REDO

Notes:

- JSON keys become **strings**, so we store rolls as string keys: `"101"`, `"102"`.

```python
# studentdb_json_undo_redo.py
import json
import os
import copy

FILE_NAME = "studentdb.json"

def load_db():
    if os.path.exists(FILE_NAME):
        try:
            with open(FILE_NAME, "r", encoding="utf-8") as f:
                db = json.load(f)
            if isinstance(db, dict):
                # Ensure every value is a dict with roll/name/marks when possible
                cleaned = {}
                for k, v in db.items():
                    if isinstance(k, str) and isinstance(v, dict):
                        cleaned[k] = v
                return cleaned
        except Exception:
            pass
    return {}

def save_db(db):
    with open(FILE_NAME, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)

def input_int(prompt):
    while True:
        s = input(prompt).strip()
        if s.isdigit():
            return int(s)
        print("Please enter a valid number.")

def snapshot(db):
    return copy.deepcopy(db)

def push_undo(undo_stack, redo_stack, db):
    undo_stack.append(snapshot(db))
    redo_stack.clear()

def add_student(db, undo_stack, redo_stack):
    push_undo(undo_stack, redo_stack, db)

    roll = input_int("Enter roll: ")
    key = str(roll)
    if key in db:
        print("Roll already exists. Use update option.")
        return
    name = input("Enter name: ").strip()
    marks = input_int("Enter marks (0-100): ")
    db[key] = {"roll": roll, "name": name, "marks": marks}
    print("Student added.")

def view_all(db):
    if not db:
        print("No records found.")
        return
    print("\n--- All Students ---")
    for key in sorted(db.keys(), key=lambda x: int(x)):
        s = db[key]
        print(f"Roll: {s['roll']} | Name: {s['name']} | Marks: {s['marks']}")

def search_student(db):
    roll = input_int("Enter roll to search: ")
    s = db.get(str(roll))
    if not s:
        print("Student not found.")
        return
    print(f"Found -> Roll: {s['roll']} | Name: {s['name']} | Marks: {s['marks']}")

def update_student(db, undo_stack, redo_stack):
    roll = input_int("Enter roll to update: ")
    key = str(roll)
    if key not in db:
        print("Student not found.")
        return

    push_undo(undo_stack, redo_stack, db)

    s = db[key]
    print(f"Current -> Name: {s['name']} | Marks: {s['marks']}")
    new_name = input("Enter new name (blank = keep): ").strip()
    new_marks = input("Enter new marks (blank = keep): ").strip()

    if new_name:
        s["name"] = new_name
    if new_marks:
        if new_marks.isdigit():
            s["marks"] = int(new_marks)
        else:
            print("Invalid marks. Keeping old marks.")

    db[key] = s
    print("Student updated.")

def delete_student(db, undo_stack, redo_stack):
    roll = input_int("Enter roll to delete: ")
    key = str(roll)
    if key not in db:
        print("Student not found.")
        return

    push_undo(undo_stack, redo_stack, db)

    del db[key]
    print("Student deleted.")

def do_undo(db, undo_stack, redo_stack):
    if not undo_stack:
        print("Nothing to undo.")
        return db
    redo_stack.append(snapshot(db))
    prev = undo_stack.pop()
    print("Undo done.")
    return prev

def do_redo(db, undo_stack, redo_stack):
    if not redo_stack:
        print("Nothing to redo.")
        return db
    undo_stack.append(snapshot(db))
    nxt = redo_stack.pop()
    print("Redo done.")
    return nxt

def main():
    db = load_db()
    undo_stack = []
    redo_stack = []

    print("StudentDB (JSON) loaded. Records:", len(db))

    while True:
        print("""
=========================
 StudentDB (JSON)
=========================
1. Add Student
2. View All Students
3. Search Student
4. Update Student
5. Delete Student
6. Undo
7. Redo
8. Save
9. Save & Exit
10. Exit (No Save)
""")
        choice = input("Choose option: ").strip()

        if choice == "1":
            add_student(db, undo_stack, redo_stack)
        elif choice == "2":
            view_all(db)
        elif choice == "3":
            search_student(db)
        elif choice == "4":
            update_student(db, undo_stack, redo_stack)
        elif choice == "5":
            delete_student(db, undo_stack, redo_stack)
        elif choice == "6":
            db = do_undo(db, undo_stack, redo_stack)
        elif choice == "7":
            db = do_redo(db, undo_stack, redo_stack)
        elif choice == "8":
            save_db(db)
            print("Saved.")
        elif choice == "9":
            save_db(db)
            print("Saved. Bye!")
            break
        elif choice == "10":
            print("Bye! (Not saved)")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
```

---
