/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/assertions              ->  index
 * POST    /api/assertions              ->  create
 * GET     /api/assertions/:id          ->  show
 * PUT     /api/assertions/:id          ->  upsert
 * PATCH   /api/assertions/:id          ->  patch
 * DELETE  /api/assertions/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Assertion } from '../../sqldb';

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

// Gets a list of Assertions
export function index(req, res) {
  return Assertion
    .findAll({
      where: {
        active: true
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Assertion from the DB
export function show(req, res) {
  return Assertion
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Assertion in the DB
export function create(req, res) {
  if(!req.body.StoryId) {
    return handleError(res)(new Error('StoryId is required'), 404);
  }
  return Assertion
    .count({
      where: {
        StoryId: req.body.StoryId
      }
    })
    .then(count => {
      req.body.code = `A${count + 1}`;
      return Assertion.create(req.body);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Assertion in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Assertion
    .upsert(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Assertion in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Assertion
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Assertion from the DB
export function destroy(req, res) {
  return Assertion
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
