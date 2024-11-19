export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;


export const roomEndPoints = {
    CREATE_REQUEST: SERVER_URL+"/api/room/",
    JOIN_REQUEST: SERVER_URL+"/api/room/join",
    ATTEMPT_ROOM: SERVER_URL+"/api/room/attempt",
    CHAT_REQUEST: SERVER_URL+'/api/room/getChat',
    USER_REQUEST: SERVER_URL+'/api/room/getUSer',
}

export const tokenEndPoints = {
    REFRESH_TOKEN: SERVER_URL+"/api/token/refresh"
}

export const membersEndPoints={
    ADMIT_ROOM: SERVER_URL+'/api/room/accept',
    REMOVE_USER: SERVER_URL+'/api/room/reject',
    GET_USER: SERVER_URL+'/api/room',
}

export const chatEndPoints = {
    CREATE_CHAT : SERVER_URL+'/api/chat/',  // get Method to get all chat in a room
    GET_CHAT : SERVER_URL+'/api/chat/', // post method to create a chat
    DELETE_CHAT : SERVER_URL+'/api/chat/', // delete method to delete :messageId
    UPDATE_CHAT : SERVER_URL+'/api/chat/' // patch method to update :messageId
}

