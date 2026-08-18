from hasher import calculate_hash


file_path = "TestFiles/Subfolder/another.pdf"

file_hash = calculate_hash(file_path)

print("File:", file_path)
print("SHA-256:", file_hash)