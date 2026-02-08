from flask_socketio import emit
from realtime.sockets import socketio
from save import save_room, load_data

#client to server communication
#server receives command and emits back to client

@socketio.on('container_add')
def on_container_add(data):
    room_id = data.get('roomId')
    content = data.get('content')
    container_id = data.get('container_id')

    if not room_id or content is None:
        return

    emit(
        "container_added", 
        {'container_id': container_id,
         'content': content
         },
         room=room_id
    )


@socketio.on('container_update')
def on_container_update(data):
    room_id = data.get('roomId')
    container_id = data.get('container_id')
    content = data.get('content')

    if not room_id or content is None or container_id is None:
        return
    

    emit(
        "container_updated", 
        {'container_id': container_id,
         'content': content
         },
         room=room_id
    )

@socketio.on('container_delete')
def on_container_delete(data):
    room_id = data.get('roomId')
    container_id = data.get('container_id')

    if not room_id or container_id is None:
        return
    emit(
        "container_deleted", 
        {'container_id': container_id,
         },
         room=room_id
    )

@socketio.on('save_state')
def save_state(data):
    room_id = data.get('room_id') or data.get('roomId')
    state = data.get('state')

    if room_id is None or state is None:
        return
    try:
        save_room(room_id, state)
    except Exception as e:
        print('Error while saving...')