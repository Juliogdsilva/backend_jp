/* eslint-disable no-use-before-define */
/* eslint-disable no-bitwise */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
const Excel = require('exceljs');

module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
    equalsOrError,
    notEqualsOrError,
    isEmailValid,
    isCPFValid,
    justNumbers,
  } = app.src.tools.validation;

  const reports = async (req, res) => {
    const date = new Date();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.columns = [
      { header: 'Cod.', key: 'id', width: 10 },
      { header: 'Nome', key: 'name', width: 32 },
      { header: 'CPF', key: 'cpf', width: 15 },
      { header: 'Telefone', key: 'phone', width: 15 },
      { header: 'Cartão', key: 'card', width: 15 },
      { header: 'Hora Assinatura', key: 'signature', width: 32 },
      { header: 'Hora Treinamento', key: 'training', width: 32 },
      { header: 'Hora Ret. Kit', key: 'kit', width: 32 },
      { header: 'Data e Hora', key: 'date', width: 10 },
      { header: 'Criado ', key: 'created_at', width: 10 },
    ];

    const sellers = await app.db('sellers as s')
      .select('s.id', 's.name', 's.cpf', 's.phone', 's.created_at', 'sc.code as card', 'ss.created_at as signature', 'st.created_at as training', 'sk.created_at as kit')
      .leftJoin('sellers_card as sc', 'sc.seller_id', 's.id') // CODE CARTÃO
      .leftJoin('sellers_signature as ss', 'ss.seller_id', 's.id') // FOTO ASSINATURA
      .leftJoin('sellers_training as st', 'st.seller_id', 's.id') // TREINAMENTO
      .leftJoin('seller_withdrawal as sk', 'sk.seller_id', 's.id') // TREINAMENTO
      .whereNull('s.deleted_at')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    sellers.forEach((seller) => {
      worksheet.addRow({
        id: seller.id,
        name: seller.name,
        cpf: formatCPF(seller.cpf),
        phone: seller.phone,
        card: seller.card,
        signature: seller.signature ? formatDate(seller.signature) : '',
        training: seller.training ? formatDate(seller.training) : '',
        kit: seller.kit ? formatDate(seller.kit) : '',
        date: formatDate(date),
        Criado: formatDate(seller.created_at),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `report_${date.getTime()}.xlsx`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  };

  function formatDate(date) {
    let hours = date.getHours() | "00";
    let minutes = date.getMinutes() | "00";
    let day = date.getDate();
    let month = date.getMonth() + 1;
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes;
    if (strTime === "00:00") return day + "/" + month + "/" + date.getFullYear();
    return day + "/" + month + "/" + date.getFullYear() + " " + strTime;
  }

  function formatCPF(cpf) {
    const regex = /(\d{3})?(\d{3})?(\d{3})?(\d{2})/;
    const format = "$1.$2.$3-$4";
    const newCPF = cpf.replace(/[.-]/g, "");
    return newCPF.replace(regex, format);
  }

  return {
    reports,
  };
};
