Template.slide_list.events = {
  'click #index ul li': function(e) { set_current_slide(e.currentTarget.id); },
  'click #new-slide':  function(e) { insert_slide(e); },
  'click a.admin-next': function(e) { move_next($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-prev': function(e) { move_prev($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-delete': function(e) { remove_slide($(e.currentTarget).parents("li").attr("id")); }
};
Template.current_slide.events = {
  'dblclick #slide-title': function(e) {
    if(!Session.get('admin')) return;
    $('#slide-title').attr('contentEditable', true).focus();
  },
  'blur #slide-title': function() {
    $('#slide-title').attr('contentEditable', null);
  }, 
  'keydown #slide-title': function(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
      var slide = slides.findOne(Session.get('current'));
      var new_title = $('#slide-title').text().replace(/(^\s+|\s+$)/g,'');
      if(new_title.length > 3 && Session.get('admin')) {
        slides.update(slide._id, {$set : {title: new_title}});
      } else {
        console.log('slide title too short');
        $('#slide-title').text(slide.title);
      }
      $('#slide-title').blur();
    } 
  },
  'dblclick #slide-body': function() {
    if(!Session.get('admin')) return;
    Session.set('editingBody', true);
    Meteor.flush();
    $('#slide-body textarea').focus();
  },
  'blur #slide-body': function(e) {
    //$('#slide-body').removeClass('editing').attr('contentEditable', null);
    Session.set('editingBody', false);
    var slide = slides.findOne(Session.get('current'));
    slides.update(slide._id, {$set: {body: $('#body-box').val()}});
  }
  /*'click #slide-title': function(e) {
    start_editing();
    $("#title-box").focus();
  },
  'click #slide-body': function(e) {
    start_editing();
    $("#body-box").focus();
  }*/
};
