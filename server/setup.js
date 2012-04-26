// Show - {title: String,
//         summary: String,
//         created_at: Integer}
/*Meteor.publish('shows', function() {
  return Shows.find();
});*/

//Slide -- {title: String,
//          order: Integer,
//          show_id: String,
//          created_at: Integer,
//          updated_at: Integer}
Meteor.publish('slides', function() {
  return slides.find();
});

/*
Meteor.methods({
  reset: function() {
    shows.remove({});
    slides.remove({});
    var show_id = shows.insert({title: 'Getting started with liveslides', created_at: Date.now()})
    var slides =[{title: 'welcome to your slideshow'},{}, {}]
    for (var i = 0; i < stops.length; i++)
      Days.insert({stop: stops[i], order: i+1, trip_id: trip_id, created_at: Date.now(), updated_at: Date.now()});
  }
})
Meteor.startup(function() {
  if (Trips.find().count() === 0) {
    Meteor.call('reset');
  }
});*/
