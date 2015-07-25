Times = new Mongo.Collection('times');

Times.allow({
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

Times.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "What have you done?",
    max: 100,
    formly: {
      key: 'title',
      type: 'lx-input',
      wrapper: 'lx-wrapper-inline',
      templateOptions: {
        type: 'text',
        label: 'First Name',
        required: true
      },
      validation: {
        messages: {}
      },
      modelOptions: {
        allowInvalid: false
      }
    }
  },
  project: {
    type: Object,
    label: "Project",
    optional: true,
    formly: {
      key: 'project',
      type: 'lx-input',
      wrapper: 'lx-wrapper-inline',
      templateOptions: {
        type: 'text',
        label: 'Project',
        required: false
      }
    }
  },
  time: {
    type: Date,
    label: "Time",
    optional: true,
    formly: {
      key: 'date',
      type: 'lx-date-picker',
      wrapper: 'lx-wrapper-inline',
      templateOptions: {
        label: 'Time',
        required: true
      }
    }
  },
  tags: {
    type: [String],
    label: "Tags",
    optional: true
  },
  budget: {
    type: Number,
    label: "Budget",
    optional: true
  }
}));