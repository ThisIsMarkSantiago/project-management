/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    let Thing = sqldb.Thing;
    let User = sqldb.User;
    let Project = sqldb.Project;
    let Epic = sqldb.Epic;
    let Story = sqldb.Story;
    let Assertion = sqldb.Assertion;

    Thing.destroy({ where: {} })
      .then(() => {
        let thing = Thing.bulkCreate([{
          name: 'Project Management',
          info: 'Manage your projects. Create, update and delete projects of your own.',
          state: 'projects'
        }]);
        return thing;
      })
      .then(() => console.log('finished populating things'))
      .catch(err => console.log('error populating things', err));

    Project.destroy({ where: {} })
      .then(() => console.log('finished populating projects'))
      .catch(err => console.log('error populating projects', err));

    Epic.destroy({ where: {} })
      .then(() => console.log('finished populating epics'))
      .catch(err => console.log('error populating epics', err));

    Story.destroy({ where: {} })
      .then(() => console.log('finished populating stories'))
      .catch(err => console.log('error populating stories', err));

    Assertion.destroy({ where: {} })
      .then(() => console.log('finished populating assertions'))
      .catch(err => console.log('error populating assertions', err));

    return User.destroy({ where: {} })
      .then(() => User.bulkCreate([{
        provider: 'local',
        name: 'Test User',
        email: 'user@example.com',
        password: 'test'
      }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      }])
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err)));
  }
}
