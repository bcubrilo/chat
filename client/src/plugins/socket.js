import io from "socket.io-client";

export default function socket() {
  return store => {
    const socket = io("http://localhost:3031");

    socket.on("userconnected", function(data) {
      console.log("Connected socket " + socket.id);
      if (store.getters["auth/isAuth"]) {
        console.log("Must map sockets");
        socket.emit("map_sockets", store.getters["auth/token"]);
      }
    });

    socket.on("new_message", data => {
      console.log("Received message", data);
      store.commit("chat/receiveMessage", data);
    });
    socket.on("update_message_data", data => {
      store.commit("chat/updateMessageData", data);
    });

    store.subscribe(mutation => {
      if (mutation.type === "auth/setUser") {
        socket.emit("authenticate", mutation.payload.token);
      }
      if (mutation.type === "chat/addMessage") {
        socket.emit("save_message", mutation.payload);
      }
    });
  };
}
