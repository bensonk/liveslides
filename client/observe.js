
Meteor.autosubscribe(function() {
  Meteor.subscribe( 'slides', function() {
    Session.set('current', current_slide()._id);
    Session.set('editingBody', false);
    var handler = slides.find({}, {sort: {order: 1}}).observe({
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
})
