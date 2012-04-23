function normalize_slide_order() {
  var slide_ids = $("#index li").map(function(i, s) { return s.id; });
  for(i in _.range(slide_ids.length)) {
    slides.update({ _id: slide_ids[i] }, { $set: { order: i } });
  }
}

function save_slide() {
  var new_values = {
    title: $('#title-box').attr('value'),
    body:  $('#body-box').attr('value')
  };
  slides.update({ _id: current_slide()._id }, { $set: new_values } );
}

function start_editing() {
  if(!Session.get("admin")) return false;
  $('#main-slide').replaceWith(Template.edit_slide(current_slide()));
  $('#title-box, #body-box').blur(save_slide);
  return false;
}

function set_admin(x) {
  if(x) {
    Session.set("admin", true);
  }
  else {
    Session.set("admin", false);
  }
}
