from pathlib import Path
import json

BASE = Path(__file__).resolve().parent

filepath = BASE.parent / "room_data.json"


def find_room(room_id):
    with open(filepath, "r") as file:
        file_read = file.read()
        data = json.loads(file_read)
        try:   
            room_data = data[room_id]
            return room_data
        except KeyError:
            return None
    
def manage_containers(containers: list):
    for container in containers:
        print(f"Caption: {container['caption']}")
    

if __name__ == "__main__":
    print(find_room("testid"))

        

