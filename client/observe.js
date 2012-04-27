
Meteor.subscribe('shows');
Session.set('show_id', null);
Session.set('editingBody', false);

Meteor.autosubscribe(function() {
  var show_id = Session.get('show_id');
  if (show_id) {
    Router.setShow(Session.get('show_id'));
    Meteor.subscribe('slides', show_id, function() {
      if(Slides.find({current: true}).count()===0) 
        Session.set('home', true);

      var handler = Slides.find({}, {sort: {order: 1}}).observe({
        added: function(doc, before_idx) {
        },
        changed: function(new_doc, at_idx, old_doc) {
          if(new_doc.current) {
            Session.set('home', false);
          }
          if(old_doc.current && !new_doc.current) {
            if(Session.equals('client_current', new_doc._id) || !Session.get('client_current')) {
              Session.set('client_current', null);
            }
          }
        },
        moved: function(doc, old_idx, new_idx) {
        },
        removed: function(old_doc, at_idx) {
          if(Slides.find({current: true}).count()===0)
            Session.set('home', true); 
        }
      });
    })
  }
})
