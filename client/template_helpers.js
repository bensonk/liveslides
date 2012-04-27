Template.content.has_show = function() {
  console.log('show?', Session.get('show_id'));
  return !!Shows.findOne(Session.get('show_id'));
};
Template.content.auth_page = function() {
  return Session.get('auth_page');
};
Template.content.has_current = function() {
  return !!Session.get('client_current'); //Slides.findOne({current: true});
};
Template.auth.has_passcode = function() {
  return !!Session.get('passcode');
};
Template.auth.passcode = function() {
  return Session.get('passcode');
};
Template.slideshows.shows = function() {
  return Shows.find();
};
Template.slide_list.slides = function () {
  return Slides.find({}, { sort: { 'order': 'desc' } });
};
Template.slide_list.show_title = function() {
  var show = Shows.findOne(Session.get('show_id'));
  return show ? show.title : false;
}
Template.slide_list.no_current = function() {
  return !!Session.get('client_current') ? '' : ' client_current';
};
Template.slide_list.is_current = function() {
  return this.current ? " current" : "";
};
Template.slide_list.is_future = function() {
  var slide = current_slide();
  if(!slide) return ' future';
  return this.order > slide.order ? ' future' : ' past';
}

Template.slide_list.is_client_current = function() {
  return Session.equals("client_current", this._id) ? " client_current" : "";
};

Template.slide_list.admin = function() {
  return Session.get("admin");
};
Template.slideshow_landing.slideshow = function() {
  return Shows.findOne(Session.get('show_id'));
};
Template.slideshow_landing.editing_body = function() {
  return Session.get('editingBody');
}
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
