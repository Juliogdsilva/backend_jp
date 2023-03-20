module.exports = (app, io) => {
  console.log('Init socket.io');
  io.on('connection', (socket) => {
    // console.log('A user connected'); Usuario conectou

    socket.on('sendMessage', (data) => {
      io.emit('newMessage', data);
    });

    socket.on('disconnect', () => {
      // console.log('A user disconnected'); Usuario desconectou
    });
  });
};
