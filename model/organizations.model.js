Organizations = new Mongo.Collection('organization');

Organizations.allow({
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

Organizations.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Organization Name?",
    max: 100
  },
  "trello.name": {
  	type: String
  },
  "trello.id": {
    type: String
  },
  "trello.url": {
    type: String
  }
}));