Template.content.has_show = function() {
  return !!Shows.findOne(Session.get('show_id'));
};
Template.content.auth_page = function() {
  return Session.get('auth_page');
};
Template.content.show_home = function() {
  return !!Session.get('home');
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
Template.slide_list.admin = function() {
  return Session.get("admin");
};
Template.slide_list.no_current = function() {
  return !!Session.get('home') ? ' client_current' : '';
};
Template.index_slide.is_current = function() {
  return this.current ? " current" : "";
};
Template.index_slide.is_future = function() {
  var slide = current_slide();
  if(!slide) return ' future';
  return this.order > slide.order ? ' future' : ' past';
}

Template.index_slide.is_client_current = function() {
  return Session.equals("client_current", this._id) ? " client_current" : "";
};

Template.index_slide.admin = function() {
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
    $('#slide_index').sortable('destroy');
    if(Session.get('admin')) {
      $('#slide_index').sortable().bind('sortupdate', function(e, ui) {
        var slide = Slides.findOne(ui.item[0].id);
        var old_index = slide.order;
        var new_index = $('li').index($('#'+ui.item[0].id)) -1;
        if(old_index > new_index) {
          update({$and: [{order: {$gte: new_index}}, {order: {$lt: old_index}}]}, {$inc: {order: 1}}, {multi: true});
        } else {
          update({$and: [{order: {$gt: old_index}}, {order: {$lte: new_index}}]}, {$inc: {order: -1}}, {multi: true});
        }
        update(slide._id, {$set: {order: new_index}});
        set_current_slide(slide._id);
      });
    }
  });
}
Template.current_slide.admin = function() {
  return Session.get("admin");
};
Template.current_slide.slide_or_home = function() {

}
Template.current_slide.slide = function() {
  var client = Slides.findOne(Session.get('client_current'));
  if(client) { 
    return client;
  } else {
    var slide = current_slide();
    return slide || false;
  }
};
