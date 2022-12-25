module.exports = () => {
  const modelProducts = (item) => {
    const products = {
      name: item.name,
      quantity: item.quantity,
      kit_id: item.kit_id,
      kit_quantity: item.kit_quantity,
      description: item.description,
    };
    return products;
  };

  return {
    modelProducts,
  };
};
