from flask_socketio import emit
from realtime.sockets import socketio

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