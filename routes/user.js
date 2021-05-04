const express = require('express');
const passport = require('passport');
const UsersService = require('../services/users');
const { userIdSchema } = require('../utils/schemas/users')
const { updateUserSchema } = require('../utils/schemas/users')

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require('../utils/schemas/users');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');

// JWT strategy
require('../utils/auth/strategies/jwt');

function userApi(app) {
  const router = express.Router();
  app.use('/api/user', router);

  const usersService = new UsersService();

// scopesValidationHandler(['read:user']),
//validationHandler({ _id: userIdSchema }, 'params'),

  router.get(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    validationHandler({ userId: userIdSchema }, 'params'),
    async function(req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { userId } = req.params;

      try {
        console.log ( `tratando de traer usuario ${userId} params= ${JSON.stringify(req.params)}`)
        const user = await usersService.getUserInfo({userId});

        res.status(200).json({
          data: user,
          message: 'user retrieved'
        });
      } catch (err) {
        next(err);
      }
    }
  );


//scopesValidationHandler(['update:user']),
//validationHandler({ userId: userIdSchema }, 'params'),
//validationHandler(updateUserSchema), 
  router.put(
    '/:userId',
    passport.authenticate('jwt', { session: false }),

    async function(req, res, next) {
      const { userId } = req.params;
      const { body: movies } = req;

      try {
        console.log ( `ROUTAS USUARIO ${userId} PELIS ${JSON.stringify(movies)}` )
        const updatedUserId = await usersService.insertUserMovies({
          userId,
          movies
        });

        res.status(200).json({
          data: updatedUserId,
          message: 'user updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );



  router.delete(
    '/:userId',
    passport.authenticate('jwt', { session: false }),

    async function(req, res, next) {
      const { userId } = req.params;
      const { body: movies } = req;

      try {
        console.log ( `ROUTAS USUARIO ${userId} PELIS ${JSON.stringify(movies)}` )
        const deletedUserId = await usersService.deleteUserMovies({
          userId,
          movies
        });

        res.status(200).json({
          data: deletedUserId,
          message: 'movie user deleted'
        });
      } catch (err) {
        next(err);
      }
    }
  );

}

module.exports = userApi;
