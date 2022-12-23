module.exports = () => {
  const modelTrainings = (item) => {
    const trainings = {
      name: item.name,
      description: item.description,
    };
    return trainings;
  };

  return {
    modelTrainings,
  };
};
