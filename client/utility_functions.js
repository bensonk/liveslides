Meteor.methods({
  update: function(selector, updates, multi) {
    Slides.update(selector, updates, multi);
  },
  insert: function(attributes) {
    Slides.insert(attributes);
  },
  remove: function(selector) {
    Slides.remove(selector);
  }
});

function normalize_slide_order() {
  var slide_ids = $("#index li").map(function(i, s) { return s.id; });
  for(i in _.range(slide_ids.length)) {
    update({ _id: slide_ids[i] }, { $set: { order: i } });
  }
}

function prettify() {
  Meteor.flush();
  $("pre").addClass('prettyprint');
  prettyPrint();
}
function set_current_slide(id) {
  if(Session.equals("admin",true)) {
    set_db_current_slide(id);
    Session.set("current", id);
  }
  Session.set("client_current", id);

  function set_db_current_slide(id) {
    if(!Session.equals('current', id)) {
      update({current: true}, { $set: { current: false } }, { multi: true });
      update({ _id: id }, { $set: { current: true } });
    }
  }
}

function set_admin(x) {
  if(x) {
    Session.set("admin", true);
  }
  else {
    Session.set("admin", false);
  }
}
