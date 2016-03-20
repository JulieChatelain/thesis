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
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

// create, remove, update, show, history, read, vread
exports.read = function(req, res, id, next){
	ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, resource) {
          req.resource = resource;
      	resource.resourceType = resourceHistory.resourceType;
    	resource.id = resourceHistory.resourceType + "/" + hist._id.str;
    	resource.meta = {
    		    versionId : resourceHistory.versionCount(),
    		    lastUpdated : hist._id.getTimestamp(),
    		    addedBy : hist.addedBy
    		  }
          next(resource);
        });
      }
    });
};
exports.vread = function(req, res, id, vid, next){
	ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.getVersion(vid, function(err, resource) {
            req.resource = resource;
        	resource.resourceType = resourceHistory.resourceType;
        	resource.id = resourceHistory.resourceType + "/" + hist._id.str;
        	resource.meta = {
        		    versionId : vid,
        		    lastUpdated : hist._id.getTimestamp(),
        		    addedBy : hist.addedBy
        		  }
            next(resource);
        });
      }
    });
};
exports.history = function(req, res, id, next) {
	// Find the history
	ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
	      if (rhErr) {
	        next(rhErr);
	      }
	      var history = [];
	      if(resourceHistory !== null) {
	        var i = 1;
	        // Get each version
	        async.forEach(resourceHistory.history, function(hist, callback) {
	            resourceHistory.getVersion(i, function(err, resource) {
	            	resource.resourceType = resourceHistory.resourceType;
	            	resource.id = resourceHistory.resourceType + "/" + hist._id.str;
	            	resource.meta = {
	            		    versionId : i,
	            		    lastUpdated : hist._id.getTimestamp(),
	            		    addedBy : hist.addedBy
	            		  }
	            	history.push(resource);
	            	i++;
	            	callback();
	            });
	          }, function(err) {
	              req.resource = history;
	              next(resource);
	          });
	      }else{
              req.resource = history;
              next(resource);
	      }
	    });
};

exports.show = function(req, res) {
  var resource = req.resource;
  var json = JSON.stringify(resource);
  res.send(json);
};

exports.create = function(req, res) {
	
  var modelName = req.params.model.toLowerCase();
  modelName.charAt(0).toUpperCase();
  
  var model = mongoose.model(modelName);
  var resource = new model(req.body);
  
  delete resource._id;
  
  resource.save(function(err, savedresource) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType:  modelName});
      resourceHistory.addVersion(savedresource.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var resource = req.resource;
  resource = _.extend(resource, req.body);
  
  delete resource._id;
  delete resource.meta;
  delete resource.id;
  delete resource.resourceType;
  
  resource.save(function(err, savedresource) {
    if(err) {
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

exports.remove = function(req, res) {
  var resource = req.resource;
  resource.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type <ModelName>",
    id: "http://localhost:3000/<LowerCaseModelName>",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/<LowerCaseModelName>",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"<ModelName>"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, resource) {
        var entrywrapper = {
          title: "<ModelName> " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/<LowerCaseModelName>/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/<LowerCaseModelName>/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: resource
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};