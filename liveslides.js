var slides = new Meteor.Collection("slides");

function set_current_slide(id) {
  slides.update({}, { $set: { current: false } }, { multi: true });
  slides.update({ _id: id }, { $set: { current: true } });
}

function current_slide() {
  return slides.findOne({ current: true });
}

function add_slide() {
  set_current_slide(slides.insert({ title: "New Slide", body: "Edit me!" }));
}


if (Meteor.is_client) {
  //
  // Template Helpers
  //
  Template.slide_list.slides = function () {
    return slides.find();
  };

  Template.slide_list.is_current = function() {
    return this.current ? " current" : "";
  };

  Template.current_slide.slide = function() {
    var slide = current_slide();
    if(slide) slide.html_body = linen(slide.body);
    return slide || false;
  };

  //
  // Event handlers
  //
  function save_slide() {
    var new_values = {
      title: $('#title-box').attr('value'),
      body:  $('#body-box').attr('value')
    };
    slides.update({ _id: current_slide()._id }, { $set: new_values } );
  }
  function start_editing() {
    $('#main-slide').replaceWith(Template.edit_slide(current_slide()));
    $('#title-box, #body-box').blur(save_slide);
  }

  Template.slide_list.events = {
    'click #index ul li': function(e) { set_current_slide(e.currentTarget.id); },
    'click #new-slide': add_slide
  };
  Template.current_slide.events = {
    'click #slide-title': function(e) {
      start_editing();
      $("#title-box").focus();
    },
    'click #slide-body': function(e) {
      start_editing();
      $("#body-box").focus();
    },
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    if(!current_slide()) {
      // Set first slide to be current
      slides.update({}, { $set: { current: true } });
    }
  });
}
