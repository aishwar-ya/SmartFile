from scanner import scan_folder


folder = "TestFiles"

files = scan_folder(folder)

print("Files found:", len(files))

for file in files:
    print(file)