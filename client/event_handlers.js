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
}

Template.slide_list.events = {
  'click #index ul li': function(e) { set_current_slide(e.currentTarget.id); },
  'click #new-slide':  function(e) { add_slide(e) },
  'click a.admin-delete': function(e) { remove_slide($(e.currentTarget).attr("data-slide-id")); }
};
Template.current_slide.events = {
  'click #slide-title': function(e) {
    start_editing();
    $("#title-box").focus();
  },
  'click #slide-body': function(e) {
    start_editing();
    $("#body-box").focus();
  }
};
