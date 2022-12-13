const { v1: uuidv1 } = require('uuid');
const { createHmac } = require('crypto');
const keygen = require('keygenerator');
const slugify = require('slugify');

module.exports = () => {
  function getUUID() {
    const uuid = uuidv1();
    return uuid;
  }

  function getKeyNumber() {
    const code = keygen.number();
    return code;
  }

  function getCode() {
    const code = keygen._({
      chars: true,
      sticks: false,
      numbers: true,
      specials: true,
      length: 6,
      forceUppercase: false,
      forceLowercase: false,
      exclude: [',', '.', ';', ':', ')', '(', '/', '§', '"', '¡', '“', '¢', '[', ']', '{', '}', '≠'],
    });
    return code;
  }

  function generatorHashCode(value) {
    const hash = createHmac('sha1', process.env.AUTH_SECRET)
      .update(value)
      .digest('hex');

    const hashCode = hash.match(/^\w{5}/mg);
    return hashCode[0];
  }

  function getSlug(value) {
    const slug = slugify(value, {
      replacement: '-',
      remove: /[*+~.()'"!:@#$%¨&_=§´`^[\]|]/g,
      lower: true,
      strict: false,
      locale: 'pt',
      trim: true,
    });
    return slug;
  }

  return {
    getUUID,
    getKeyNumber,
    getCode,
    generatorHashCode,
    getSlug,
  };
};
