const {Sync} = require("./modals.cjs");

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
const {connectToDatabase} = require('./server.cjs');


app.get('/get-sync', (req, res) => {
  const SYNC_ID = req.query.sync_id;
  Sync.findOne({sync_id:SYNC_ID}).then(e => {
    console.log({e})
    res.json(e ?? "");
  }).catch(e => {
    res.status(400).json(e);
    console.log({error:e})
  })
})

app.post('/set-sync', async (req, res) => {
  const {syncId, data, socketID} = req.body;
  const sync = await Sync.findOne({sync_id:syncId})
  console.log("IIK", sync);
  
  if(sync){
    sync.set({
      data
    })
    sync.save().then(e => {
      io.to(syncId).except(socketID).emit('data_update', e.data)
      res.json(e);
    }).catch(e => {
      res.status(400).json(e);
      console.log({error:e})
    })
  }else{
    Sync.create({sync_id:syncId,data}).then(e => {
      io.to(syncId).except(socketID).emit('data_update', e.data)
      res.json(e);
    }).catch(e => {
      res.status(400).json(e);
      console.log({error:e})
    })
  }

  
})

io.on("connection", (socket) => {
  // ...
  const SYNC_ID = socket.handshake.query.sync_id;
  if(SYNC_ID){
    socket.join(SYNC_ID);
    console.log("CONNECTED :: ", SYNC_ID , '->', socket.id)
  }

  socket.on('data_update', (data) => {
    io.to(SYNC_ID).except(socket).emit("data_update", data);
  })

  socket.on('disconnect', () => {
    socket.leave(SYNC_ID);
    console.log("DISCONNECTED :: ", SYNC_ID , '->', socket.id)
  })
});
connectToDatabase()
httpServer.listen(7000);