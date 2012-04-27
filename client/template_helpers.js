Template.content.has_show = function() {
  return !!Session.get('show_id');
};
Template.shows.shows = function() {
  return Shows.find();
};
Template.slide_list.slides = function () {
  return Slides.find({}, { sort: { 'order': 'desc' } });
};

Template.slide_list.is_current = function() {
  return this.current ? " current" : "";
};

Template.slide_list.is_client_current = function() {
  return Session.equals("client_current", this._id) ? " client_current" : "";
  var current = Session.get("current_slide");
  var slide = Days.findOne(Session.get("client_current"));
  if(current && !Session.get("admin"))
    return (current._id == this._id) ? " client_current" : "";
  else
    return "";
};

Template.slide_list.admin = function() {
  return Session.get("admin");
};
Template.current_slide.editing_body = function() {
  return Session.get('editingBody');
}
Template.current_slide.html_body = function() {
  return linen(this.body);
}
Template.current_slide.prettify = function() {
  Meteor.defer(function() {
    prettify();
  });
}
Template.current_slide.slide = function() {
  var client = Slides.findOne(Session.get('client_current'));
  if(client) { 
    return client;
  } else {
    var slide = Slides.findOne(Session.get("current"));
    return slide || false;
  }
};
