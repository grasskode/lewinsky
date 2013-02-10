function is_mail(element, index, array){
  return element.match(/^(\w|\.)*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
}

function is_ph_num(element, index, array) {
  return element.match(/^\+(\d)+$/);
}

//console.log(is_mail("iitr.sourabh@abc.com"));
//console.log(is_ph_num("+1231234567890"));
//console.log(is_ph_num("abc@abc.com"));
//console.log(is_mail("+1231234567890"));

function consolidate(entries) {
  var note = {};
  entries.forEach(function(entry) {
    if(!note[entry.note_id])
      note[entry.note_id] = {};
    
    note[entry.note_id]['note_id'] = entry.note_id;
    note[entry.note_id]['user'] = entry.user;
    note[entry.note_id]['subject'] = entry.subject;
    
    if(!note[entry.note_id]['receipent_mail'])
      note[entry.note_id]['receipent_mail'] = new Array();
    if(!note[entry.note_id]['receipent_ph_num'])
      note[entry.note_id]['receipent_ph_num'] = new Array();
    if(!note[entry.note_id]['actions'])
      note[entry.note_id]['actions'] = new Array();
   
    var split = entry.receipents.split(", ");
    for(var index in split) {
      var s = split[index];
      if(is_mail(s) && note[entry.note_id]['receipent_mail'].indexOf(s) < 0)
        note[entry.note_id]['receipent_mail'].push(s);
      if(is_ph_num(s) && note[entry.note_id]['receipent_ph_num'].indexOf(s) < 0)
        note[entry.note_id]['receipent_ph_num'].push(s);
    }
    
    var asplit = entry.actions.split(", ");
    for(var index in asplit) {
      var a = asplit[index];
      if(note[entry.note_id]['actions'].indexOf(a) < 0)
        note[entry.note_id]['actions'].push(a);
    }
    
    if(!note[entry.note_id]['creation_epoch'])
    	note[entry.note_id]['creation_epoch'] = {};
    
    note[entry.note_id]['creation_epoch'][entry.creation_epoch] = {};
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['body'] = entry.body;
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['cron'] = entry.exec_cron;
  });
  return note;
}

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
  this.list = ["@date", "@repeat", "@to", "@action"];
  
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
}

exports.consolidate = consolidate;
exports.parse = parse;

console.log(parse("@toiitr.sourabh@gmail.com"));
