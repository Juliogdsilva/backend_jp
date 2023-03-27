module.exports = () => {
  const modelBatch = (item) => {
    const batch = {
      name: item.name,
      limit: item.limit,
      date_limit: item.date_limit,
      time_limit: item.time_limit,
      usage_limit: item.usage_limit,
      description: item.description,
      status: item.status,
    };
    return batch;
  };

  return {
    modelBatch,
  };
};
