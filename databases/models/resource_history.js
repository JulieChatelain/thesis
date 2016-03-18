// Copyright (c) 2011+, HL7, Inc & The MITRE Corporation
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
var async = require('async');

var ResourceHistorySchema = new mongoose.Schema({
  resourceType: String,
  history: [{resourceId: mongoose.Schema.Types.ObjectId, addedBy: String}]
});

ResourceHistorySchema.methods = {
  addVersion: function (resourceId, addedBy) {
    this.history.push({resourceId: resourceId, addedBy: addedBy});
  },

  getVersion: function (version, callback) {
    var resourceModel = mongoose.model(this.resourceType);
    resourceModel.findOne(this.getVersionId(version), function(err, instance){
      callback(err, instance);
    });
  },

  getVersionId: function (version) {
    return this.history[version-1].resourceId.toHexString();
  },

  versionCount: function () {
    return this.history.length;
  },

  lastUpdatedAt: function () {
    return _.last(this.history).resourceId.getTimestamp();
  },

  latestVersionId: function () {
    return _.last(this.history).resourceId.toHexString();
  },

  findLatest: function(callback) {
    var resourceModel = mongoose.model(this.resourceType);
    resourceModel.findById(this.latestVersionId(), function(err, instance) {
      callback(err, instance);
    });
  }
};


var history = mongoose.model('ResourceHistory', ResourceHistorySchema);

exports.RHModel = history;
