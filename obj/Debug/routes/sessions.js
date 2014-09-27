var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;
	
var ObjectId = require('mongodb').ObjectId;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("cloubr");
    db.collection('sessions', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'sessions' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});


exports.findByUsername = function(req, res) {
    console.log(req.params);
    console.log('findByUsername: ' + req.params.username);
    db.collection('sessions', function(err, collection) {
        collection.find({
				$or: [
					{'owner': req.user.id},
					{'participants': req.user.id}
				]
			}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};

exports.create = function(req, res) {
    db.collection('sessions', function(err, collection) {
		console.log('user:');
		console.log(req.user);
		req.body.owner = req.user.id;
        collection.insert(req.body, function(err, result){
			console.log(err);
			console.log(result[0]);
			res.jsonp(result[0]);
		});
    });
};
 
var populateDB = function() {
 
    console.log("Populating session database...");
    var sessions = [
        {"name": "session #1", "owner": "sa", "participants": ["kalle","musse"]},
        {"name": "session #2", "owner": "sa", "participants": ["långben","musse"]},
        {"name": "session #3", "owner": "långben", "participants": ["sa","musse"]},
        {"name": "session #4", "owner": "musse", "participants": ["långben","sa"]}
    ];
 
    db.collection('sessions', function(err, collection) {
        collection.insert(sessions, {safe:true}, function(err, result) {});
    });
 
};