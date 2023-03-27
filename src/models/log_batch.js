module.exports = () => {
  const modelLogBatch = (item) => {
    const batch = {
      batch_id: item.batch_id,
      quantity: item.quantity,
      start_number: item.start_number,
      last_number: item.last_number,
      status: item.status,
      description: item.description,
    };
    return batch;
  };

  return {
    modelLogBatch,
  };
};
