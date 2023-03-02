const Excel = require('exceljs');

module.exports = (app) => {
  const reports = async (req, res) => {
    const date = new Date();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.columns = [
      { header: 'Cod.', key: 'id', width: 10 },
      { header: 'Nome', key: 'first_name', width: 32 },
      { header: 'Sobrenome', key: 'last_name', width: 32 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Telefone', key: 'phone', width: 15 },
      { header: 'Nascimento', key: 'birthdate', width: 15 },
      { header: 'Empresa', key: 'company', width: 15 },
      { header: 'Acompanhante?', key: 'companion', width: 10 },
      { header: 'T. Doc', key: 'document_type', width: 15 },
      { header: 'N. Doc', key: 'document_number', width: 15 },
      { header: 'N. Esp?', key: 'special_needs', width: 10 },
      { header: 'N. Esp', key: 'special_needs_describe', width: 15 },
      { header: 'Data Voo ida', key: 'arrival_date', width: 10 },
      { header: 'Hora Voo ida', key: 'arrival_time', width: 10 },
      { header: 'N. Voo ida', key: 'flight_number', width: 10 },
      { header: 'Data Voo Volta', key: 'departure_date', width: 10 },
      { header: 'Hora Voo Volta', key: 'departure_time', width: 10 },
      { header: 'N. Voo Volta', key: 'flight_number_departure', width: 10 },
      { header: 'Alergia?', key: 'have_allergy', width: 10 },
      { header: 'Alergia', key: 'allergy', width: 15 },
      { header: 'Pacote', key: 'registration_fee', width: 10 },
      { header: 'Carta?', key: 'letter', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Criado ', key: 'created_at', width: 10 },
    ];

    const participants = await app.db('participants')
      .select('*')
      .whereNull('s.deleted_at')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    participants.forEach((seller) => {
      worksheet.addRow({
        id: seller.id,
        first_name: seller.first_name,
        last_name: seller.last_name,
        email: seller.email,
        phone: seller.phone,
        birthdate: seller.birthdate,
        company: seller.company,
        companion: seller.companion,
        document_type: seller.document_type,
        document_number: seller.document_number,
        special_needs: seller.special_needs,
        special_needs_describe: seller.special_needs_describe,
        arrival_date: seller.arrival_date,
        arrival_time: seller.arrival_time,
        flight_number: seller.flight_number,
        departure_date: seller.departure_date,
        departure_time: seller.departure_time,
        flight_number_departure: seller.flight_number_departure,
        have_allergy: seller.have_allergy,
        allergy: seller.allergy,
        registration_fee: seller.registration_fee,
        letter: seller.letter,
        status: seller.status,
        created_at: seller.created_at,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // eslint-disable-next-line no-useless-concat
    res.setHeader('Content-Disposition', 'attachment; filename=' + `report_${date.getTime()}.xlsx`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  };

  return {
    reports,
  };
};
