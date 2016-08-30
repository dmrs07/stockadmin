var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'stock_test' });
client.connect(function(err, result){
	console.log('index: cassandra connected');
});

var getPriorities = 'SELECT * FROM stk_subinventory_priority WHERE brand = ? AND structure_id = ?';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});


router.post('/data', function(req, res, next) {
	console.log(req.body);
	client.execute(getPriorities,[req.body.brand, req.body.structure], function(err, result){
		if(err){
			res.status(404).send({msg:err});
		}else{
			res.send(result.rows);
		}
	});
});

module.exports = router;
