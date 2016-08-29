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
var utils = require('./utils');
// var ResponseFormatHelper = require(__dirname +
// '/../../lib/response_format_helper');



/**
 * Put the resource in jason format and send it.
 */
exports.show = function(req, res) {
	var resource = req.resource;
	// First check if they have the authorization	
	utils.checkAuthorization(req, resource, function(accessLevel){
		if(accessLevel == 1){
			resource = utils.getMinimumRead(resource, req.params.model);
		}
		if(accessLevel > 0){	
			var humanReadable = utils.generateText(resource, res, req.headers.host);
			resource.text = {
				status : "generated",
				div : humanReadable
			};
			var json = JSON.stringify(resource, null, 2);
			res.contentType('application/fhir+json');
			res.location(resource.id);
			res.status(200);
			res.send(json);
		}else{
			res.sendStatus(403);
		}
	}); 
};

/**
 * Return the latest version of a resource.
 */
exports.read = function(req, res, id, next) {
	ResourceHistory.findById(id, function(rhErr, resourceHistory) {
		if (rhErr) {
			console.log("Error in RESTController read function: " + rhErr);
			next(rhErr);
		}
		if (resourceHistory !== null && typeof resourceHistory != 'undefined') {
			req.resourceHistory = resourceHistory;
			var vid = resourceHistory.versionCount();
			req.resourceHistory.findLatest(function(err, resource) {
				if(err != null){
					console.log("Error in RESTController read function: " + err);
					next(err);
				}
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
		if (resourceHistory !== null &&  typeof resourceHistory != 'undefined') {
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
		if (resourceHistory !== null &&  typeof resourceHistory != 'undefined') {
			var i = 1;
			// Get each version
			async.forEach(resourceHistory.history, function(hist, callback) {
				resourceHistory.getVersion(i, function(err, resource) {
					// First check if they have the authorization	
					utils.checkAuthorization(req, resource, function(accessLevel){
						if(accessLevel == 1){
							resource = utils.getMinimumRead(resource);
						}
						if(accessLevel > 0){
							resource = JSON.parse(JSON.stringify(resource));
							resource.resourceType = resourceHistory.resourceType;
							resource.id = resourceHistory.resourceType + "/" + id
									+ "/_history/" + i;
							resource.meta = {
								versionId : i,
								created : resourceHistory._id.getTimestamp(),
								lastUpdated : hist.resourceId.getTimestamp(),
								createdBy : resourceHistory.createdBy,
								updatedBy : hist.updatedBy
							};
							var humanReadable = utils.generateText(resource,res,request.headers.host);
							resource.text = {
								status : "generated",
								div : humanReadable
							};
							history.push(resource);
						}
						i++;
						callback();
					});
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
exports.create = function(req, res, next) {

	var modelName = req.params.model;

	var model = mongoose.model(modelName);
	var resource = new model(req.body);

	delete resource._id;
	
	if(utils.isEmpty(resource)){
		next('');
	}
	else{
		// First check if they have the authorization	
		//utils.checkAuthorization(req, resource, function(accessLevel){
			//if(accessLevel > 1){
				resource.save(function(err, savedresource) {
					if (err) {
						next(err);
					} else {
						var resourceHistory = new ResourceHistory({
							resourceType : modelName
						});
						resourceHistory.addVersion(savedresource.id, "");
						resourceHistory.save(function(rhErr, savedResourceHistory) {
							if (rhErr) {
								next(rhErr);
							} else {
								next(modelName + "/" + savedResourceHistory.id);
							}
						});
					}
				});
			//}else{
			//	next(new Error("Authorization refused"));
			//}
		//});
	}
};

/**
 * Update a resource. Add the new version of the resource to the history.
 */
exports.update = function(req, res) {
	var resource = req.resource;
	// First check if they have the authorization	
	var authorization = utils.checkAuthorization(req, resource);
	utils.checkAuthorization(req, resource, function(accessLevel){
		if(accessLevel == 3){
			resource = _.extend(resource, req.body);
		
			delete resource._id;
			delete resource.meta;
			delete resource.id;
			delete resource.resourceType;
			delete resource.accessLevel;
		
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
		}else{
			res.sendStatus(403);
		}
	});
};

/**
 * Remove a resource.
 */
exports.remove = function(req, res) {
	var resource = req.resource;
	// First check if they have the authorization	
	utils.checkAuthorization(req, resource, function(accessLevel){
		if(accessLevel == 5){
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
		}else{
			res.sendStatus(403);
		}
	});
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

				var add = utils.compareObjects(conditions, resource);
				if (add) {
					// weird, but you can't add properties to the resource
					// without this line:
					resource = JSON.parse(JSON.stringify(resource));
					resource['id'] = req.params.model + "/" + history._id;
					resource['resourceType'] = req.params.model;
					utils.checkAuthorization(req, resource, function(accessLevel){						
						// First check if they have the authorization	
						if(accessLevel > 0){
							if(accessLevel == 1){
								resource = utils.getMinimumRead(resource, req.params.model);
							}
							resource['accessLevel'] = accessLevel;
							resource['meta'] = {
								versionId : vid,
								created : history._id.getTimestamp(),
								lastUpdated : history.lastUpdatedAt(),
								createdBy : history.createdBy,
								published : new Date(Date.now()),
								updatedBy : history.history[vid - 1].updatedBy								
							};
							var humanReadable = utils.generateText(resource, res, req.headers.host);
							resource['text'] = {
								status : "generated",
								div : humanReadable
							};
							result.push(resource);
						}			
						callback();	
					});	
				}else{
					callback();
				}
			});
		}, function(err) {
			res.contentType('application/fhir+json');
			res.status(200);
			res.send(JSON.stringify(result, null, ' '));
		});
	});
};