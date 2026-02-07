from flask_socketio import emit
from realtime.sockets import socketio

room_container_counts = {}

#client to server communication
#server receives command and emits back to client

@socketio.on('container_add')
def on_container_add(data):
    room_id = data.get('roomId')
    content = data.get('content')

    if not room_id or content is None:
        return
    
    #assign next index
    index = room_container_counts.get(room_id,0)
    room_container_counts[room_id] = index + 1

    emit(
        "container_added", 
        {'index': index,
         'content': content
         },
         room=room_id
    )


@socketio.on('container_update')
def on_container_update(data):
    room_id = data.get('roomId')
    index = data.get('index')
    content = data.get('content')

    if not room_id or content is None or index is None:
        return
    

    emit(
        "container_updated", 
        {'index': index,
         'content': content
         },
         room=room_id
    )

@socketio.on('container_delete')
def on_container_add(data):
    room_id = data.get('roomId')
    index = data.get('index')

    if not room_id or index is None:
        return
    emit(
        "container_deleted", 
        {'index': index,
         },
         room=room_id
    )