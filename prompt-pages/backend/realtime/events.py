from flask_socketio import emit, join_room
from realtime.sockets import socketio
from save import save_room, load_data

#client to server communication
#server receives command and emits back to client

@socketio.on('container_add')
def on_container_add(data):
    room_id = data.get('roomId')
    content = data.get('content')
    container_id = data.get('containerId')

    if not room_id or content is None:
        return

    emit(
        "container_added", 
        {'containerId': container_id,
         'content': content
         },
         room=room_id,
         include_self=False
    )


@socketio.on('container_update')
def on_container_update(data):
    room_id = data.get('roomId')
    container_id = data.get('containerId')
    content = data.get('content')

    if not room_id or content is None or container_id is None:
        return
    

    emit(
        "container_updated", 
        {'containerId': container_id,
         'content': content
         },
         room=room_id,
         include_self=False
    )

@socketio.on('container_delete')
def on_container_delete(data):
    room_id = data.get('roomId')
    container_id = data.get('containerId')

    if not room_id or container_id is None:
        return
    emit(
        "container_deleted", 
        {'containerId': container_id,
         },
         room=room_id,
         include_self=False
    )

@socketio.on('save_state')
def on_save_state(data):
    print("SAVE_STATE RECEIVED:", data)

    room_id = data.get('room_id') or data.get('roomId')
    state = data.get('state')

    if room_id is None or state is None:
        print("SAVE_STATE: missing room_id or state")
        return

    save_room(room_id, state)
    print("SAVE_STATE: saved for room", room_id)



@socketio.on('move_container')
def on_move_container(data):
    room_id = data.get('roomId')
    container_id = data.get('containerId')
    x = data.get('x')
    y = data.get('y')

    if not room_id or not container_id:
        return

    if not isinstance(x, (int, float)) or not isinstance(y, (int, float)):
        return


    emit(
        'container_moved', {
            'containerId' : container_id,
            'x' :x,
            'y': y,
        },
        room=room_id,
        include_self=False
    )

@socketio.on('join_room')
def on_join_room(data):
    room_id = data.get('roomId')
    print("JOIN ROOM:", room_id)

    join_room(room_id)

    all_data = load_data()
    print("ALL DATA:", all_data)

    room_state = all_data.get(room_id)
    print("ROOM STATE LOADED:", room_state)

    if room_state:
        emit('load_state', room_state)

'''
@socketio.on('generate_prompt')
def on_generate_prompt(data):
    room_id = data.get('roomId')
    container_id = data.get('containerId')
    month = data.get('month')

    if not room_id or not container_id or not month:
        return
    text = generate_month(month)

    emit('prompted_added',
         {container_id: container_id,
          'content': {
              'image': '',
              'caption': text
          }},
          room = room_id,
          include_self=False

          })
          '''