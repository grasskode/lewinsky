var _ = require("underscore");

var tokenlist = ["@date", "@repeat", "@to", "@action", "@cancel"];

function parse(text) {
  var parsed = {};
  var t = new tokenizer(text);
  var token = t.head();
  while(token) {
      if(_.contains(tokenlist, token)) {
        var info = t.next();
        if(!parsed[token])
            parsed[token] = new Array();
        if(parsed[token].indexOf(info) < 0)
            parsed[token].push(info);
      } else {
          t.collect();
      }
      token = t.next();
  }
  parsed['@body'] = t.result();
  return parsed;
};

function tokenizer(text) {
  this.parsed = new Array();
  this.tokens = text.split(/\s+/);

  this.collect = function() {
      this.parsed.push(this.tokens[0]);
  }
  
  this.next = function() {
    this.tokens.shift();
    return this.tokens[0];
  };

  this.head = function() {
    return this.tokens[0];
  }

  this.result = function(){
    return this.parsed.join(" ");
  }

}

var getBody = function(note){
    var body = ''; 
    var entries = note['creation_epoch'];
    for (var key in entries) {
        if (entries.hasOwnProperty(key)) {
            var entry = entries[key];
            body += entry.body + "\n";
        }   
    }   
    return body;
};


exports.parse = parse;
exports.getBody = getBody;
