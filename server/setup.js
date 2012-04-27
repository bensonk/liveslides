// Show - {title: String,
//         summary: String,
//         created_at: Integer}
Meteor.publish('shows', function() {
  return Shows.find({}, {fields: {secret: false}});
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
    var show = Shows.findOne(selector.show_id);
    if(show && passcode && (passcode === show.secret)) {
      return Slides.update(selector, updates, multi);
    }
  },
  insert: function(attributes, passcode) {
    var secret = Shows.findOne(attributes.show_id).secret;
    if(passcode && passcode === secret) {
      return Slides.insert(attributes);
    }
  },
  remove: function(selector, passcode) {
    var secret = Shows.findOne(selector.show_id).secret;
    if(passcode && passcode === secret) {
      return Slides.remove(selector);
    }
  },
  confirmSecret: function(show_id, client_secret) {
    var show = Shows.findOne(show_id);
    if(show && show.secret === client_secret) {
      return true;
    } else {
      return false;
    }
  }
});
Meteor.startup(function() {
  Meteor.default_server.method_handlers['/slides/insert'] = function () {};
  Meteor.default_server.method_handlers['/slides/update'] = function () {};
  Meteor.default_server.method_handlers['/slides/remove'] = function () {};
});
