from scanner import scan_folder


folder = "TestFiles"

files = scan_folder(folder)

print("Files found:", len(files))
print()

for file in files:
    print("Name:", file["name"])
    print("Path:", file["path"])
    print("Size:", file["size"], "bytes")
    print("Extension:", file["extension"])
    print("SHA-256:", file["hash"])
    print("-" * 60)