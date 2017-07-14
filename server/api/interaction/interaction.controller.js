/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/interactions              ->  index
 * POST    /api/interactions              ->  create
 * GET     /api/interactions/:id          ->  show
 * PUT     /api/interactions/:id          ->  upsert
 * PATCH   /api/interactions/:id          ->  patch
 * DELETE  /api/interactions/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Interaction } from '../../sqldb';

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

// Gets a list of Interactions
export function index(req, res) {
  return Interaction
    .findAll({
      where: {
        active: true
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Interaction from the DB
export function show(req, res) {
  return Interaction
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Interaction in the DB
export function create(req, res) {
  if(!req.body.MockupId) {
    return handleError(res)(new Error('MockupId is required'), 404);
  }
  return Interaction
    .count({
      where: {
        MockupId: req.body.MockupId
      }
    })
    .then(count => {
      req.body.code = `I${count + 1}`;
      return Interaction.create(req.body);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Interaction in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Interaction
    .upsert(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Interaction in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Interaction
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

// Deletes a Interaction from the DB
export function destroy(req, res) {
  return Interaction
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(patchUpdates([
      { op: 'replace', path: '/active', value: false }
    ]))
    .then(respondWithResult(res))
    // .then(removeEntity(res))
    .catch(handleError(res));
}
