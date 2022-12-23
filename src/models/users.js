module.exports = () => {
  const modelUser = (item) => {
    const user = {
      name: item.name,
      cpf: item.cpf,
      email: item.email,
      password: item.password,
      gender: item.gender,
      phone: item.phone,
      status: item.status,
    };
    return user;
  };

  return {
    modelUser,
  };
};
