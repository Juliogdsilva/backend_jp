module.exports = () => {
  const modelPermissions = (item) => {
    const permission = {
      name: item.name,
      alias: item.alias,
      description: item.description,
    };
    return permission;
  };

  return {
    modelPermissions,
  };
};
