var slides = new Meteor.Collection("slides");

if (Meteor.is_client) {
  Template.slide_list.slides = function () {
    return slides.find();
  };

  Template.slide_list.is_current = function() {
    return this.current ? " current" : "";
  };

  Template.current_slide.slide = function() {
    return slides.findOne({ current: true }) || false;
  };

  $('#index ul li').live('click', function(e) {
    console.log(e.currentTarget.id);
    slides.update({}, { $set: { current: false } }, { multi: true });
    slides.update({ _id: e.currentTarget.id }, { $set: { current: true } });
  });
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
