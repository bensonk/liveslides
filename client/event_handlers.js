Template.slide_list.events = {
  'click #index ul li': function(e) { set_current_slide(e.currentTarget.id); },
  'click #new-slide':  function(e) { add_slide(e); },
  'click a.admin-next': function(e) { move_next($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-prev': function(e) { move_prev($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-delete': function(e) { remove_slide($(e.currentTarget).parents("li").attr("id")); }
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
