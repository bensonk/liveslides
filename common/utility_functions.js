function set_db_current_slide(id) {
  if(!Session.equals('current', id)) {
    slides.update({current: true}, { $set: { current: false } }, { multi: true });
    slides.update({ _id: id }, { $set: { current: true } });
  }
}

function current_slide() {
  return slides.findOne({ current: true }) || slides.findOne({});
}

function set_current_slide(id) {
  if(Session.equals("admin",true)) {
    set_db_current_slide(id);
    Session.set("current", id);
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
  set_current_slide(slides.insert({ title: "New Slide", body: "Edit me!", order: slides.find().count() }));
}
function insert_slide() {
  var current = slides.findOne(Session.get('current'));
  if(current) {
    slides.update({order : {$gt: current.order}}, {$inc: {order: 1}}, {multi: true});
    set_current_slide(slides.insert({ title: "New Slide"+current.order, body: "Edit me!", order: current.order+1 }));
  } else {
    set_current_slide(slides.insert({ title: "New Slide", body: "Edit me!", order: slides.find().count() }));
  }
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
  if(slides.findOne(Session.get('current'))) set_current_slide(slides.findOne({current: false})._id);
  var slide = slides.findOne(id);
  slides.update({order : {$gt: slide.order}}, {$inc: {order: -1}}, {multi: true});
  slides.remove({ _id: id });
}
