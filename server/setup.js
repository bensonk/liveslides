// Show - {title: String,
//         summary: String,
//         created_at: Integer}
Meteor.publish('shows', function() {
  return Shows.find();
});

//Slide -- {title: String,
//          order: Integer,
//          show_id: String,
//          created_at: Integer,
//          updated_at: Integer}
Meteor.publish('slides', function(show_id) {
  return Slides.find({show_id: show_id});
});

var server_password = 'supersecret';
Meteor.methods({
  update: function(selector, updates, multi, passcode) {
    if(passcode && passcode === server_password) {
      return Slides.update(selector, updates, multi);
    }
  },
  insert: function(attributes, passcode) {
    if(passcode && passcode === server_password) {
      return Slides.insert(attributes);
    }
  },
  remove: function(selector, passcode) {
    if(passcode && passcode === server_password) {
      return Slides.remove(selector);
    }
  }
});
Meteor.startup(function() {
  Meteor.default_server.method_handlers['/slides/insert'] = function () {};
  Meteor.default_server.method_handlers['/slides/update'] = function () {};
  Meteor.default_server.method_handlers['/slides/remove'] = function () {};
});
