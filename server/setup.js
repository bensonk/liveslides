// Show - {title: String,
//         body: String,
//         created_at: Integer}
Meteor.publish('shows', function() {
  return Shows.find({}, {fields: {secret: false}});
});

//Slide -- {title: String,
//          order: Integer,
//          show_id: String,
//          created_at: Integer,
//          updated_at: Integer}
Meteor.publish('slides', function(show_id) {
  return Slides.find({show_id: show_id});
});

var server_password = 'supersecret';
Meteor.methods({
  update: function(selector, updates, multi, passcode) {
    var show = Shows.findOne(selector.show_id);
    if(show && passcode && (passcode === show.secret)) {
      return Slides.update(selector, updates, multi);
    }
  },
  insert: function(attributes, passcode) {
    var secret = Shows.findOne(attributes.show_id).secret;
    if(passcode && passcode === secret) {
      return Slides.insert(attributes);
    }
  },
  remove: function(selector, passcode) {
    var secret = Shows.findOne(selector.show_id).secret;
    if(passcode && passcode === secret) {
      return Slides.remove(selector);
    }
  },
  // -- Methods for Slideshows -- //
  updateShow: function(show_id, updates, passcode) {
    var show = Shows.findOne(show_id);
    if(show && passcode && (passcode === show.secret)) {
      Shows.update({_id: show_id}, updates);
    }
  },
  newShow: function(code) {
    var show_id = Shows.insert({title: code, body: 'nothing supplied as of yet', created_at: Date.now(), secret: code});
    return show_id;
  },
  removeShow: function(show_id, passcode) {
    var secret = Shows.findOne(show_id).secret;
    if(passcode && passcode === secret) {
      Shows.remove({_id: show_id});
      Slides.remove({show_id: show_id});
    }
  },

  confirmSecret: function(show_id, client_secret) {
    var show = Shows.findOne(show_id);
    if(show && show.secret === client_secret) {
      return true;
    } else {
      return false;
    }
  },
  generateSecret: function() {
    var a = animals[Math.floor(Math.random()*num_animals)];
    var c = colors[Math.floor(Math.random()*num_colors)];
    return c+'-'+a;
  }
});
Meteor.startup(function() {
  Meteor.default_server.method_handlers['/slides/insert'] = function () {};
  Meteor.default_server.method_handlers['/slides/update'] = function () {};
  Meteor.default_server.method_handlers['/slides/remove'] = function () {};
  Meteor.default_server.method_handlers['/shows/insert'] = function () {};
  Meteor.default_server.method_handlers['/shows/update'] = function () {};
  Meteor.default_server.method_handlers['/shows/remove'] = function () {};
});
var animals = ['Aardvark', 'Albatross', 'Alligator', 'Alpaca', 'American-Bison', 'Ant', 'Anteater', 'Antelope', 'Ape', 'Armadillo',
'Donkey', 'Baboon', 'Badger', 'Barracuda', 'Bat', 'Bear', 'Beaver', 'Bee', 'Bison', 'Boar',
'African-Buffalo', 'Bush-baby', 'Butterfly', 'Camel', 'Caribou', 'Cat', 'Caterpillar', 'Cattle', 'Chamois', 'Cheetah',
'Chicken', 'Chimpanzee', 'Chinchilla', 'Clam', 'Cobra', 'Cockroach', 'Cod', 'Cormorant', 'Coyote', 'Crab',
'Crane', 'Crocodile', 'Crow', 'Deer', 'Dinosaur', 'Dog', 'Squaliformes', 'Dolphin', 'Donkey', 'Dove',
'Dragonfly', 'Duck', 'Dugong', 'Eagle', 'Echidna', 'Eel', 'Taurotragus', 'Elephant', 'Elephant-seal', 'Elk',
'Emu', 'Falcon', 'Ferret', 'Finch', 'Fish', 'Fly', 'Fox', 'Frog', 'Gaur', 'Gazelle',
'Gerbil', 'Giant-Panda', 'Giraffe', 'Gnat', 'Wildebeest', 'Goat', 'Goose', 'Gopher_(animal)', 'Gorilla', 'Grasshopper',
'Grouse', 'Guanaco', 'Guinea-fowl', 'Guinea-pig', 'Gull', 'Hamster', 'Hare', 'Hawk', 'Hedgehog', 'Heron',
'Hippopotamus', 'Hornet', 'Horse', 'Human', 'Hummingbird', 'Hyena', 'Iguana', 'Jackal', 'Jaguar', 'Blue-Jay',
'Jellyfish', 'Kangaroo', 'Koala', 'Komodo-dragon', 'Kouprey', 'Kudu', 'Lark', 'Lemur', 'Leopard', 'Lion',
'Llama', 'Lobster', 'Locust', 'Loris', 'Louse', 'Lyrebird', 'Magpie', 'Mallard', 'Manatee', 'Meerkat',
'Mink', 'Mole', 'Monkey', 'Moose', 'Mouse', 'Mosquito', 'Mule', 'Narwhal', 'Newt', 'Nightingale',
'Okapi', 'Opossum', 'Oryx', 'Ostrich', 'Otter', 'Owl', 'Ox', 'Oyster', 'Panda', 'Black-panther',
'Parrot', 'Partridge', 'Peafowl', 'Pelican', 'Penguin', 'Pig', 'Pigeon', 'Platypus', 'Pony', 'Porcupine',
'Porpoise', 'Prairie-Dog', 'Quelea', 'Rabbit', 'Raccoon', 'Rallidae', 'Ram', 'Rat', 'Raven', 'Red-deer',
'Red-panda', 'Reindeer', 'Rhinoceros', 'Rook', 'Salamander', 'Sand-Dollar', 'Sea-lion', 'Sea-Urchin', 'Seahorse', 'Seal',
'Seastar', 'Serval', 'Shark', 'Sheep', 'Shrew', 'Skunk', 'Snail', 'Snake', 'Spider', 'Squid',
'Squirrel', 'Stinkbug', 'Swallow', 'Swan', 'Tapir', 'Tarsier', 'Termite', 'Tiger', 'Toad', 'Trout',
'Turkey', 'Turtle', 'Vicuña', 'Wallaby', 'Walrus', 'Wasp', 'Water-buffalo', 'Weasel', 'Whale', 'Wolf',
'Wombat', 'Woodpecker', 'Worm', 'Wren', 'Yak', 'Zebra'];
var colors = ['IndianRed', 'LightCoral', 'Salmon', 'DarkSalmon', 'LightSalmon', 'Red', 'Crimson', 'FireBrick', 'DarkRed', 'Pink',
'LightPink', 'HotPink', 'DeepPink', 'MediumVioletRed', 'PaleVioletRed', 'Coral', 'Tomato', 'OrangeRed', 'DarkOrange', 'Orange',
'Gold', 'Yellow', 'LightYellow', 'LemonChiffon', 'LightGoldenrodYellow', 'PapayaWhip', 'Moccasin', 'PeachPuff', 'PaleGoldenrod', 'Khaki',
'DarkKhaki', 'Lavender', 'Thistle', 'Plum', 'Violet', 'Orchid', 'Fuchsia', 'Magenta', 'MediumOrchid', 'MediumPurple',
'BlueViolet', 'DarkViolet', 'DarkOrchid', 'DarkMagenta', 'Purple', 'Indigo', 'DarkSlateBlue', 'SlateBlue', 'MediumSlateBlue', 'GreenYellow',
'Chartreuse', 'LawnGreen', 'Lime', 'LimeGreen', 'PaleGreen', 'LightGreen', 'MediumSpringGreen', 'SpringGreen', 'MediumSeaGreen', 'SeaGreen',
'ForestGreen', 'Green', 'DarkGreen', 'YellowGreen', 'OliveDrab', 'Olive', 'DarkOliveGreen', 'MediumAquamarine', 'DarkSeaGreen', 'LightSeaGreen',
'DarkCyan', 'Teal', 'Aqua', 'Cyan', 'LightCyan', 'PaleTurquoise', 'Aquamarine', 'Turquoise', 'MediumTurquoise', 'DarkTurquoise',
'CadetBlue', 'SteelBlue', 'LightSteelBlue', 'PowderBlue', 'LightBlue', 'SkyBlue', 'LightSkyBlue', 'DeepSkyBlue', 'DodgerBlue', 'CornflowerBlue',
'RoyalBlue', 'Blue', 'MediumBlue', 'DarkBlue', 'Navy', 'MidnightBlue', 'Cornsilk', 'BlanchedAlmond', 'Bisque', 'NavajoWhite',
'Wheat', 'BurlyWood', 'Tan', 'RosyBrown', 'SandyBrown', 'Goldenrod', 'DarkGoldenrod', 'Peru', 'Chocolate', 'SaddleBrown',
'Sienna', 'Brown', 'Maroon', 'White', 'Snow', 'Honeydew', 'MintCream', 'Azure', 'AliceBlue', 'GhostWhite',
'WhiteSmoke', 'Seashell', 'Beige', 'OldLace', 'FloralWhite', 'Ivory', 'AntiqueWhite', 'Linen', 'LavenderBlush', 'MistyRose',
'Gainsboro', 'LightGrey', 'Silver', 'DarkGray', 'Gray', 'DimGray', 'LightSlateGray', 'SlateGray', 'DarkSlateGray', 'Black']
var num_animals = animals.length;
var num_colors = colors.length;
