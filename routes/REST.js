
var controller = require('../databases/controllers/RESTController');


//-----------------------------------------------------------------------------
//----------------------------- FUNCTIONS -------------------------------------
//-----------------------------------------------------------------------------

function findModel(name){
	var model = name.toLowerCase();
	model.charAt(0).toUpperCase();
	
	switch(model) {
    case 'Bodysite':
        'BodySite'
        break;
    case 'Diagnosticreport':
        'DiagnosticReport'
        break;
    case 'Medicationorder':
        'MedicationOrder'
        break;
    case 'Resourcehistory':
        'ResourceHistory'
        break;
    default:
        model
	} 
}

//-----------------------------------------------------------------------------
// ------------------------------ ROUTES --------------------------------------
//-----------------------------------------------------------------------------

/*
 * app.post('/:model', routes.create); app.get('/:model', routes.list);
 * app.get('/:model/:id', routes.read); app.get('/:model/:id/_history/:vid',
 * routes.history); app.put('/:model/:id', routes.update);
 * app.del('/:model/:id', routes.del);
 */

exports.create = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.create(req, res);
};

exports.search = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.list(req, res);
};

exports.read = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.show(req, res);
		}

	});
};

exports.vread = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.read(req, res, req.params.id, req.params.vid, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.show(req, res);
		}

	});
};

exports.history = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.history(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.show(req, res);
		}

	});
};

exports.update = function(req, res) {
	req.params.model = findModel(req.params.model);	
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.update(req, res);
		}

	});
};

exports.del = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.remove(req, res);
		}

	});
};





