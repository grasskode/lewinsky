function parse(text) {
  var parsed = {};
  var t = new tokenizer(text);
  var tl = new tokenList();
  var token = t.head();
  while(token) {
    var info = tl.extract(token);
    if(info) {
      if(!parsed[info['token']])
        parsed[info['token']] = new Array();
      if(parsed[info['token']].indexOf(info['info']) < 0)
        parsed[info['token']].push(info['info']);
      token = t.remove();
    } else {
      token = t.next();
    }
  }
  parsed['@body'] = t.result();
  return parsed;
};

function tokenizer(text) {
  this.parsed = new Array();
  this.tokens = text.split(/\s+/);
  
  this.next = function() {
    this.parsed.push(this.tokens[0]);
    this.tokens.shift();
    return this.tokens[0];
  };

  this.head = function() {
    return this.tokens[0];
  }

  this.remove = function() {
    this.tokens.shift();
    return this.tokens[0];
  };

  this.result = function(){
    return this.parsed.join(" ");
  }

}

function tokenList() {
  this.list = ["@date", "@repeat", "@to", "@action", "@cancel"];
  
  this.extract = function(token) {
    for(var index in this.list ) {
      var entry = this.list[index];
      if(token.indexOf(entry) == 0){
        var info = {};
        info['token'] = entry;
        info['info'] = token.substr(entry.length);
        return info;
      }
    }
  };

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
