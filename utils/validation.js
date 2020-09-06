const Joi = require("joi");

const registerValidation = data => {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };

  const inputValidation = Joi.validate(data, schema);
  return inputValidation;
};

const loginValidation = data => {
  const schema = {
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  };

  const inputValidation = Joi.validate(data, schema);
  return inputValidation;
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
