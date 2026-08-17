from scanner import scan_folder


folder = "TestFiles"

files = scan_folder(folder)

print("Files found:", len(files))

for file in files:
    print("Name:", file["name"])
    print("Path:", file["path"])
    print("Size:", file["size"], "bytes")
    print("Extension:", file["extension"])
    print("-" * 40)