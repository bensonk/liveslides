Meteor.autosubscribe(function() {
  Meteor.subscribe( 'slides', function() {
    Session.set('current', slides.findOne()._id);
    Session.set('editingBody', false);
    set_current_slide(Session.get('current'));
    var handler = slides.find({}, {sort: {order: 1}}).observe({
      added: function(doc, before_idx) {
        console.log('added', doc);
      },
      changed: function(new_doc, at_idx, old_doc) {
        console.log('changed', new_doc);
        Meteor.flush();
        $("pre").addClass('prettyprint');
        prettyPrint();
      },
      moved: function(doc, old_idx, new_idx) {
        console.log('moved');
      },
      removed: function(old_doc, at_idx) {
        console.log('removed');
      }
    });
  })
})
