/* eslint-disable no-unused-vars */
module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
    equalsOrError,
    notEqualsOrError,
    isEmailValid,
    isCPFValid,
    justNumbers,
  } = app.src.tools.validation;
  const { modelProducts } = app.src.models.products;

  const save = async (req, res) => {
    const products = await modelProducts(req.body);
    const date = new Date();

    if (req.params.id) products.id = req.params.id;

    try {
      if (!products.id) {
        existsOrError(products.name, 'Nome não informado');
        existsOrError(products.quantity, 'Quantidade não informado');
        existsOrError(products.kit_id, 'Kit não informado');
      }
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    if (products.id) {
      products.updated_at = date;
      delete products.created_at;

      app.db('products')
        .update(products)
        .where({ id: products.id })
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    } else {
      products.created_at = date;

      await app.db('products')
        .insert(products)
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    }
    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/products')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;

    const products = await app.db('products as p')
      .select('p.*', 'k.name as kit_name')
      .modify((query) => {
        // eslint-disable-next-line eqeqeq
        if (search && search != 'null') {
          query.andWhere(function () {
            this.where('p.name', 'like', `%${search}%`);
          });
        }
      })
      .leftJoin('kits as k', 'k.id', 'p.kit_id') // KIT
      .paginate({ perPage, currentPage, isLengthAware: true })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send(products);
  };

  const report = async (req, res) => {
    const products = await app.db('products as p')
      .select('p.*', 'k.name as kit_name')
      .leftJoin('kits as k', 'k.id', 'p.kit_id') // KIT
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      // eslint-disable-next-line no-await-in-loop
      const count = await app.db('sellers_products')
        .count('id as count')
        .where({ product_id: product.id })
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });

      product.count = count[0].count;
      product.result = product.quantity - product.count;
    }

    return res.status(200).send({ products });
  };

  return {
    save,
    get,
    report,
  };
};
