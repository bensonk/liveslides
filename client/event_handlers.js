Template.slideshows.events = {
  'click button': function() {
    Router.newShow();
  }
}
Template.show.events = {
  'click': function() {
     Session.set('show_id', this._id);
   }
};
Template.auth.events = {
  'click #auth_submit': function() {
    var secret = $('#auth_input').val();
    set_admin(secret);
  },
  'click #ok': function() {
    set_admin(Session.get('passcode'));
  }
}
Template.slideshow_landing.events = {
  'dblclick #show-title': function(e) {
    if(!Session.get('admin')) return;
    $('#show-title').attr('contentEditable', true).focus();
  },
  'blur #show-title': function() {
    $('#show-title').attr('contentEditable', null);
  }, 
  'keydown #show-title': function(e) {
    e.stopPropagation();
    if(e.keyCode === 13) {
      e.preventDefault();
      var show = Shows.findOne(Session.get('show_id')); 
      var new_title = $('#show-title').text().replace(/(^\s+|\s+$)/g,'');
      if(new_title.length > 3 && Session.get('admin')) {
        updateShow({$set: {title: new_title}});
      } else {
        $('#show-title').text(show.title);
      }
      $('#show-title').blur();
    } 
  },
  'dblclick #show-body': function() {
    if(!Session.get('admin')) return;
    Session.set('editingBody', true);
    Meteor.flush();
    $('#show-body textarea').focus();
  },
  'blur #show-body': function(e) {
    Session.set('editingBody', false);
    var show = Shows.findOne(Session.get('show_id')); 
    var new_body = $('#body-box').val();
    if(show && !_.isEqual(show.body, new_body))
      updateShow({$set: {body: new_body}});
  }
};
Template.index_slide.events = {
  'click .past': function() {set_current_slide(this._id);},
  'click .future': function() {if(Session.get('admin')) set_current_slide(this._id);},
  'click': function(e) {
    console.log(e, e.srcElement, this);
    //move_prev(this._id);
  },
  'click li span a.admin-next': function() { move_next(this._id); },
  'click li span a.admin-delete': function() { remove_slide(this._id);}
};
Template.slide_list.events = {
  'click #new-slide':  function() { insert_slide(); },
  'click #remove-show':  function(e) { 
    if(confirm('Are you sure? This cannot be undone.')) {
      removeShow();
    }
  },
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
    e.stopPropagation();
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
  'click #cancel-button': function() {
    Session.set('editingBody', false);
  },
  'click #save-button': function() {
    Session.set('editingBody', false);
    //TODO client current is not enough!!
    var slide = Slides.findOne(Session.get('client_current')); 
    var new_body = $('#body-box').val();
    if(slide && !_.isEqual(slide.body, new_body))
      update(slide._id, {$set: {body: new_body}});
  },
  'click #edit-button': function() {
    if(!Session.get('admin')) return;
    Session.set('editingBody', true);
    Meteor.flush();
    $('#slide-body textarea').focus();
  },
};
