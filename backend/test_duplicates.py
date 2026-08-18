from scanner import scan_folder
from duplicate_finder import find_duplicates, calculate_wasted_storage


folder = "TestFiles"

files = scan_folder(folder)

duplicates = find_duplicates(files)

wasted_storage = calculate_wasted_storage(duplicates)

print("Duplicate groups found:", len(duplicates))
print()

for group in duplicates:
    print("Hash:", group["hash"])
    print("Duplicate files:")

    for file in group["files"]:
        print("-", file["name"])
        print("  Path:", file["path"])
        print("  Size:", file["size"], "bytes")

    print("-" * 60)

print("Wasted storage:", wasted_storage, "bytes")