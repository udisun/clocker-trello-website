Meteor.startup(function() {
  if(Times.find().count() === 0) {
    var times = [
      {
        'title': 'time 1',
        'time': Date()
      },
      {
        'title': 'time 2',
        'time': Date()
      }
    ];
    times.forEach(function(time) {
      Times.insert(time);
    });
  }
  
});