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

def create_new_room(room_id, room_name):
    with open(filepath, "r") as file:
        file_read = file.read()
        data_dictionary = json.loads(file_read)
        old_length = len(data_dictionary)
        data_dictionary[room_id] = {"name": room_name,"containers": []}
        new_length = len(data_dictionary)
        if new_length > old_length:
            with filepath.open("w", encoding="utf-8") as file:
                json.dump(data_dictionary, file, indent=4)

def save_room(room_id, new_data):
     with open(filepath, "r") as file:
        file_read = file.read()
        data_dictionary = json.loads(file_read)
        print(len(data_dictionary))
        room = data_dictionary[room_id]
        room["containers"] = new_data
        print(data_dictionary)
        #print(len(data_dictionary))
        old_length = len(data_dictionary)
        new_length = len(data_dictionary)
        if len(data_dictionary) > 0:
            with filepath.open("w", encoding="utf-8") as file:
                json.dump(data_dictionary, file, indent=4)

        return 




if __name__ == "__main__":
    #print(find_room("testid"))
    pass

        

