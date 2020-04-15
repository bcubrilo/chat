import io from "socket.io-client";

export default function socket() {
  return (store) => {
    console.log("Socket url => ", process.env);
    const socket = io(process.env.VUE_APP_SOCKET_URL);

    socket.on("userconnected", function(data) {
      if (store.getters["auth/isAuth"]) {
        socket.emit("map_sockets", store.getters["auth/token"]);
      }
    });

    socket.on("new_message", (data) => {
      console.log("Received message", data);
      store.commit("chat/receiveMessage", data);
    });
    socket.on("update_message_data", (data) => {
      store.commit("chat/updateMessageData", data);
    });

    store.subscribe((mutation) => {
      if (mutation.type === "auth/setUser") {
        socket.emit("authenticate", mutation.payload.token);
      }
      if (mutation.type === "chat/addMessage") {
        socket.emit("save_message", mutation.payload);
      }
    });
  };
}
