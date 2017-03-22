/**
 * Created by Rakesh on 2/27/17.
 */
module.exports = function(app) {
    var multer = require('multer');
    var storage = multer.diskStorage({
       destination: function (req, file, cb) {
           cb(null, __dirname + "/../../public/uploads")
       },
        filename: function (req, file, cb) {
           var extArray = file.mimetype.split("/");
           var extension = extArray[extArray.length - 1];
           cb(null, "widget_image_" + Date.now() + "." + extension)
        }
    });
    var upload = multer({"storage": storage});

    app.get("/api/page/:pid/widget", findAllWidgetsForPage);
    app.get("/api/widget/:wgid", findWidgetById);
    app.post("/api/page/:pid/widget", createWidget);
    app.put("/api/widget/:wgid", updateWidget);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/page/:pid/widget", sortWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);


    var widgets = [
        {"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "The Verge"},
        {"_id": "123", "widgetType": "HEADER", "pageId": "432", "size": 2, "text": "The Verge"},
        {"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        {
            "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "https://i.ytimg.com/vi/fFi4BhD_DUw/maxresdefault.jpg"
        },
        {
            "_id": "456", "widgetType": "HTML", "pageId": "321",
            "text": "<p>Proin sem eros, feugiat et aliquet quis, luctus non tortor. " +
            "Nullam orci lorem, feugiat quis ante quis, volutpat viverra nisl. " +
            "Sed eu nunc ornare justo tempus gravida. " +
            "Proin ac urna nunc. Vivamus imperdiet luctus dui in commodo. " +
            "Fusce suscipit nulla lectus, sit amet imperdiet risus faucibus nec. " +
            "Maecenas blandit, massa vitae tincidunt efficitur, diam est suscipit felis, at feugiat ligula sapien non ex. " +
            "Quisque rutrum fringilla accumsan. " +
            "Etiam euismod eros a eros rutrum, et sagittis quam euismod. " +
            "Donec maximus interdum sem, quis egestas ex ultricies ut. " +
            "Cras consequat nisl sodales, scelerisque nibh eget, eleifend neque. " +
            "Interdum et malesuada fames ac ante ipsum primis in faucibus. " +
            "Suspendisse odio magna, auctor eu facilisis id, posuere eget mauris.</p>"
        },
        {"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        {
            "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/p6WkoK0zJJM"
        },
        {
            "_id": "789", "widgetType": "HTML", "pageId": "321",
            "text": "<p>Proin sem eros, feugiat et aliquet quis, luctus non tortor. " +
            "Nullam orci lorem, feugiat quis ante quis, volutpat viverra nisl. " +
            "Sed eu nunc ornare justo tempus gravida. " +
            "Proin ac urna nunc. Vivamus imperdiet luctus dui in commodo. " +
            "Fusce suscipit nulla lectus, sit amet imperdiet risus faucibus nec. " +
            "Maecenas blandit, massa vitae tincidunt efficitur, diam est suscipit felis, at feugiat ligula sapien non ex. " +
            "Quisque rutrum fringilla accumsan. " +
            "Etiam euismod eros a eros rutrum, et sagittis quam euismod. " +
            "Donec maximus interdum sem, quis egestas ex ultricies ut. " +
            "Cras consequat nisl sodales, scelerisque nibh eget, eleifend neque. " +
            "Interdum et malesuada fames ac ante ipsum primis in faucibus. " +
            "Suspendisse odio magna, auctor eu facilisis id, posuere eget mauris.</p>"
        }
    ];

    var widgetModel = require("../model/widget/widget.model.server");

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pid;
        widgetModel
            .findAllWidgetsForPage(pid)
            .then(function(widgets) {
                res.json(widgets);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }

    function findWidgetById(req, res) {
        var wgid = req.params.wgid;
        widgetModel
            .findWidgetById(wgid)
            .then(function(widget) {
                res.json(widget);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }

    function createWidget(req, res) {
        var newWidget = req.body;
        var pid = req.params.pid;
        widgetModel
            .createWidget(pid, newWidget)
            .then(function(createdWidget) {
                res.json(createdWidget);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }

    function updateWidget(req, res) {
        var wgid = req.params.wgid;
        var newWidget = req.body;
        widgetModel
            .updateWidget(wgid, newWidget)
            .then(function() {
                res.sendStatus(200);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }

    function deleteWidget(req, res) {
        var wgid = req.params.wgid;
        widgetModel
            .deleteWidget(wgid)
            .then(function() {
                res.sendStatus(200);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }

    function sortWidget(req, res) {
        var pid = req.params.pid;
        var index1 = parseInt(req.query.initial);
        var index2 = parseInt(req.query.final);

        widgetModel
            .sortWidget(index1, index2, pid)
            .then(function() {
                res.sendStatus(200);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }

    function uploadImage(req, res) {
        var pid = req.body.pid;
        var wgid = req.body.wgid;
        var width = req.body.width;
        var uid = req.body.uid;
        var wid = req.body.wid;

        if(req.file){
            var myFile = req.file;
            var destination = myFile.destination;

            widgetModel
                .findWidgetById(wgid)
                .then(function(widget) {
                    widget.width = width;
                    widget.url = req.protocol + '://' +req.get('host') + "/uploads/" + myFile.filename;
                    pid = widget._page;
                    widget.save();
                    res.redirect("/assignment/#/user/" + uid + "/website/" + wid + "/page/" + pid + "/widget/"+ wgid);
                }, function(err) {
                    res.sendStatus(500).send(err);
                });
        }


    }
};