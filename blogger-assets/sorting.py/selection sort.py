a = [4, 3, 2, 1, 0]
print(a)
n = len(a)
# print(n)
i = 0
min = a[i]
minpos = i
# print(min, minpos)
for j in range(i+1, n):
    if a[j] < min:
        min = a[j]
        minpos = j
        # print(min, minpos)
a[i], a[minpos] = a[minpos], a[i]
print(a)

i = 1
min = a[i]
minpos = i
# print(min, minpos)
for j in range(i+1, n):
    if a[j] < min:
        min = a[j]
        minpos = j
        # print(min, minpos)
a[i], a[minpos] = a[minpos], a[i]
print(a)

i = 2
min = a[i]
minpos = i
# print(min, minpos)
for j in range(i+1, n):
    if a[j] < min:
        min = a[j]
        minpos = j
        # print(min, minpos)
a[i], a[minpos] = a[minpos], a[i]
print(a)

a = [4, 3, 2, 1, 0]
for i in range(0,n-1):
    min = a[i]
    minpos = i
    for j in range(i+1, n):
        if a[j] < min:
            min = a[j]
            minpos = j
    a[i], a[minpos] = a[minpos], a[i]

    print(a)