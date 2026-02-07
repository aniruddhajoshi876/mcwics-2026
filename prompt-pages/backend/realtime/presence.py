from flask_socketio import emit, request
from realtime.sockets import socketio

room_users = {}

@socketio.on('join')
def register_presence(data):
    room_id  = data.get('roomId')
    sid = request.sid

    if not room_id:
        return
    
    #room_users tell u which ppl are in the room
    #use roomid to access array of users
    #if it is the first user and roomid key dne
    #then set defualt value to empty set and add
    #the users set id
    room_users.setdefault(room_id, set()).add(sid)

    emit('user_joined',
         {'count': len(room_users[room_id])},
         room=room_id
         )
    

@socketio.on('disconnect')
#no payload is sent
#only know who left
def unregister_presence():
    sid = request.sid

    for room_id, users in room_users.items():
        if sid in users:
            users.remove(sid)
            emit('users_left',
                 {'count': len(users)},
                 room=room_id)
            break