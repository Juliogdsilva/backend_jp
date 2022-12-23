module.exports = () => {
  const modelKits = (item) => {
    const kits = {
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      description: item.description,
    };
    return kits;
  };

  return {
    modelKits,
  };
};
