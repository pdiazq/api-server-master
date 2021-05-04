const express = require('express');
const passport = require('passport');
const MoviesService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');

// JWT strategy
require('../utils/auth/strategies/jwt');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  router.get(
    '/',
    //passport.authenticate('jwt', { session: false }),
    //scopesValidationHandler(['read:movies']),
    async function(req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { body } = req;
      //const { tags } = req.query;
      console.log(`MOVIES ROUTE GET ${JSON.stringify(body.title)}`)
      //console.log(`MOVIES ROUTE GET ${JSON.stringify(tags)}`)

      try {
        const movies = await moviesService.getMovies({ body });

        res.status(200).json({
          data: movies,
          message: 'movies listed'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/filter',
    //passport.authenticate('jwt', { session: false }),
    //scopesValidationHandler(['read:movies']),
    async function(req, res, next) {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { body } = req;
      //const { tags } = req.query;
      console.log(`MOVIES ROUTE GET ${JSON.stringify(body.title)}`)
      //console.log(`MOVIES ROUTE GET ${JSON.stringify(tags)}`)

      try {
        const movies = await moviesService.getMoviesFilter({ body });

        res.status(200).json({
          data: movies,
          message: 'movies listed'
        });
      } catch (err) {
        next(err);
      }
    }
  );
// agregar comentarios a la pelí

router.put(
  '/:movieId',
  passport.authenticate('jwt', { session: false }),

  async function(req, res, next) {
    const { movieId } = req.params;
    const { body: comment } = req;

    try {
      console.log ( `COMENTARIO A  ${movieId} es ${JSON.stringify(comment)}` )
      const updateComment = await moviesService.insertComment({
        movieId,
        comment
      });

      res.status(200).json({
        data: updateComment,
        message: 'user updated'
      });
    } catch (err) {
      next(err);
    }
  }
);




  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function(req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { movieId } = req.params;

      try {
        const movies = await moviesService.getMovie({ movieId });

        res.status(200).json({
          data: movies,
          message: 'movie retrieved'
        });
      } catch (err) {
        next(err);
      }
    }
  );



  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async function(req, res, next) {
      const { body: movie } = req;
      try {
        const createdMovieId = await moviesService.createMovie({ movie });

        res.status(201).json({
          data: createdMovieId,
          message: 'movie created'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function(req, res, next) {
      const { movieId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMovieId = await moviesService.updateMovie({
          movieId,
          movie
        });

        res.status(200).json({
          data: updatedMovieId,
          message: 'movie updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['deleted:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function(req, res, next) {
      const { movieId } = req.params;

      try {
        const deletedMovieId = await moviesService.deleteMovie({ movieId });

        res.status(200).json({
          data: deletedMovieId,
          message: 'movie deleted'
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = moviesApi;
