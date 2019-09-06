import io from "socket.io-client";

export default function socket() {
  return store => {
    console.log("Connection to server socket");
    const socket = io("http://localhost:3030");
    socket.on("userconnected", function(data) {
      console.log("Connected to the server" + data);
    });
  };
}
