Template.slideshows.events = {
  'click #new_show': function() {
    Router.newShow();
  }
}
Template.show.events = {
  'click': function() {
     Session.set('show_id', this._id);
   }
};
Template.slide_list.events = {
  'click #index ul li.past': function(e) { set_current_slide(e.currentTarget.id); },
  'click #index ul li.future': function(e) { if(Session.get('admin')) set_current_slide(e.currentTarget.id); },
  'click #new-slide':  function(e) { insert_slide(e); },
  'click a.admin-next': function(e) { e.stopPropagation(); move_next($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-prev': function(e) { e.stopPropagation(); move_prev($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-delete': function(e) { e.stopPropagation(); remove_slide($(e.currentTarget).parents("li").attr("id")); },
  'click a.admin-edit': function(e) {e.stopPropagation(); Session.set("client_current", $(e.currentTarget).parent().attr('id'));}
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
      var slide = Slides.findOne(Session.get('client_current')); 
      var new_title = $('#slide-title').text().replace(/(^\s+|\s+$)/g,'');
      if(new_title.length > 3 && Session.get('admin')) {
        update(slide._id, {$set : {title: new_title}});
      } else {
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
    Session.set('editingBody', false);
    var slide = Slides.findOne(Session.get('client_current')); 
    var new_body = $('#body-box').val();
    if(slide && !_.isEqual(slide.body, new_body))
      update(slide._id, {$set: {body: new_body}});
  }
};
