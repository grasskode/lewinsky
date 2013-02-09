function consolidate(entries) {
  var note = {};
  entries.forEach(function(entry) {
    if(!note[entry.note_id])
      note[entry.note_id] = {};
    
    note[entry.note_id]['note_id'] = entry.note_id;
    note[entry.note_id]['user'] = entry.user;
    note[entry.note_id]['subject'] = entry.subject;
    
    if(!note[entry.note_id]['creation_epoch'])
    	note[entry.note_id]['creation_epoch'] = {};
    
    note[entry.note_id]['creation_epoch'][entry.creation_epoch] = {};
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['body'] = entry.body;
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['cron'] = entry.exec_cron;
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['receipent_mail'] = entry.receipent_mail;
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['receipent_ph_num'] = entry.receipent_ph_num;
  });
  return note;
}

function tokenizer(text) {
  this.parsed = new Array();
  this.tokens = text.split(/\b\s+/);
  
  this.next = function() {
    this.parsed.push(this.tokens[0]);
    this.tokens.shift();
    return this.tokens[0];
  };

  this.remove = function() {
    this.tokens.shift();
    return this.tokens[0];
  };

  this.result = function(){
    return this.parsed.join(" ");
  }

}

function tokenList() {
  this.list = ["@date", "@repeat", "@to"];
  
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

function parse(text) {
  var parsed = {};
  var t = new tokenizer(text);
  var tl = new tokenList();
  var token = t.next();
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
}

exports.consolidate = consolidate;
exports.parse = parse;

console.log(parse("Hello @datehello @tohello @datehell o how low!"));
