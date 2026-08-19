import hashlib                                    # Python has a built-in library for creating hashes.


def calculate_hash(file_path):
    sha256 = hashlib.sha256()                     # This creates our file fingerprint calculator.

    with open(file_path, "rb") as file:
        while chunk := file.read(8192):
            sha256.update(chunk)

    return sha256.hexdigest()