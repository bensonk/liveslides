////////// Tracking selected list in URL //////////

var ShowsRouter = Backbone.Router.extend({
  routes: {
    "": "shows",
    "shows": "shows",
    "shows/new": "newShow",
    "shows/:show_id": "main",
    "shows/:show_id/auth": "auth"
  },
  auth: function(show_id) {
    Session.set("show_id", show_id);
    Session.set('auth_page', true);
    console.log('auth', 'shows/'+show_id+'/auth');
    this.navigate('shows/'+show_id+'/auth');
  },
  main: function (show_id) {
    Session.set("show_id", show_id);
  },
  shows: function() {
    Session.set('show_id', null);
    Session.set('current', null);
    this.navigate('shows');
  },
  newShow: function() {
    Meteor.call('generateSecret', function(error, secretCode) {
      if(secretCode) {
        var show_id = Shows.insert({title: 'something awesome', summary: 'nothing supplied as of yet', created_at: Date.now(), secret: secretCode});
        Router.auth(show_id);
        set_admin(secretCode);
      }
    })
  },
  setShow: function (show_id) {
    if(Session.get('auth_page')) return;
    this.navigate('shows/'+show_id);
  }
});

Router = new ShowsRouter;

Meteor.startup(function() {
  Backbone.history.start({pushState: true});
});

