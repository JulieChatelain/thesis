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

var restler  = require('restler');
var mongoose = require('mongoose');
var _ = require('underscore');
var Patient = mongoose.model('Patient');
var ResourceHistory = mongoose.model('ResourceHistory');

exports.checkPatientCache = function(req, res, next, model) {
  if (model === 'patient' && typeof req.params.id !== "undefined") {
    var patientId = req.params.id;
    ResourceHistory.findInCacheOrLocal(patientId, 'Patient', function(resourceHistory) {
      if (resourceHistory) {
        // we already have the resource, let's use it
        // in the future we can check to see if we need to refresh the cached copy
        req.resourceHistory = resourceHistory;
        next();
      } else {
        // fetch from the backend service
        var requestUrl = req.serviceConfig.patients.url + patientId + ".json";
        restler.get(requestUrl, {username: req.serviceConfig.patients.username, password: req.serviceConfig.patients.password}).once('complete', function(vistaPatient) {
          var novoPatient = new Patient();
          novoPatient.gender.coding = [{system: "http://hl7.org/fhir/v3/AdministrativeGender", code: vistaPatient.gender}];
          novoPatient.name = [{family: [vistaPatient.familyname], given: [vistaPatient.givenname]}];
          novoPatient.birthDate = Date.parse(vistaPatient.birthdate);
          novoPatient.save(function(err, savedPatient) {          
            if(err) {
              res.send(500);
            } else {
              var newResourceHistory = new ResourceHistory({resourceType: 'Patient', vistaId: req.params.id});
              newResourceHistory.addVersion(savedPatient.id);
              newResourceHistory.save(function(rhError, savedResourceHistory) {
                req.resourceHistory = savedResourceHistory;
                next();
              });
            }
          });        
        });
      }
    });
  } else {
    next();
  }
}