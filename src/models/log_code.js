module.exports = () => {
  const modelLogCode = (item) => {
    const log = {
      code_id: item.code_id,
      action: item.action,
      created_by: item.created_by,
      description: item.description,
    };
    return log;
  };

  return {
    modelLogCode,
  };
};
