module.exports = () => {
  const modelSellers = (item) => {
    const sellers = {
      name: item.name,
      cpf: item.cpf,
      phone: item.phone,
      dam_number: item.dam_number,
      dam_type: item.dam_type,
      association_member: item.association_member,
      association: item.association,
      neighborhood: item.neighborhood,
    };
    return sellers;
  };

  return {
    modelSellers
    ,
  };
};
