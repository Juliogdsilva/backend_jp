module.exports = () => {
  const modelCodes = (item) => {
    const code = {
      code: item.code,
      batch_id: item.batch_id,
      batch_number: item.batch_number,
      name: item.name,
      phone: item.phone,
      email: item.email,
      note: item.note,
      status: item.status,
    };
    return code;
  };

  return {
    modelCodes,
  };
};
