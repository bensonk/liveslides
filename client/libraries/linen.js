// The following line is a function to encapsulate all our helper functions and
// keep us from polluting the namespace.
var linen = (function() {
  function lex(doc) {
    function handle_list(b) {
      function lex_list(list_text) {
        var items = list_text.split("\n");
        var list = [];
        for(var i in items) {
          var parts = /^(\*+|#+)(.*)/.exec(items[i]);
          if(parts) {
            types = { "*": "ul", "#": "ol" };
            var lexed = lex_attrs(parts[2]);
            list.push({
              type: types[parts[1][0]],
              indent: parts[1].length,
              content: lexed.content,
              attrs: lexed.attrs
            });
          }
        }
        return list;
      }

      var list = lex_list(b);

      return {
        type: list[0].type,
        extended: false,
        attrs: [],
        content: list
      };
    }

    function lex_table(block) {
      var lines = block.split("\n");
      var ret = [];
      var attrs;
      for(var i in lines) {
        var line = lines[i].replace(/^\|/, "").replace(/\|$/, "");
        var lexed_attrs = lex_attrs(line[0]);
        line[0] = lexed_attrs.content;
        // Hacky, but this is how the grammar seems to be designed
        // TODO: Figure out why this is causing the parser to hang
        if(i == 0) attrs = lexed_attrs.attrs;
        ret.push(line.split("|"));
      }

      return {
        type: 'table',
        extended: false,
        attrs: attrs,
        content: ret
      };
    }

    function lex_block(block) {
      var res = [];
      var blockType = "";

      // First, we look for a block descriptor.
      var i = 0, c = block[0];
      if(c == 'f' && block[i+1] == 'n') {
        // TODO: Implement footnotes properly
        // i.e. grab the footnote id number that follows.
        blockType = "fn";
        i++;
      }

      // Lists are pretty different, so we'll treat them completely differently here.
      if(c == '*' || c == '#') { 
        var attrs = lex_attrs(block.slice(1));
        if(/^\s+/.exec(attrs.content))
          return handle_list(block)
      }

      // Tables are also different, so they get their own function too.
      if(c == '|') { return lex_table(block) }

      // Blockquotes and Blocks of code
      if(c == 'b') { blockType = 'b' + block[++i] }

      // Headings
      if(c == "h") { blockType = 'h' + block[++i] }

      // ps and pres
      if(c == "p") {
        if(block.slice(i, i+3) == 'pre') {
          i += 2;
          blockType = "pre";
        }
        else {
          blockType = "p";
        }
      }

      i++;

      var obj = lex_attrs(block.slice(i, block.length));
      var match = /^(\.+ )/.exec(obj.content);

      function is_valid_blocktype(bt) {
        var blockTypes = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'bq', 'fn', 'p', 'bc', 'pre', 'table', 'ul', 'ol' ];
        for(var i in blockTypes) {
          if(blockTypes[i] == bt)
            return true;
        }
        return false;
      }

      if(match && is_valid_blocktype(blockType) ) {
        obj.type = blockType;
        obj.content = obj.content.replace(/^(\.+ )/, "");
        obj.extended = (match[1] == '.. ');
        obj.noBlock = false;
      }
      else {
        obj.type = "p";
        obj.content = block;
        obj.extended = false;
        obj.noBlock = true;
      }
      return obj;
    }

    var blocks = doc.split(/\n\n+/);
    var result = [];
    for(var i in blocks) {
      var lexed = lex_block(blocks[i]);
      if(lexed) result.push(lexed);
    }

    return result;
  }

  function lex_attrs(block) {
    var attrs = [];
    var starts_with_html_tag = block.match(/^<\S+[^<>]*>/) !== null;

    for(var i = 0; i < block.length; i++) {
      var c = block[i];

      // look for Alignment indicators
      if(c == '>') { attrs.push('>') }
      else if(c == '=') { attrs.push('=') }
      else if(c == '<' && !starts_with_html_tag) {
        // This is a special case, because the <> pair is considered an atom
        if(block[i+1] == '>') {
          i++;
          attrs.push('<>');
        }
        else {
          attrs.push('<');
        }
      }

      // Look for classes & ids
      else if(c == '(') {
        var start = i;
        while(block[i++] !== ')' && i < block.length) continue;
        attrs.push(block.slice(start, i--));
      }

      // Look for languages
      else if(c == '[') {
        var start = i;
        while(block[i++] !== ']' && i < block.length) continue;
        attrs.push(block.slice(start, i--));
      }

      // look for styles
      else if(c == '{') {
        var start = i;
        while(block[i++] !== '}' && i < block.length) continue;
        attrs.push(block.slice(start, i--));
      }

      // We've reached the end of what we can recognize, so we bail.
      else {
        break;
      }
    }

    return {
      attrs: attrs,
      content: block.slice(i, block.length)
    };
  }


  function escape_everything(text) {
    // TODO: Escape more things. 
    return text.replace(/</g, "&#60;")
               .replace(/>/g, "&#62;")
               .replace(/"/g, "&#34;");
  }

  function do_substitutions(text) {
    // This is a simple substitution based system.  It might be worth
    // considering implementing this with a real parser, but that does sound
    // like a great deal of work.  For the most part, we can fake it with
    // clever regex substitutions, but sometimes there's a danger of
    // substituting something that we ought to be leaving alone (like, for
    // example, a URL with underscores in it).

    function make_tag(tag, body, extras) {
      if(typeof extras == "undefined") extras = "";
      else extras = " " + extras;
      var lexed = lex_attrs(body);
      var attrs = parse_attrs(lexed.attrs);
      return "<" + tag + html_attrs({ attrs: attrs }) + extras + ">" + lexed.content + "</"+tag+">";
    }

    function make_link(content, url) {
      if(url[url.length - 1] == '.')
        return make_tag('a', content, 'href="' + url.slice(0, url.length -1) + '"') + ".";
      else
        return make_tag('a', content, 'href="' + url + '"');
    }

    function cleanup(body, count) {
      if(typeof count == 'undefined')
        count = 1;
      return body.slice(count, body.length - count);
    }

               // We do quotes first because they are problematic.
    return text.replace(/(\s)"(.*?)"([^:])/g, "$1&#8220;$2&#8221;$3")

               // Links
               .replace(/"([^"]+)":(http\S+)/g, function(_, content, url) {  return make_link(content, url) })

               // Images
               .replace(/!\b([^! \n]+)\b!:(http\S+)/g, function(_, content, url) {
                 return make_tag('a',
                   ' ' + make_tag('img', "", "src=\"" + content + "\""),
                   'href="' + url + '"')
               })
               .replace(/!([^! \n]+)!/g, function(content) { return make_tag('img', "", "src=\"" + cleanup(content) + "\"") })

               // Punctuation
               .replace(/--/g, "&#8212;")
               .replace(/\n/g, "<br/>")
               .replace(/(\b)'([^']*)'(\b)/g, '$1&#8216;$2&#8217;$3')
               .replace(/'/g, "&#8217;")
               .replace(/ - /g, " &#8211; ")
               .replace(/\.\.\./g, "&#8230;")
               .replace(/\(r\)/g, "&#174;")
               .replace(/\(tm\)/g, "&#8482;")
               .replace(/\(c\)/g, "&#169;")
               // TODO: dimension sign, if I can ever be bothered to care

               // Acronyms
               .replace(/([A-Z]{2,})\(([^)]+)\)/g, "<span class=\"caps\"><acronym title=\"$2\">$1</acronym></span>")
               .replace(/([A-Z]{2,})/g, function(content) { return make_tag("span", content + " ", "class=\"caps\"") })

               // Citations
               .replace(/\?{2}([^\?]+)\?{2}/g, function(content) { return make_tag("cite", cleanup(content)) })

               // Spans
               .replace(/%([^%]+)%/g, function(content) { return make_tag("span", cleanup(content)) })

               // Code
               .replace(/(@[^@]+@)/g, function(content) { return make_tag("code", cleanup(content)) })

               // Bolding
               .replace(/\*([^\*]+)\*/g, function(content) { return make_tag("strong", cleanup(content)) })
               .replace(/\*\*([^\*]+)\*\*/g, function(content) { return make_tag("b", cleanup(content)) })

               // Italics
               .replace(/\b_([^_]+)_\b/g, function(content) { return make_tag("em", cleanup(content)) })
               .replace(/\b__([^_]+)__\b/g, function(content) { return make_tag("i", cleanup(content)) })

               // Insertions & Deletions
               .replace(/\s\+([^\+]+)\+\s/g, function(content) { return ' ' + make_tag("ins", cleanup(content, 2)) + ' ' })
               .replace(/\s-([^-]+)-\s/g, function(content) { return ' ' + make_tag("del", cleanup(content, 2)) + ' ' })

               // Insertions & Deletions
               .replace(/\^([^\^]+)\^/g, function(content) { return make_tag("sup", cleanup(content)) })
               .replace(/~([^~]+)~/g, function(content) { return make_tag("sub", cleanup(content)) });
  }


  function parse(doc) {
    function parse_list(list) {
      var items = list.content;
      var prevIndent = 1;
      var ret = [];
      var current = ret;
      var stack = [];

      for(var i = 0; i < items.length; i++) {
        var it = items[i];
        it.content = do_substitutions(it.content);
        it.attrs = parse_attrs(it.attrs);

        // Increase nesting if needed
        if(it.indent > prevIndent) {
          for(var j = 0; j < it.indent - prevIndent; j++) {
            // Save current for later
            stack.push(current);
            var newList = [];
            current.push(newList);
            current = newList;
          }
        }

        // Decrease nesting if needed
        if(it.indent < prevIndent) {
          for(var j = 0; j < prevIndent - it.indent; j++)
            current = stack.pop();
        }

        current.push(it);
        prevIndent = it.indent;
      }

      return {
        type: list.type,
        content: ret,
        attrs: ret[0].attrs,
        classes: "",
        id: "",
        lang: "",
        style: "",
        alignment: ""
      };
    }

    function parse_table(block) {
      return {
        type: "table",
        attrs: parse_attrs(block.attrs),
        content: block.content,
        classes: "",
        id: "",
        lang: "",
        style: "",
        alignment: ""
      };
    }



    function parse_block(block) {
      var obj;

      // Some special stuff for lists
      if(block.type == "ol" || block.type == "ul")
        obj = parse_list(block);
      // Some special stuff for tables
      else if(block.type == "table")
        obj = parse_table(block);
      else if(block.type == "bc")
        obj = {
          type: block.type,
          content: escape_everything(block.content),
          attrs: parse_attrs(block.attrs)
        };
      // The general case
      else {
        obj = {
          type: block.type,
          content: do_substitutions(block.content),
          attrs: parse_attrs(block.attrs)
        };
      }

      return obj;
    }

    // TODO: Handle the "extended" attribute, which indicates extended blocks.

    var res = [];
    for(var i in doc)
      res.push(parse_block(doc[i]));
    return res;
  }

  function parse_attrs(attrs) {
    var ret = {
        classes: "",
        id: "",
        lang: "",
        style: "",
        alignment: ""
      };
    for(var i in attrs) {
      var atom = attrs[i];

      // Look for classes and/or an id
      if(atom[0] == '(') {
        // Remove parens and split on #, for a quick and dirty parse
        var parts = atom.replace(/^\(/, "").replace(/\)$/, "").split("#");

        // Add to classes
        if(ret.classes == "")
          ret.classes = parts[0];
        else
          ret.classes = ret.classes + " " + parts[0];

        // Set ID if it hasn't already been set
        if(parts.length > 1 && ret.id == "")
          ret.id = parts[1];
      }

      // Look for a language
      else if(atom[0] == '[') {
        ret.lang = atom.replace(/^\[/, "").replace(/\]$/, "");
      }

      // Look for a style
      else if(atom[0] == '{') {
        ret.style = atom.replace(/^\{/, "").replace(/\}$/, "");
      }

      // Look for alignment
      else {
        // Shortcut out if we already have an alignment set
        if(ret.alignment == "") {
          if(atom == '>') ret.alignment = "right";
          if(atom == '<') ret.alignment = "left";
          if(atom == '=') ret.alignment = "center";
          if(atom == '<>') ret.alignment = "justify";
        }
      }
    }
    return ret;
  }


  function html_attrs(obj) {
    var attrs = " ";
    var attrObj = obj.attrs;
    if(attrObj.classes)
      attrs += "class=\"" + attrObj.classes + "\" ";

    if(attrObj.id)
      attrs += "id=\"" + attrObj.id + "\" ";

    if(attrObj.align)
      attrObj.style = "text-align: " + attrObj.align + "; " + attrObj.style

    if(attrObj.style)
      attrs += "style=\"" + attrObj.style + "\" ";

    if(attrObj.lang)
      attrs += "lang=\"" + attrObj.lang + "\" ";

    return attrs.slice(0, attrs.length - 1);
  }


  function generate_code(blocks) {
    function generate_block(block) {


      // Generate different kinds of code blocks:
      function heading(b) {
        return "<" + b.type + html_attrs(b) + ">" +
                 b.content +
               "</" + b.type + ">";
      }
      function blockquote(b) {
        return "<blockquote" + html_attrs(b) + "><p>" +
                  b.content +
                "</p></blockquote>";
      }
      function footnote(b) {
        // TODO: Handle footnote numbers properly
        return "<p" + html_attrs(b) + "><sup>" + b.number + "</sup>" +
                  b.content +
                "</p>"
      }
      function paragraph(b) {
        return "<p" + html_attrs(b) + ">" +
                  b.content +
                "</p>";
      }
      function blockcode(b) {
        return "<pre " + html_attrs(b) + "><code>" +
                 b.content +
               "</code></pre>";
      }
      function preformatted(b) {
        return "<pre " + html_attrs(b) + ">" +
                 b.content +
               "</pre>";
      }
      function table(b) {
        var ret = "<table" + html_attrs(b) + ">";
        for(var i in b.content) {
          var line = b.content[i];
          ret += "<tr>";
          for(var j in line) {
            ret += "<td>" + line[j] + "</td>";
          }
          ret += "</tr>";
        }
        ret += "</table>";
        return ret;
      }

      function list(listObj) {
        function list_generator(items) {
          var ret = "<" + items[0].type + html_attrs(items[0]) + ">";

          for(var i in items) {
            var it = items[i];
            if(it.type) {
              ret += "<li>" + it.content;
              // Check for a sublist
              if(items[i+1] && items[i+1].type == undefined)
                ret += list_generator(items[++i]);
              ret += "</li>";
            }
            else {
              ret += list_generator(it);
            }
          }
          ret += "</" + (items[0].type) + ">";

          return ret;
        }

        return list_generator(listObj.content);
      }

      switch(block.type) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return heading(block);
        case "bq":
          return blockquote(block);
        case "fn":
          return footnote(block);
        case "p":
          return paragraph(block);
        case "bc":
          return blockcode(block);
        case "pre":
          return preformatted(block);
        case "table":
          return table(block);
        case "ul":
        case "ol":
          return list(block);
      }
    }

    ret = "";
    for(var i in blocks)
      ret += generate_block(blocks[i]) + "\n";
    return ret;
  }

  // And finally, we'll export this outside this crazy scope.
  return function(textile) { return generate_code(parse(lex(textile))) };
})();

// Export to let node.js and other CommonJS
// compatible frameworks see our code:
if(typeof exports != 'undefined') {
  exports.linen = linen;
  exports.textilize = linen;
}
