/**
 * Story model events
 */

'use strict';

import {EventEmitter} from 'events';
var Story = require('../../sqldb').Story;
var StoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StoryEvents.setMaxListeners(0);

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
    Story.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    StoryEvents.emit(`${event}:${doc._id}`, doc);
    StoryEvents.emit(event, doc);
    done(null);
  };
}

registerEvents();
export default StoryEvents;
