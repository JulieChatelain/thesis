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
var eco = require('eco');
var async = require('async');
var ResourceHistory = mongoose.model('ResourceHistory');
// var ResponseFormatHelper = require(__dirname +
// '/../../lib/response_format_helper');

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
				resource.resourceType = resourceHistory.resourceType;
				resource.id = resourceHistory.resourceType + "/" + id;
				resource.meta = {
					versionId : resourceHistory.versionCount(),
					created : resourceHistory._id.getTimestamp(),
					lastUpdated : resource._id.getTimestamp(),
					createdBy : resourceHistory.createdBy,
					updatedBy : resourceHistory.history[vid - 1].updatedBy
				}
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
				resource.resourceType = resourceHistory.resourceType;
				resource.id = resourceHistory.resourceType + "/" + id + "/"
						+ vid;
				resource.meta = {
					versionId : vid,
					created : resourceHistory._id.getTimestamp(),
					lastUpdated : resource._id.getTimestamp(),
					createdBy : resourceHistory.createdBy,
					updatedBy : resourceHistory.history[vid - 1].updatedBy
				}
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
			next(rhErr);
		}
		var history = [];
		if (resourceHistory !== null) {
			var i = 1;
			// Get each version
			async.forEach(resourceHistory.history, function(hist, callback) {
				resourceHistory.getVersion(i, function(err, resource) {
					resource.resourceType = resourceHistory.resourceType;
					resource.id = resourceHistory.resourceType + "/" + id + "/"
							+ i;
					resource.meta = {
						versionId : i,
						created : resourceHistory._id.getTimestamp(),
						lastUpdated : hist.resourceId.getTimestamp(),
						createdBy : resourceHistory.createdBy,
						updatedBy : hist.updatedBy
					}
					history.push(resource);
					i++;
					callback();
				});
			}, function(err) {
				req.resource = history;
				next(resource);
			});
		} else {
			req.resource = history;
			next(resource);
		}
	});
};

/**
 * Put the resource in jason format and send it.
 */
exports.show = function(req, res) {
	var resource = req.resource;
	var json = JSON.stringify(resource);
	res.send(json);
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
			res.send(500);
		} else {
			var resourceHistory = new ResourceHistory({
				resourceType : modelName
			});
			resourceHistory.addVersion(savedresource.id);
			resourceHistory.save(function(rhErr, savedResourceHistory) {
				if (rhErr) {
					res.send(500);
				} else {
					res.send(201);
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
			res.send(500);
		} else {
			var resourceHistory = req.resourceHistory;
			resourceHistory.addVersion(savedresource);
			resourceHistory.save(function(rhErr, savedResourceHistory) {
				if (rhErr) {
					res.send(500);
				} else {
					res.send(200);
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
			res.send(500);
		} else {
			res.send(204);
		}
	});
};

/**
 * List all resources of one type that respect the conditions.
 */
exports.list = function(req, res) {

	var result = [];

	var conditions = req.query;
	
	var historyConditions = {
		resourType : req.params.model
	}
	if(createdBy in req.query){
		historyConditions.createdBy = req.query.createdBy
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
				var add = true;
				for (var condition in conditions) {
					if(!(condition in resource) || 
							(resource[condition] != conditions[condition])){
						add = false
					}
				}
				if(add){
					resource.resourceType = req.params.model,
							resource.id = req.params.model + "/" + history._id.str,
							resource.meta = {
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
			res.send(JSON.stringify(result));
		});
	});
};