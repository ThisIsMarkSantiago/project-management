/**
 * Sequelize initialization module
 */

'use strict';

// import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Project = db.sequelize.import('../api/project/project.model');
db.Epic = db.sequelize.import('../api/epic/epic.model');
db.Story = db.sequelize.import('../api/story/story.model');
db.Assertion = db.sequelize.import('../api/assertion/assertion.model');
db.Mockup = db.sequelize.import('../api/mockup/mockup.model');

db.User.hasMany(db.Project);
db.Project.belongsTo(db.User);
db.Project.hasMany(db.Epic);
db.Epic.belongsTo(db.Project);
db.Epic.hasMany(db.Story);
db.Story.belongsTo(db.Epic);
db.Story.hasMany(db.Assertion);
db.Assertion.belongsTo(db.Story);
db.Story.hasMany(db.Mockup);
db.Mockup.belongsTo(db.Story);

module.exports = db;
