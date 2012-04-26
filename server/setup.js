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

var server_password = 'supersecret';
Meteor.methods({
  update: function(selector, updates, multi, passcode) {
    if(passcode && passcode === server_password) {
      slides.update(selector, updates, multi);
    }
  },
  insert: function(attributes, passcode) {
    if(passcode && passcode === server_password) {
      slides.insert(attributes);
    }
  },
  remove: function(selector, passcode) {
    if(passcode && passcode === server_password) {
      slides.remove(selector);
    }
  }
});
Meteor.startup(function() {
  Meteor.default_server.method_handlers['/slides/insert'] = function () {};
  Meteor.default_server.method_handlers['/slides/update'] = function () {};
  Meteor.default_server.method_handlers['/slides/remove'] = function () {};
});
