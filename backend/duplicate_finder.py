from collections import defaultdict


def find_duplicates(files):
    hash_groups = defaultdict(list)

    for file in files:
        hash_groups[file["hash"]].append(file)

    duplicates = []

    for file_hash, group in hash_groups.items():
        if len(group) > 1:
            duplicates.append({
                "hash": file_hash,
                "files": group
            })

    return duplicates


def calculate_wasted_storage(duplicates):
    wasted_storage = 0

    for group in duplicates:
        files = group["files"]

        # Keep the first file and count the remaining copies
        for file in files[1:]:
            wasted_storage += file["size"]

    return wasted_storage