/**
 * Interaction model events
 */

'use strict';

import { EventEmitter } from 'events';
var Interaction = require('../../sqldb').Interaction;
var InteractionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InteractionEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents() {
  for(var e in events) {
    let event = events[e];
    Interaction.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    InteractionEvents.emit(`${event}:${doc._id}`, doc);
    InteractionEvents.emit(event, doc);
    done(null);
  };
}

registerEvents();
export default InteractionEvents;
