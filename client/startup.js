////////// Tracking selected list in URL //////////

var ShowsRouter = Backbone.Router.extend({
  routes: {
    "": "shows",
    "shows": "shows",
    "shows/new": "newShow",
    "shows/:show_id": "main",
    "shows/:show_id/secret": "secret",
    "shows/:show_id/secret=:secret": "secret_url"
  },
  secret: function(show_id) {
    Session.set("show_id", show_id);
    Session.set('auth_page', true);
    this.navigate('shows/'+show_id+'/secret', {trigger: true, replace: true});
  },
  secret_url: function(show_id, secret) {
    Session.set("show_id", show_id);
    Session.set('auth_page', true);
    Session.set('passcode', secret);
    this.navigate('shows/'+show_id+'/secret='+secret, {trigger: true, replace: true});
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
  var that = this;
    Meteor.call('generateSecret', function(error, secretCode) {
      if(secretCode) {
        Meteor.call('newShow', secretCode, function(error, show_id) {
          //Router.secret(show_id);
          Session.set('passcode', secretCode);
          that.navigate('shows/'+show_id+'/secret='+secretCode, {trigger:false, replace: true});
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

