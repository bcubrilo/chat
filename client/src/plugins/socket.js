import io from "socket.io-client";

export default function socket() {
  return store => {
    const socket = io("http://localhost:3031");

    socket.on("userconnected", function(data) {
      console.log("Connected socket " + socket.id);
    });

    socket.on("new_message", data => {
      console.log("received message");
      store.commit("chat/receiveMessage", data);
    });
    socket.on("update_message_id", data => {
      store.commit("chat/updatMessageId", data);
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
