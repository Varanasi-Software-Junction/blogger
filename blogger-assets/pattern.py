n=5
for i in range(1,n+1):
    for j in range(1,n-i+1):
        print(" ",end="")
    for k in range(1,2*i):
        print(0,end="")
    print()

for i in reversed( range(1,n)):
    for j in range(1,n-i+1):
        print(" ",end="")
    for k in range(1,2*i):
        print(0,end="")
    print()