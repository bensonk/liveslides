var slides = new Meteor.Collection("slides");

function set_db_current_slide(id) {
  slides.update({}, { $set: { current: false } }, { multi: true });
  slides.update({ _id: id }, { $set: { current: true } });
}

function current_slide() {
  var current = slides.findOne({ current: true });
  if(current == null) {
    var first = slides.findOne({});
    if(first) {
      current = slides.findOne({});
      set_db_current_slide(current._id);
    }
  }
  return current;
}

function set_current_slide(id) {
  if(Session.equals("admin",true)) {
    set_db_current_slide(id);
  }
  else {
    var current = current_slide();
    if(current && id == current._id)
      Session.set("current_slide", null);
    else
      Session.set("current_slide", slides.findOne({ _id: id }));
  }
}

function add_slide() {
  set_current_slide(slides.insert({ title: "New Slide", body: "Edit me!" }));
}

function remove_slide(id) {
  if(slides.find({ _id: id }).current)
    set_current_slide(slides.findOne({current: false})._id);
  slides.remove({ _id: id });
}
