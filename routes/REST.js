var controller = require('../databases/controllers/RESTController');

// -----------------------------------------------------------------------------
// ----------------------------- FUNCTIONS -------------------------------------
// -----------------------------------------------------------------------------

function findModel(name) {
	var model = name.toLowerCase();
	model = model.charAt(0).toUpperCase() + model.slice(1);

	switch (model) {
	case 'Bodysite':
		return 'BodySite';
		break;
	case 'Diagnosticreport':
		return 'DiagnosticReport';
		break;
	case 'Medicationorder':
		return 'MedicationOrder';
		break;
	case 'Resourcehistory':
		return 'ResourceHistory';
		break;
	default:
		return model;
		break;
	}
}

// -----------------------------------------------------------------------------
// ------------------------------ ROUTES --------------------------------------
// -----------------------------------------------------------------------------

/*
 * app.post('/:model', routes.create); app.get('/:model', routes.list);
 * app.get('/:model/:id', routes.read); app.get('/:model/:id/_history/:vid',
 * routes.history); app.put('/:model/:id', routes.update);
 * app.del('/:model/:id', routes.del);
 */

exports.create = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.create(req, res, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			var response = {
					resourceType : "OperationOutcome",
					text : {
						status : "generated",
						div : "<div>Error : " + obj + "</div>"
					},
				};
			res.status(500).send(response);
		} else {
			var response = {
					resourceType : "OperationOutcome",
					text : {
						status : "generated",
						div : "<div>The operation was successful.</div>"
					}
				};
			res.contentType('application/fhir+json');
			res.location(obj);
			res.status(201).send(JSON.stringify(response));
		}
	});
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
	controller.vread(req, res, req.params.id, req.params.vid, function(obj) {
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
	controller.history(req, res, req.params.id);
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
