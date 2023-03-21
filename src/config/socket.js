module.exports = async (app, io) => {
  console.log('Init socket.io');
  io.on('connection', (socket) => {
    // Get last message
    app.db('chat')
      .select()
      .orderBy('id', 'desc')
      .limit(2)
      .then((data) => io.to(socket.id).emit('latestMensages', data));

    socket.on('sendMessage', (data) => {
      // save New Msg
      const message = JSON.parse(data);
      app.db('chat')
        .insert({ first_name: message.first_name, text: message.text })
        .then()
        .catch((err) => {
          throw err;
        });

      // Send message for all users
      io.emit('newMessage', data);
    });

    socket.on('getLatestMensages', (data) => {
      app.db('chat')
        .select()
        .where('id', '<', data)
        .orderBy('id', 'desc')
        .limit(10)
        .then((resp) => io.to(socket.id).emit('moreLatestMensages', resp));
    });

    socket.on('disconnect', () => {
      // console.log('A user disconnected'); Usuario desconectou
    });
  });
};
