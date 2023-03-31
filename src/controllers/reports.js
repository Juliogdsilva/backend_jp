const Excel = require('exceljs');

module.exports = (app) => {
  const reportCodes = async (req, res) => {
    if (!req.params.id) {
      return res
        .status(400)
        .send({ msg: 'Verifique os parâmetro da requisição' });
    }
    const date = new Date();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.columns = [
      { header: 'Cod.', key: 'code', width: 10 },
      { header: 'Lote', key: 'batch_name', width: 32 },
      { header: 'Criado ', key: 'created_at', width: 10 },
    ];

    const log = await app.db('log_batch as lb')
      .select('lb.*', 'bt.name as batch_name')
      .leftJoin('batch as bt', 'bt.id', 'lb.batch_id')
      .where('lb.id', req.params.id)
      .first()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const codes = await app.db('codes')
      .select('code', 'created_at')
      .where({ batch_id: log.batch_id })
      .andWhere('batch_number', '>=', log.start_number)
      .andWhere('batch_number', '<=', log.last_number);

    codes.forEach((item) => {
      worksheet.addRow({
        code: item.code,
        batch_name: log.batch_name,
        created_at: item.created_at,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // eslint-disable-next-line no-useless-concat
    res.setHeader('Content-Disposition', 'attachment; filename=' + `codes_${date.getTime()}.xlsx`);

    await workbook.xlsx.write(res);
    return res.status(200).end();
  };

  return {
    reportCodes,
  };
};
