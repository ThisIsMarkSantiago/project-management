/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * GET     /api/projects/:id/epics    ->  epics
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  upsert
 * PATCH   /api/projects/:id          ->  patch
 * DELETE  /api/projects/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Project, Epic, Story, Mockup, Interaction } from '../../sqldb';

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

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

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

// Gets a list of Projects
export function index(req, res) {
  return Project.findAll({
    where: {
      active: true
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Project from the DB
export function show(req, res) {
  return Project.find({
    where: {
      _id: req.params.id
    },
    include: [{
      model: Epic,
      as: 'epics',
      where: { active: true },
      required: false,
      include: [{
        model: Story,
        as: 'stories',
        where: { active: true },
        required: false,
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
      }]
    }]
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Project in the DB
export function create(req, res) {
  if(!req.body.UserId) {
    return handleError(res)(new Error('UserId is required'));
  }
  return Project.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Project in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Project.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(() => Project.findById(req.params.id))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Project in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Project.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Project from the DB
export function destroy(req, res) {
  return Project.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Gets all Epics of a Project from the DB
export function epics(req, res) {
  return Epic.findAll({
    where: {
      ProjectId: req.params.id,
      active: true
    },
    include: [{
      model: Story,
      as: 'stories',
      where: { active: true },
      required: false,
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
    }]
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
