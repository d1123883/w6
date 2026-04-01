# bad1.py
# This file contains bad practices: global variables, poor naming, and a simple SQL injection vuln

import sqlite3

u = "root"
p = "123456" # Hardcoded credentials (Weak)

def login(userInput):
    global u
    global p
    db = sqlite3.connect('local.db')
    c = db.cursor()
    # SQL INJECTION VULNERABILITY
    q = "SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + p + "'"
    print("Running query: " + q)
    c.execute(q)
    r = c.fetchone()
    if r:
        return "Success"
    else:
        return "Fail"

# No error handling, and using input() directly
val = input("Enter username: ")
print(login(val))
