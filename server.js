const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

let players = {};

function randomId(){
  return Math.random().toString(36).substr(2,9);
}

wss.on("connection",(ws)=>{

  const id = randomId();

  players[id] = {
    x:100,
    y:100,
    hp:5
  };

  ws.on("message",(msg)=>{
    const data = JSON.parse(msg);

    if(data.type === "move"){
      players[id].x = data.x;
      players[id].y = data.y;
    }
  });

  ws.on("close",()=>{
    delete players[id];
  });

});

setInterval(()=>{

  const data = JSON.stringify({ players });

  wss.clients.forEach(client=>{
    if(client.readyState === WebSocket.OPEN){
      client.send(data);
    }
  });

}, 50);

console.log("Servidor online");
