# bad2.py
# This file contains bad practices: no comments, huge nesting, no error handling, and strange naming

def a(x):
    if x > 0:
        if x < 100:
            if x % 2 == 0:
                y = x * 2
                if y > 100:
                    print("Big")
                else:
                    for i in range(10):
                        print(i + y)
                return y
            else:
                return "Not even"
        else:
            return "Too big"
    else:
        return "negative?"

import os
# Poor practice: direct os.system with user input
def run(cmd):
    os.system("echo " + cmd)

s = input("What to echo? ")
run(s) # Potential Command Injection
print(a(int(s)))
