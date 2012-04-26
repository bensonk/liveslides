
Meteor.publish('slides', function() {
  return slides.find();
});
Meteor.startup(function() {
  // Put useful startup stuff here
});
