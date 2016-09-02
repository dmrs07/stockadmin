var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'stock_test' });
client.connect(function(err, result){
	console.log('index: cassandra connected');
});

var getPriorities = 'SELECT * FROM stk_subinventory_priority WHERE brand = ? AND structure_id = ?';
var upsertPriorities = 'INSERT INTO stk_subinventory_priority (brand, id, structure_id, priority, subinventory_id, warehouse_id) VALUES (?,?,?,?,?,?)';
var deletePriorities = 'DELETE FROM stk_subinventory_priority WHERE brand = ? and structure_id = ? and id = ?';

var isEmpty = function(obj) {
  return !Object.keys(obj).length > 0;
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});


router.post('/data', function(req, res, next) {
	client.execute(getPriorities,[req.body.brand, req.body.structure], function(err, result){
		if(err){
			res.status(500).send({msg:err});
		}else{
			if(isEmpty(result.rows)){
				res.status(404).send({msg:err});
			}else{
				res.send(result.rows);
			}
			
		}
	});
});

router.post('/register', function(req, res, next){
	id = cassandra.types.uuid();
	client.execute(upsertPriorities,
		[
			req.body.brand, 
			id,
			req.body.structure,
			req.body.priority, 
			req.body.subinventory, 
			req.body.warehouse
		], { prepare : true },
		function(err, result){
		if(err){
			res.status(500).send({msg:err});
		}else{
			res.redirect('/');
			}	
		});
});

router.post('/remove', function(req, res, next){
	client.execute(deletePriorities,
		[
			req.body.brand, 
			req.body.structure, 
			req.body.id
		], 
		function(err, result){
		if(err){
			res.status(500).send({msg:err});
		}else{
			res.status(204).send({msg:result});
			}
		});
});

module.exports = router;
