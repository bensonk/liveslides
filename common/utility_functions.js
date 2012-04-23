function set_db_current_slide(id) {
  slides.update({}, { $set: { current: false } }, { multi: true });
  slides.update({ _id: id }, { $set: { current: true } });
}

function current_slide() {
  return slides.findOne({ current: true }) || slides.findOne({});
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

function move_prev(id) {
  var s = slides.findOne({_id: id});
  if(!s) return;
  var p = slides.findOne({ order: { $lt: s.order } }, { sort: { order: -1 } });
  if(!p) return;

  console.log("s:", s.title, s.order);
  console.log("p:", p.title, p.order);

  slides.update({_id: s._id}, { $set: { order: p.order } });
  slides.update({_id: p._id}, { $set: { order: s.order } });
}

function move_next(id) {
  var s = slides.findOne({_id: id});
  if(!s) return;
  var n = slides.findOne({order: { $gt: s.order } }, { sort: { order: 1 } });
  if(!n) return;

  console.log("s:", s.title, s.order);
  console.log("n:", n.title, n.order);

  slides.update({_id: s._id}, { $set: { order: n.order } });
  slides.update({_id: n._id}, { $set: { order: s.order } });
}

function remove_slide(id) {
  if(slides.find({ _id: id }).current)
    set_current_slide(slides.findOne({current: false})._id);
  slides.remove({ _id: id });
}
