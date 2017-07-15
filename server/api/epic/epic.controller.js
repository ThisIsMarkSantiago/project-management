/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/epics              ->  index
 * POST    /api/epics              ->  create
 * GET     /api/epics/:id          ->  show
 * GET     /api/epics/:id/stories  ->  stories
 * PUT     /api/epics/:id          ->  upsert
 * PATCH   /api/epics/:id          ->  patch
 * DELETE  /api/epics/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Epic, Story, Mockup, Assertion, Interaction } from '../../sqldb';

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

// Gets a list of Epics
export function index(req, res) {
  return Epic
    .findAll({
      where: {
        active: true
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Epic from the DB
export function show(req, res) {
  return Epic
    .find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Epic in the DB
export function create(req, res) {
  if(!req.body.ProjectId) {
    return handleError(res)(new Error('ProjectId is required'), 404);
  }
  return Epic
    .count({
      where: {
        ProjectId: req.body.ProjectId
      }
    })
    .then(count => {
      req.body.code = `E${count + 1}`;
      return Epic.create(req.body);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Epic in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Epic
    .upsert(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Epic in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Epic
    .find({
      where: {
        _id: req.params.id
      },
      include: [{
        model: Story,
        as: 'stories',
        where: { active: true },
        order: [[{ model: Epic, as: 'epics' }, { model: Story, as: 'stories' }, 'code', 'DESC']],
        required: false,
        include: [{
          model: Mockup,
          as: 'mockups',
          where: { active: true },
          order: [[{ model: Epic, as: 'epics' }, { model: Story, as: 'stories' }, { model: Mockup, as: 'mockups' }, 'code', 'ASC']],
          required: false,
          include: [{
            model: Interaction,
            as: 'interactions',
            where: { active: true },
            order: [[{ model: Epic, as: 'epics' }, { model: Story, as: 'stories' }, { model: Mockup, as: 'mockups' }, { model: Interaction, as: 'interactions' }, 'code', 'ASC']],
            required: false
          }]
        }, {
          model: Assertion,
          as: 'assertions',
          where: { active: true },
          order: [[{ model: Epic, as: 'epics' }, { model: Story, as: 'stories' }, { model: Assertion, as: 'assertions' }, 'code', 'ASC']],
          required: false
        }]
      }]
    })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Epic from the DB
export function destroy(req, res) {
  return Epic
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
    .catch(handleError(res));
}

// Gets all Stories of an Epic from the DB
export function stories(req, res) {
  return Story
    .findAll({
      where: {
        EpicId: req.params.id,
        active: true
      },
      order: [['code', 'ASC']],
      include: [{
        model: Mockup,
        as: 'mockups',
        where: { active: true },
        order: [[{ model: Story, as: 'stories' }, { model: Mockup, as: 'mockups' }, 'code', 'ASC']],
        required: false,
        include: [{
          model: Interaction,
          as: 'interactions',
          where: { active: true },
          order: [[{ model: Story, as: 'stories' }, { model: Mockup, as: 'mockups' }, { model: Interaction, as: 'interactions' }, 'code', 'ASC']],
          required: false
        }]
      }, {
        model: Assertion,
        as: 'assertions',
        where: { active: true },
        order: [[{ model: Story, as: 'stories' }, { model: Assertion, as: 'assertions' }, 'code', 'ASC']],
        required: false
      }]
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
