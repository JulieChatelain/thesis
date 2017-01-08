var controller = require('../databases/controllers/RESTController');
var auth = require('./AuthManager');

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
	case 'Diagnosticorder':
		return 'DiagnosticOrder';
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
	if(req.params.model){
		req.params.model = findModel(req.params.model);
	}else{
		req.params.model = 'Patient';
	}
	controller.create(req, res, function(id, resource) {
		if (resource.constructor.name.includes("Error")) {
			console.log("Create error : " + id);
			var response = {
					id : "",
					success : false,
					message: "Error : " + id,
					resourceType : "OperationOutcome",
					text : {
						status : "generated",
						div : "<div>Error : " + id + "</div>" 
					},
				};
			res.status(500).send(response);
		} else {	
			if(req.params.model == 'Patient'){
				auth.addAccess(req, res, id, function(success, message){
					if(success){
						var response = {
								id : id,
								success: true,
								message: "The operation was successful.",
								resourceType : "OperationOutcome",
								text : {
									status : "generated",
									div : "<div>The operation was successful.</div>"
								}
							};
						res.contentType('application/fhir+json');
						res.location(id);
						res.status(201).send(JSON.stringify(response));	
					}else{
						var response = {
								id : "",
								success : false,
								message: "Error : " + message,
								resourceType : "OperationOutcome",
								text : {
									status : "generated",
									div : "<div>Error : " + message + "</div>"
								},
							};
						res.status(500).send(response);
					}
				});
			}else{
				var response = {
						id : id,
						success: true,
						message: "The operation was successful.",
						resourceType : "OperationOutcome",
						text : {
							status : "generated",
							div : "<div>The operation was successful.</div>"
						}
					};
				res.contentType('application/fhir+json');
				res.location(id);
				res.status(201).send(JSON.stringify(response));			
			}
		}
	});
};

exports.search = function(req, res) {
	req.params.model = findModel(req.params.model);
	var accessRequest = false;
	controller.list(accessRequest,req, res, function(result, err){
		if(err){
			console.log("Search error : " + err);
			var response = {
					success: false,
					message: "Error : " + err,
					resourceType : "OperationOutcome",
					text : {
						status : "generated",
						div : "<div>Error : " + err + "</div>"
					},
				};
			res.status(500).send(response);
		}else{
			res.contentType('application/fhir+json');
			res.status(200);
			res.send(JSON.stringify(result));
		}
	});
};

exports.read = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name.includes("Error")) {
			console.log("Read error: " + obj);
			res.sendStatus(500);
		} else {
			var pId = 'Patient/' + req.params.pId;
			if(obj.patient && obj.patient.reference != pId){
				console.log("Read error: not authorized");
				res.sendStatus(403);
			}else if(obj.subject && obj.subject.reference != pId){
				console.log("Read error: not authorized");
				res.sendStatus(403);				
			}else{
				controller.show(req, res);
			}
		}
	});
};

exports.vread = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.vread(req, res, req.params.id, req.params.vid, function(obj) {
		if (obj.constructor.name.includes("Error")) {
			console.log("Vread error : " + obj);
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
	controller.find(req, res, req.params.id, function(obj) {
		if (obj.constructor.name.includes("Error")) {
			console.log("Update error : " + obj);
			var response = {
					id : "",
					success : false,
					message: "Error : " + obj,
					resourceType : "OperationOutcome",
					text : {
						status : "generated",
						div : "<div>Error : " + obj + "</div>"
					},
				};
			res.status(500).send(response);
		} else {
			controller.update(req, res,function(response, status){
				res.status(status).send(response);
			});
		}
	});
};

exports.del = function(req, res) {
	req.params.model = findModel(req.params.model);
	controller.find(req, res, req.params.id, function(obj) {
		if (obj.constructor.name.includes("Error")) {
			console.log("Delete error : " + obj);
			res.send(500);
		} else {
			controller.remove(req, res);
		}
	});
};
