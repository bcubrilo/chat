import io from "socket.io-client";

export default function socket() {
  return store => {
    const socket = io("http://localhost:3031");
    socket.on("userconnected", function(data) {});
    socket.on("new_message", data => {
      console.log("have a new message");
      store.commit("chat/addMessage", data);
    });
    store.subscribe(mutation => {
      if (mutation.type === "auth/setUser") {
        socket.emit("authenticate", mutation.payload.token);
      }
    });
  };
}
