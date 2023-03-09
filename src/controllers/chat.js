module.exports = (app) => {
  const getParticipants = async (req, res) => {
    const participants = await app.db('participants')
      .select('id', 'first_name', 'last_name', 'company')
      .where({ status: 'active' })
      .whereNull('deleted_at')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send(participants);
  };

  return {
    getParticipants,
  };
};
