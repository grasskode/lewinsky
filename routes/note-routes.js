var s_notes = require("../services/notes");

function respond(res, code, message) {
        res.status(code);
        res.set('Content-Type', 'text/plain');
        res.send(message);
}

module.exports = function(app) {
        app.get("/:userid/notes", function(req, res) {
                console.log("Getting notes for user "+req.params.userid);
                s_notes.get(req.params.userid, req.query.count, null, function(success, response){
                        if(success)
                          respond(res, 200, JSON.stringify(response));
                        else
                          respond(res, 500, JSON.stringify(response));
                });
        });

        app.get("/:userid/notes/:noteid", function(req, res) {
                console.log("Getting note "+req.params.noteid+" for user "+req.params.userid);
                s_notes.get(req.params.userid, req.params.noteid, function(success, response){
                        if(success)
                          respond(res, 200, JSON.stringify(response));
                        else 
                          respond(res, 500, JSON.stringify(response));
                });
        });

        app.post("/:userid/notes", function(req, res) {
                console.log("Posting note for user "+req.params.userid);
                console.log(req.body);
                s_notes.create(req.params.userid, req.body, function(success, response){
                        if(success)
                          respond(res, 200, JSON.stringify(response));
                        else
                          respond(res, 500, JSON.stringify(response));
                });
        });

        app["delete"]("/:userid/notes/:noteid", function(req, res) {
                console.log("Deleting note "+req.params.noteid+" for user "+req.params.userid);
                s_notes.remove(req.params.userid, req.params.noteid, function(success, response) {
                        if(success)
                          respond(res, 200, JSON.stringify(response));
                        else
                          respond(res, 500, JSON.stringify(response));
                });
        });
}
