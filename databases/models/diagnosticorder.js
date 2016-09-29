// Copyright (c) 2011-2013, HL7, Inc & Mitre
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, 
// are permitted provided that the following conditions are met:
// 
//     * Redistributions of source code must retain the above copyright notice, this 
//       list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright notice, 
//       this list of conditions and the following disclaimer in the documentation 
//       and/or other materials provided with the distribution.
//     * Neither the name of HL7 nor the names of its contributors may be used to 
//       endorse or promote products derived from this software without specific 
//       prior written permission.
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
var SubDocs = require('./subDocs/subDocs');

var DiagnosticOrderSchema = new mongoose.Schema({
    subject: SubDocs.Reference,
    orderer: SubDocs.Reference,
    identifier: [SubDocs.Identifier],
    encounter: SubDocs.Reference,
    reason: [SubDocs.CodeableConcept],
    supportingInformation: [SubDocs.Reference],
    specimen: [SubDocs.Reference],
    status: {
		type : String,
		enum : [ 'proposed', 'draft', 'planned', 'requested', 'received', 'accepted', 'in-progress', 'review', 'completed', 'cancelled', 'suspended', 'rejected', 'failed' ],
		required: true,
    	default: 'requested'
	},
    priority: {
    	type: String,
		enum : [ 'routine', 'urgent', 'stat', 'asap'],
		required : true,
		default: 'routine'
	},
    event: [{
        status: {
    		type : String,
    		enum : [ 'proposed', 'draft', 'planned', 'requested', 'received', 'accepted', 'in-progress', 'review', 'completed', 'cancelled', 'suspended', 'rejected', 'failed' ],
    		required: true,
        	default: 'requested'
    	},
        description: SubDocs.CodeableConcept,
        dateTime: Date,
        actor: SubDocs.Reference
    }],
    item: [{
        code: SubDocs.CodeableConcept,
        specimen: [SubDocs.Reference],
        bodySite: SubDocs.CodeableConcept,
        status: {
    		type : String,
    		enum : [ 'proposed', 'draft', 'planned', 'requested', 'received', 'accepted', 'in-progress', 'review', 'completed', 'cancelled', 'suspended', 'rejected', 'failed' ],
    		required: true,
        	default: 'requested'
    	},
        event: [{
        }]
    }],
    note: SubDocs.Annotation
});

var diagOrder = mongoose.model('DiagnosticOrder', DiagnosticOrderSchema);
exports.DiagnosticOrder = diagOrder;
