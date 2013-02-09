function consolidate(entries) {
  var note = {};
  entries.forEach(function(entry) {
    if(!note[entry.note_id])
      note[entry.note_id] = {};
    note[entry.note_id]['note_id'] = entry.note_id;
    note[entry.note_id]['user'] = entry.user;
    note[entry.note_id]['subject'] = entry.subject;
    if(!note[entry.note_id]['body'])
      note[entry.note_id]['body'] = {};
    note[entry.note_id]['body'][entry.creation_epoch] = entry.body;
  });
  return note;
}

function parse(subject, body) {


exports.consolidate = consolidate;
