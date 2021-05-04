const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userMovieSchema = joi.array().items(joi.string().max(50));

const createUserSchema = {
  name: joi
    .string()
    .max(100)
    .required(),
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required(),
  movies: userMovieSchema,
  isAdmin: joi.boolean()
};

const updateUserSchema = {
  name: joi
    .string()
    .max(100)
    .required(),
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required(),
  movies: userMovieSchema
};


module.exports = {
  userIdSchema,
  createUserSchema,
  updateUserSchema
};