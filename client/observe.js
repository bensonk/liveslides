
Meteor.subscribe('shows');
Session.set('show_id', null);
Session.set('editingBody', false);

Meteor.autosubscribe(function() {
  var show_id = Session.get('show_id');
  if (show_id) {
    Router.setShow(Session.get('show_id'));
    Meteor.subscribe('slides', show_id, function() {
      var current = current_slide(); 
      if(current) {
        Session.set('current', current._id);
        Session.set('client_current', current._id);
      }

      var handler = Slides.find({}, {sort: {order: 1}}).observe({
        added: function(doc, before_idx) {
        },
        changed: function(new_doc, at_idx, old_doc) {
          if(new_doc.current) { Session.set('current', new_doc._id);}
        },
        moved: function(doc, old_idx, new_idx) {
        },
        removed: function(old_doc, at_idx) {
        }
      });
    })
  }
})
