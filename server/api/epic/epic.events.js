/**
 * Epic model events
 */

'use strict';

import {EventEmitter} from 'events';
var Epic = require('../../sqldb').Epic;
var EpicEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EpicEvents.setMaxListeners(0);

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
    Epic.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    EpicEvents.emit(`${event}:${doc._id}`, doc);
    EpicEvents.emit(event, doc);
    done(null);
  };
}

registerEvents();
export default EpicEvents;
