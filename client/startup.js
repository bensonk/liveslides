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
    this.navigate('shows/'+show_id+'/auth', {trigger: true, replace: true});
  },
  main: function (show_id) {
    Session.set("show_id", show_id);
  },
  shows: function() {
    Session.set('show_id', null);
    Session.set('current', null);
    Session.set('client_current', null);
    this.navigate('shows');
  },
  newShow: function() {
    Meteor.call('generateSecret', function(error, secretCode) {
      if(secretCode) {
        Meteor.call('newShow', secretCode, function(error, show_id) {
          Router.auth(show_id);
          Session.set('passcode', secretCode);
        });
      }
    })
  },
  setShow: function (show_id) {
    if(Session.get('auth_page')) return;
    this.navigate('shows/'+show_id, {trigger: true, replace: true});
  }
});

Router = new ShowsRouter;

Meteor.startup(function() {
  Backbone.history.start({pushState: true});
});

