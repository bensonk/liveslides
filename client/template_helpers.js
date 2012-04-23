Template.slide_list.slides = function () {
  return slides.find({}, { sort: { 'order': 'desc' } });
};

Template.slide_list.is_current = function() {
  return this.current ? " current" : "";
};

Template.slide_list.is_client_current = function() {
  var current = Session.get("current_slide");
  if(current && !Session.get("admin"))
    return (current._id == this._id) ? " client_current" : "";
  else
    return "";
};

Template.slide_list.admin = function() {
  return Session.get("admin");
};

Template.current_slide.slide = function() {
  var slide = Session.get("current_slide");
  if (Session.get("admin") || !slide)
    slide = current_slide();
  if(slide) slide.html_body = linen(slide.body);
  return slide || false;
};
