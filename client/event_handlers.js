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
Template.index_slide.events = {
  'click .past': function() {set_current_slide(this._id);},
  'click .future': function() {if(Session.get('admin')) set_current_slide(this._id);},
  'click': function(e) {
    if($(e.srcElement).hasClass('delete')) {
      remove_slide(this._id);
    }
  }
};
Template.slide_list.events = {
  'click #new-slide':  function() { insert_slide(); },
  'click #remove-show':  function(e) { 
    if(confirm('Are you sure? This cannot be undone.')) {
      removeShow();
    }
  },
  'click': function(e) {
    if($(e.srcElement).hasClass('first')) {
      Session.set('home', true);
    }
  }
};
Template.current_slide.events = {
  'dblclick #slide-title': function(e) {
    if(!Session.get('admin')) return;
    $('#slide-title').attr('contentEditable', true).focus();
  },
  'blur #slide-title': function() {
    $('#slide-title').attr('contentEditable', null);
    $('#slide-title').text(this.title);
  }, 
  'keydown #slide-title': function(e) {
    e.stopPropagation();
    if(e.keyCode === 13) {
      e.preventDefault();
      var new_title = $('#slide-title').text().replace(/(^\s+|\s+$)/g,'');
      if(new_title.length > 3 && Session.get('admin')) {
        if(this.show_id) {
          update(this._id, {$set : {title: new_title}});
        } else {
          updateShow({$set: {title: new_title}});
        }
      } else {
        $('#slide-title').text(this.title);
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
    var new_body = $('#body-box').val();
    if(!_.isEqual(this.body, new_body)) {
      if(this.show_id) {
        update(this._id, {$set: {body: new_body}});
      } else {
        updateShow({$set: {body: new_body}});
      }
    }
  },
  'click #edit-button': function() {
    if(!Session.get('admin')) return;
    Session.set('editingBody', true);
    Meteor.flush();
    $('#slide-body textarea').focus();
  },
};
