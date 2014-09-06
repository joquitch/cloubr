var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("cloubr");
    db.collection('groups', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'groups' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});


exports.findByUsername = function(req, res) {
    console.log(req.params);
    var id = parseInt(req.params.id);
    console.log('findByUsername: ' + req.params.username);
    db.collection('groups', function(err, collection) {
        collection.find({
				$or: [
					{'owner': req.params.username},
					{'members': req.params.username}
				]
			}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};
 
var populateDB = function() {
 
    console.log("Populating group database...");
    var groups = [
        {"id": 1, "name": "Group #1", "owner": "sa", "members": ["kalle","musse"]},
        {"id": 2, "name": "Group #2", "owner": "sa", "members": ["långben","musse"]},
        {"id": 3, "name": "Group #3", "owner": "långben", "members": ["sa","musse"]},
        {"id": 4, "name": "Group #4", "owner": "musse", "members": ["långben","sa"]}
    ];
 
    db.collection('groups', function(err, collection) {
        collection.insert(groups, {safe:true}, function(err, result) {});
    });
 
};