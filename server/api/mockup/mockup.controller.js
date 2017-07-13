/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/mockups              ->  index
 * POST    /api/mockups              ->  create
 * GET     /api/mockups/:id          ->  show
 * PUT     /api/mockups/:id          ->  upsert
 * PATCH   /api/mockups/:id          ->  patch
 * DELETE  /api/mockups/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Mockup } from '../../sqldb';
import base64 from 'base64-img';

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

// Gets a list of Mockups
export function index(req, res) {
  return Mockup
    .findAll({
      where: {
        active: true
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Mockup from the DB
export function show(req, res) {
  return Mockup
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Mockup in the DB
export function create(req, res) {
  if(!req.body.StoryId) {
    return handleError(res)(new Error('StoryId is required'), 404);
  }

  if(!req.body.image) {
    return handleError(res)(new Error('Image is required'), 404);
  }

  return base64.img(req.body.image, 'client/images/', (new Date()).toISOString(), (error, imagePath) => {
    if(error) {
      return handleError(res)(error);
    }
    delete req.body.image;
    req.body.imagePath = imagePath.replace('client/', '');
    return Mockup
      .count({
        where: {
          StoryId: req.body.StoryId
        }
      })
      .then(count => {
        req.body.code = `M${count + 1}`;
        return Mockup.create(req.body);
      })
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
  });
}

// Upserts the given Mockup in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Mockup
    .upsert(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Mockup in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  const image = req.body.filter(patchUpdate => patchUpdate.path === '/image')[0];
  const applyPatch = () => {
    Mockup
      .find({
        where: {
          _id: req.params.id
        }
      })
      .then(handleEntityNotFound(res))
      .then(patchUpdates(req.body))
      .then(respondWithResult(res))
      .catch(handleError(res));
  };
  if(!image) {
    return applyPatch();
  }
  return base64.img(image.value, 'client/images/', (new Date()).toISOString(), (error, imagePath) => {
    if(error) {
      return handleError(res)(error);
    }
    req.body.splice(req.body.indexOf(image), 1);
    req.body.push({ op: 'replace', path: '/imagePath', value: imagePath.replace('client/', '') });
    applyPatch();
  });
}

// Deletes a Mockup from the DB
export function destroy(req, res) {
  return Mockup
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
