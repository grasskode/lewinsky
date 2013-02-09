var s_users = require("../services/users");

function respond(res, code, message) {
        res.status(code);
        res.set('Content-Type', 'text/plain');
        res.send(message);
}

module.exports = function(app) {
        app.get("/users", function(req, res) {
                console.log("Getting user "+req.query.email);
                s_users.get(req.query.email, null, function(err, data){
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });

        app.post("/users", function(req, res) {
                console.log("Creating user.");
                console.log(req.body);
                s_notes.create(req.body, function(err, data){
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });

        app.delete("/users/:userid", function(req, res) {
                console.log("Deleting user "+req.params.userid);
                s_notes.remove(req.params.userid, function(err, data) {
                        if(err)
                          respond(res, 500, JSON.stringify(err));
                        else
                          respond(res, 200, JSON.stringify(data));
                });
        });
}
