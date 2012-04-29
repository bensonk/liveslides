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
function advanceShow(direction) {
  Session.set('client_current', null);
  var current = current_slide();
  if(current) {
    var move_to = Slides.findOne({order: current.order+direction});
    if(move_to) {
      set_db_current_slide(move_to._id);
    } else {
      unset_current_slide();
    } 
  } else {
    var first = Slides.findOne({}, {sort: {order: 1}});
    set_db_current_slide(first._id);
  }
}
function advaceToFirstOrLast(direction) {
  Session.set('client_current', null);
  var slide = Slides.findOne({}, {sort: {order: direction}});
  if(slide) {
    set_db_current_slide(slide._id);
  }
}
function presentationMode(val) {
  $('body').unbind('keydown').removeClass('presentation');
  if(val) {
    Session.set('admin', false);
    $('body').addClass('presentation').keydown(function(e) {
      if(e.shiftKey) {
        if(e.keyCode === 72) {
          advaceToFirstOrLast(1);
        } else if(e.keyCode === 76) {
          advaceToFirstOrLast(-1);
        }
      } else if(_.include([39, 40, 74, 76], e.keyCode)) {
        e.preventDefault();
        advanceShow(1);
      } else if(_.include([37, 38, 75, 72], e.keyCode)) {
        e.preventDefault();
        advanceShow(-1);
      } else if(e.keyCode ===27 ) {
        presentationMode(false);
      } 
    });
  } else {
    Session.set('admin', true); 
  }
}
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
function unset_current_slide() {
  if(Session.get('passcode')) {
    update({current: true}, {$set: {current: false}}, {multi: true});
  }
  Session.set('client_current', null);
  Session.set('home', true);
}
function set_db_current_slide(id) {
  update({current: true}, { $set: { current: false } }, { multi: true });
  update({ _id: id }, { $set: { current: true } });
}
function set_current_slide(id) {
  if(Session.equals("admin",true)) {
    set_db_current_slide(id);
  }
  Session.set("client_current", id);
  Session.set('home', false);
}
function set_admin(code) {
  code = code || Session.get('passcode');
  Meteor.call('confirmSecret', Session.get('show_id'), code, function(error, res) {
    if(res) {
      Session.set("admin", true);
      Session.set('passcode', code);
      Session.set('auth_page', false);
      Router.setShow(Session.get('show_id'));
    }
    else {
      Session.set('auth_page', true);
      Session.set("admin", false);
      Session.set('passcode', null);
    }
  })
}
