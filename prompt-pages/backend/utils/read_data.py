from pathlib import Path

BASE = Path(__file__).resolve().parent

filepath = BASE.parent / "room_data.json"


def find_room():
    with open(filepath, "r") as file:
        data = file.read()
    return data

if __name__ == "__main__":
    print(find_room())

        

