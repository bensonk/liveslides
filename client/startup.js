////////// Tracking selected list in URL //////////

var ShowsRouter = Backbone.Router.extend({
  routes: {
    "": "shows",
    "shows": "shows",
    "shows/new": "newShow",
    "shows/:show_id": "main"
  },
  main: function (show_id) {
    Session.set("show_id", show_id);
  },
  shows: function() {
            Session.set('show_id', null);
            Session.set('current', null);
            Session.set('hovered', null);
            $('html, body').css({height: '', width: '', overflow: ''});
            this.navigate('shows', {trigger: false});
          },
  newShow: function() {
    var secretCode = Math.floor(Math.random()*1000);
    var show = Shows.insert({title: 'something awesome', summary: 'nothing supplied as of yet', created_at: Date.now(), secret: secretCode});
    Router.setShow(show);
    Session.set('passcode', secretCode);
  },
  setShow: function (show_id) {
    this.navigate('shows/'+show_id, true);
  }
});

Router = new ShowsRouter;

Meteor.startup(function() {
  Backbone.history.start({pushState: true});
});

