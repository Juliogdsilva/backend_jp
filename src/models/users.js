module.exports = () => {
  const modelUsers = (item) => {
    const user = {
      name: item.name,
      cpf: item.cpf,
      email: item.email,
      phone: item.phone,
      status: item.status,
    };
    return user;
  };

  return {
    modelUsers,
  };
};
