function update(selector, updates, multi) {
  if(!Session.get('passcode')) return;
  multi = multi || false;
  Meteor.call('update', selector, updates, multi, Session.get('passcode'));
}
function insert(attributes) {
  if(!Session.get('passcode')) return;
  Meteor.call('insert', attributes, Session.get('passcode'));
}
function remove(selector) {
  if(!Session.get('passcode')) return;
  Meteor.call('remove', selector, Session.get('passcode'));
}

function current_slide() {
  return slides.findOne({ current: true }) || slides.findOne({}, {sort: {order: 1}});
}

function add_slide() {
  set_current_slide(insert({ title: "New Slide", body: "Edit me!", order: slides.find().count() }));
}
function insert_slide() {
  var current = current_slide(); 
  if(current) {
    update({order : {$gt: current.order}}, {$inc: {order: 1}}, {multi: true});
    set_current_slide(insert({ title: "New Slide"+current.order, body: "Edit me!", order: current.order+1 }));
  } else {
    set_current_slide(insert({ title: "New Slide", body: "Edit me!", order: slides.find().count() }));
  }
}

function move_prev(id) {
  var s = slides.findOne({_id: id});
  if(!s) return;
  var p = slides.findOne({ order: { $lt: s.order } }, { sort: { order: -1 } });
  if(!p) return;

  update({_id: s._id}, { $set: { order: p.order } });
  update({_id: p._id}, { $set: { order: s.order } });
}

function move_next(id) {
  var s = slides.findOne({_id: id});
  if(!s) return;
  var n = slides.findOne({order: { $gt: s.order } }, { sort: { order: 1 } });
  if(!n) return;

  update({_id: s._id}, { $set: { order: n.order } });
  update({_id: n._id}, { $set: { order: s.order } });
}

function remove_slide(id) {
  if(current_slide()) set_current_slide(slides.findOne({current: false})._id);
  var slide = slides.findOne(id);
  update({order : {$gt: slide.order}}, {$inc: {order: -1}}, {multi: true});
  remove({ _id: id });
}
