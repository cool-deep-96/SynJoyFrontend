export const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL;


export const roomEndPoints = {
    CREATE_REQUEST: SERVER_URL+"api/roomRoutes/createroom",
    JOIN_REQUEST: SERVER_URL+"api/roomRoutes/joinroom",
    CHAT_REQUEST: SERVER_URL+'api/roomRoutes/getChat',
    USER_REQUEST: SERVER_URL+'api/roomRoutes/getUSer',
}