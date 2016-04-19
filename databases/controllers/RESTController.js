// Copyright (c) 2011-2013, HL7, Inc & Mitre
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, 
// are permitted provided that the following conditions are met:
// 
//  * Redistributions of source code must retain the above copyright notice, this 
//    list of conditions and the following disclaimer.
//  * Redistributions in binary form must reproduce the above copyright notice, 
//    this list of conditions and the following disclaimer in the documentation 
//    and/or other materials provided with the distribution.
//  * Neither the name of HL7 nor the names of its contributors may be used to 
//    endorse or promote products derived from this software without specific 
//    prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
// IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
// POSSIBILITY OF SUCH DAMAGE.

var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var async = require('async');
var ResourceHistory = mongoose.model('ResourceHistory');
// var ResponseFormatHelper = require(__dirname +
// '/../../lib/response_format_helper');

/**
 * Generate a small summary text of the resource
 */
var generateText = function(resource) {
	var humanReadable = "<p>" + "<strong>" + resource.resourceType
			+ "</strong><br>" + "<strong>url : </strong>" + resource.id
			+ "<br>";
	if ('name' in resource && typeof resource.name.given[0] !== 'undefined'
			&& typeof resource.name.family[0] !== 'undefined') {
		humanReadable = humanReadable + "<strong>Name : </strong> "
				+ resource.name.given[0] + " " + resource.name.family[0]
				+ "<br>"
	}
	if ('code' in resource && typeof resource.code.coding[0] !== 'undefined') {
		humanReadable = humanReadable + "<strong>"
				+ resource.code.coding[0].display + "</strong><br>"
	}
	if ('patient' in resource
			&& typeof resource.patient.display !== 'undefined') {
		humanReadable = humanReadable + "<strong>Concerns : </strong>"
				+ resource.patient.display + "<br>";
	}
	if ('subject' in resource
			&& typeof resource.subject.display !== 'undefined') {
		humanReadable = humanReadable + "<strong>Concerns : </strong>"
				+ resource.subject.display + "<br>";
	}
	if ('conclusion' in resource && typeof resource.conclusion !== 'undefined') {
		humanReadable = humanReadable + "<strong>Conclusion : </strong>"
				+ resource.conclusion + "<br>";
	}
	humanReadable = humanReadable + "</p>";
	return humanReadable;
}

/**
 * Put the resource in jason format and send it.
 */
exports.show = function(req, res) {
	var resource = req.resource;
	var humanReadable = generateText(resource);
	resource.text = {
		status : "generated",
		div : humanReadable
	};
	var json = JSON.stringify(resource, null, 2);
	res.contentType('application/fhir+json');
	res.location(resource.id);
	res.status(200);
	res.send(json);
};

/**
 * Return the latest version of a resource.
 */
exports.read = function(req, res, id, next) {
	ResourceHistory.findById(id, function(rhErr, resourceHistory) {
		if (rhErr) {
			next(rhErr);
		}
		if (resourceHistory !== null) {
			req.resourceHistory = resourceHistory;
			var vid = resourceHistory.versionCount();
			req.resourceHistory.findLatest(function(err, resource) {

				resource = JSON.parse(JSON.stringify(resource));
				resource.resourceType = resourceHistory.resourceType;
				resource.id = resourceHistory.resourceType + "/" + id;
				resource.meta = {
					versionId : resourceHistory.versionCount(),
					created : resourceHistory._id.getTimestamp(),
					lastUpdated : resourceHistory.history[vid - 1].resourceId
							.getTimestamp(),
					createdBy : resourceHistory.createdBy,
					updatedBy : resourceHistory.history[vid - 1].updatedBy
				};
				req.resource = resource;
				next(resource);
			});
		}
	});
};

/**
 * Return a particular version of a resource.
 */
exports.vread = function(req, res, id, vid, next) {
	ResourceHistory.findById(id, function(rhErr, resourceHistory) {
		if (rhErr) {
			next(rhErr);
		}
		if (resourceHistory !== null) {
			req.resourceHistory = resourceHistory;
			req.resourceHistory.getVersion(vid, function(err, resource) {
				resource = JSON.parse(JSON.stringify(resource));
				resource.resourceType = resourceHistory.resourceType;
				resource.id = resourceHistory.resourceType + "/" + id
						+ "/_history/" + vid;
				resource.meta = {
					versionId : vid,
					created : resourceHistory._id.getTimestamp(),
					lastUpdated : resourceHistory.history[vid - 1].resourceId
							.getTimestamp(),
					createdBy : resourceHistory.createdBy,
					updatedBy : resourceHistory.history[vid - 1].updatedBy
				};
				req.resource = resource;
				next(resource);
			});
		}
	});
};

/**
 * Return all the versions off the resource in an array.
 */
exports.history = function(req, res, id, next) {
	// Find the history
	ResourceHistory.findById(id, function(rhErr, resourceHistory) {
		if (rhErr) {
			res.send(500);
		}
		var history = [];
		if (resourceHistory !== null) {
			var i = 1;
			// Get each version
			async.forEach(resourceHistory.history, function(hist, callback) {
				resourceHistory.getVersion(i, function(err, resource) {
					resource = JSON.parse(JSON.stringify(resource));
					resource.resourceType = resourceHistory.resourceType;
					resource.id = resourceHistory.resourceType + "/" + id
							+ "/_history/" + i;
					var humanReadable = generateText(resource);
					resource.text = {
						status : "generated",
						div : humanReadable
					};
					resource.meta = {
						versionId : i,
						created : resourceHistory._id.getTimestamp(),
						lastUpdated : hist.resourceId.getTimestamp(),
						createdBy : resourceHistory.createdBy,
						updatedBy : hist.updatedBy
					};
					history.push(resource);
					i++;
					callback();
				});
			}, function(err) {
				res.contentType('application/fhir+json');
				res.location(id);
				res.status(200);
				res.send(JSON.stringify(history, null, ' '));
			});
		} else {
			res.contentType('application/fhir+json');
			res.location(id);
			res.status(200);
			res.send(JSON.stringify(history, null, ' '));
		}
	});
};

/**
 * Create a resource.
 */
exports.create = function(req, res) {

	var modelName = req.params.model;

	var model = mongoose.model(modelName);
	var resource = new model(req.body);

	delete resource._id;

	resource.save(function(err, savedresource) {
		if (err) {
			var response = {
				resourceType : "OperationOutcome",
				text : {
					status : "generated",
					div : "<div>Error : " + err + "</div>"
				},
			};
			res.status(500).send(response);
		} else {
			var resourceHistory = new ResourceHistory({
				resourceType : modelName
			});
			resourceHistory.addVersion(savedresource.id, "");
			resourceHistory.save(function(rhErr, savedResourceHistory) {
				if (rhErr) {
					var response = {
						resourceType : "OperationOutcome",
						text : {
							status : "generated",
							div : "<div>Error : " + rhErr + "</div>"
						},
					};
					res.status(500).send();
				} else {
					var response = {
						resourceType : "OperationOutcome",
						text : {
							status : "generated",
							div : "<div>The operation was successful.</div>"
						}
					};
					res.contentType('application/fhir+json');
					res.location(model + "/" + savedResourceHistory.id);
					res.status(201).send(JSON.stringify(response));
				}
			});
		}
	});
};

/**
 * Update a resource. Add the new version of the resource to the history.
 */
exports.update = function(req, res) {
	var resource = req.resource;
	resource = _.extend(resource, req.body);

	delete resource._id;
	delete resource.meta;
	delete resource.id;
	delete resource.resourceType;

	resource.save(function(err, savedresource) {
		if (err) {
			var response = {
				resourceType : "OperationOutcome",
				text : {
					status : "generated",
					div : "<div>Error : " + err + "</div>"
				},
			};
			res.status(500).send(response);
			res.send(500);
		} else {
			var resourceHistory = req.resourceHistory;
			resourceHistory.addVersion(savedresource);
			resourceHistory.save(function(rhErr, savedResourceHistory) {
				if (rhErr) {
					var response = {
						resourceType : "OperationOutcome",
						text : {
							status : "generated",
							div : "<div>Error : " + rhErr + "</div>"
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
					res.status(200).send(response);
				}
			});
		}
	});
};

/**
 * Remove a resource.
 */
exports.remove = function(req, res) {
	var resource = req.resource;
	resource.remove(function(err) {
		if (err) {
			var response = {
				resourceType : "OperationOutcome",
				text : {
					status : "generated",
					div : "<div>Error : " + err + "</div>"
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
			res.status(204).send(response);
		}
	});
};

/**
 * Check if two objects are similar
 */
var compareObjects = function(a, b) {
	if(a == null && b != null) return false;
	if(b == null && a!= null) return false;
	for ( var propA in a) {
		propB = propA.trim();
		if (!propB in b) {
			return false;
		}
		var propValue = a[propA];
		if (a[propA].charAt(0) == '{') {
			propValue = JSON.parse(a[propA]);
			if (typeof propValue === 'object') {
				return compareObjects(propValue, b[propB]);
			} else {
				return (propValue == b[propB]);
			}
		}
		else if(a[propA].charAt(0) == '['){
			propValue = JSON.parse(a[propA]);
			propBValue = b[propB];
			for (var i = 0, len = propValue.length; i < len; i++) {
				var elemFound = false;			
				for (var k = 0, klen = propBValue.length; k < klen; k++) 
					if(compareObjects(propValue[i],propBValue[k]))
						elemFound = true;
				if(!elemFound)
					return false;
			}
		}else {
			return (propValue == b[propB]);
		}
	}
	return true;
};

/**
 * List all resources of one type that respect the conditions.<br>
 * Useful for basic search.
 */
exports.list = function(req, res) {

	var result = [];

	var conditions = req.query;

	var historyConditions = {
		resourceType : req.params.model
	}

	if ('createdBy' in conditions) {
		historyConditions.createdBy = conditions.createdBy
	}
	
	delete conditions.resourceType;
	delete conditions.createdBy;

	ResourceHistory.find(historyConditions, function(rhErr, histories) {

		if (rhErr) {
			return next(rhErr);
		}

		async.forEach(histories, function(history, callback) {

			var vid = history.versionCount();

			history.findLatest(function(err, resource) {

				var add = compareObjects(conditions, resource);

				if (add) {

					// weird, but you can't add properties to the resource
					// without this line:
					resource = JSON.parse(JSON.stringify(resource));
					resource['resourceType'] = req.params.model;
					resource['id'] = req.params.model + "/" + history._id;
					var humanReadable = generateText(resource);
					resource['text'] = {
						status : "generated",
						div : humanReadable
					};
					resource['meta'] = {
						versionId : vid,
						created : history._id.getTimestamp(),
						lastUpdated : history.lastUpdatedAt(),
						createdBy : history.createdBy,
						published : new Date(Date.now()),
						updatedBy : history.history[vid - 1].updatedBy
					};
					result.push(resource);
				}
				callback();
			});
		}, function(err) {
			res.contentType('application/fhir+json');
			res.status(200);
			res.send(JSON.stringify(result, null, ' '));
		});
	});
};