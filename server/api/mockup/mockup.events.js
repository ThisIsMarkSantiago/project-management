/**
 * Mockup model events
 */

'use strict';

import {EventEmitter} from 'events';
var Mockup = require('../../sqldb').Mockup;
var MockupEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MockupEvents.setMaxListeners(0);

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
    Mockup.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    MockupEvents.emit(`${event}:${doc._id}`, doc);
    MockupEvents.emit(event, doc);
    done(null);
  };
}

registerEvents();
export default MockupEvents;
