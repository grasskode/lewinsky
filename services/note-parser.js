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
  });
  return note;
}

exports.consolidate = consolidate;
