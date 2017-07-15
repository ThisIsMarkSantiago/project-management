/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stories                ->  index
 * POST    /api/stories                ->  create
 * GET     /api/stories/:id            ->  show
 * GET     /api/stories/:id/assertions ->  assertions
 * GET     /api/stories/:id/mockups    ->  mockups
 * PUT     /api/stories/:id            ->  upsert
 * PATCH   /api/stories/:id            ->  patch
 * DELETE  /api/stories/:id            ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Story, Assertion, Mockup, Interaction } from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

// function removeEntity(res) {
//   return function(entity) {
//     if(entity) {
//       return entity.destroy()
//         .then(() => {
//           res.status(204).end();
//         });
//     }
//   };
// }

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Storys
export function index(req, res) {
  return Story
    .findAll({
      where: {
        active: true
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Story from the DB
export function show(req, res) {
  return Story
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Story in the DB
export function create(req, res) {
  if(!req.body.EpicId) {
    return handleError(res)(new Error('EpicId is required'), 404);
  }
  return Story
    .count({
      where: {
        EpicId: req.body.EpicId
      }
    })
    .then(count => {
      req.body.code = `S${count + 1}`;
      return Story.create(req.body);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Story in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Story
    .upsert(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Story in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Story
    .find({
      where: {
        _id: req.params.id
      },
      include: [{
        model: Mockup,
        as: 'mockups',
        where: { active: true },
        required: false,
        include: [{
          model: Interaction,
          as: 'interactions',
          where: { active: true },
          required: false
        }]
      }]
    })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Story from the DB
export function destroy(req, res) {
  return Story
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(patchUpdates([
      { op: 'replace', path: '/active', value: false }
    ]))
    // .then(removeEntity(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets all Assertions of a Story from the DB
export function assertions(req, res) {
  return Assertion
    .findAll({
      where: {
        StoryId: req.params.id,
        active: true
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets all Mockups of a Story from the DB
export function mockups(req, res) {
  return Mockup
    .findAll({
      where: {
        StoryId: req.params.id,
        active: true
      },
      include: [{
        model: Interaction,
        as: 'interactions',
        where: { active: true },
        required: false
      }]
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
