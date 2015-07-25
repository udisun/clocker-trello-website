Boards = new Mongo.Collection('boards');

Boards.allow({
  insert: function(userId, time) {
    return true;
  },
  update: function(userId, time, fields, modifier) {
    return true;
  },
  remove: function(userId, time) {
    return true;
  }
});

// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions({
  formly: Match.Optional(Match.Any)
});

Boards.attachSchema(new SimpleSchema({
  "trello.name": {
  	type: String
  },
  "trello.id": {
    type: String
  },
  "trello.idOrganization": {
    type: String
  },
  "trello.url": {
    type: String
  }
}));