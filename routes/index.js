/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};

exports.ehr = function(req, res) {
	res.render('ehr', {
		title : 'Dossier Médical'
	});
};

/*
 * app.post('/:model', routes.create); app.get('/:model', routes.list);
 * app.get('/:model/:id', routes.read); app.get('/:model/:id/_history/:vid',
 * routes.history); app.put('/:model/:id', routes.update);
 * app.del('/:model/:id', routes.del);
 */

exports.create = function(req, res) {
	var controller = require('/databases/controllers/' + req.params.model);
	controller.create(req, res);
};
exports.searchRead = function(req, res) {
	var controller = require('/databases/controllers/' + req.params.model);
	controller.list(req, res);
};
exports.read = function(req, res) {
	var controller = require('/databases/controllers/' + req.params.model);
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
	var controller = require('/databases/controllers/' + req.params.model);
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
	var controller = require('/databases/controllers/' + req.params.model);
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
	var controller = require('/databases/controllers/' + req.params.model);
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.update(req, res);
		}

	});
};
exports.searchUpdate = function(req, res) {
	var controller = require('/databases/controllers/' + req.params.model);
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
	var controller = require('/databases/controllers/' + req.params.model);
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.remove(req, res);
		}

	});
};
exports.searchDel = function(req, res) {
	var controller = require('/databases/controllers/' + req.params.model);
	controller.read(req, res, req.params.id, function(obj) {
		if (obj.constructor.name == "Error") {
			console.log("Got an error: " + obj);
			res.send(500);
		} else {
			controller.remove(req, res);
		}

	});
};