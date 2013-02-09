var s_notes = require("../services/notes");

function respond(res, code, message) {
        res.status(code);
        res.set('Content-Type', 'text/plain');
        res.send(message);
}

module.exports = function(app) {
        app.get("/:userid/notes", function(req, res) {
                console.log("Getting notes for user "+req.params.userid);
                s_notes.get(req.params.userid, req.query.count, null, function(err, data){
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });

        app.get("/:userid/notes/:noteid", function(req, res) {
                console.log("Getting note "+req.params.noteid+" for user "+req.params.userid);
                s_notes.get(req.params.userid, req.params.noteid, function(err, data){
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });

        app.post("/:userid/notes", function(req, res) {
                console.log("Posting note for user "+req.params.userid);
                console.log(req.body);
                s_notes.create(req.params.userid, req.body, function(err, data){
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });

        app.delete("/:userid/notes/:noteid", function(req, res) {
                console.log("Deleting note "+req.params.noteid+" for user "+req.params.userid);
                s_notes.remove(req.params.userid, req.params.noteid, function(err, data) {
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });
}
