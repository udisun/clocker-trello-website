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
    max: 100,
    formly: {
      key: 'title',
      type: 'lx-input',
      templateOptions: {
        type: 'text',
        label: 'Task Name',
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
    type: String,
    optional: true,
    formly: {
      key: 'client',
      type: 'lx-select',
      templateOptions: {
        label: 'Client',
        placeholder: 'Choose a Client',
        selected: 'name',
        choice: 'name',
        required: true,
        options: []
      }
    }
  },
  time: {
    type: String,
    formly: {
      key: 'date',
      type: 'lx-input',
      templateOptions: {
        label: 'Time',
        onFocus: function($viewValue, $modelValue, scope) {
          $(".time-date").show().css("opacity", "1");
          window.center($(".time-date"));
          console.log('The key was pressed!', $viewValue);
        },
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
