function update_slide_order() {
  var slide_ids = $("#index li").map(function(i, s) { return s.id });
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
}


function make_index_sortable() {
  $('#index ul').sortable().bind('sortupdate', function() {
    update_slide_order();
    Meteor.defer(function() {
      Meteor.flush();
      make_index_sortable();
      console.log("hello");
    });
  });
}
// Once the page is loaded, hit that for the first time.
Meteor.startup(function() {
  Meteor.setTimeout(make_index_sortable, 250);
});

Template.slide_list.events = {
  'click #index ul li': function(e) { set_current_slide(e.currentTarget.id); },
  'click #new-slide':  function(e) { add_slide(e); },
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
