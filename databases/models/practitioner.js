// Copyright (c) 2011+, HL7, Inc & The MITRE Corporation
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

/**
 * A person who is directly or indirectly involved in the provisioning of healthcare. 
 */
var PractitionerSchema = new mongoose.Schema({
	identifier: [SubDocs.Identifier],
    active: Boolean,							// Whether this practitioner's record is in active use
    name: SubDocs.HumanName,
    telecom: [SubDocs.ContactPoint],
    address: [SubDocs.Address],
    gender: String,
    birthDate: Date,
    photo: [SubDocs.Attachment],				// Attached images
    practitionerRole: [{						// Roles/organizations the practitioner is associated with
        managingOrganization: SubDocs.Reference,
        role: SubDocs.CodeableConcept,			// Roles which this practitioner may perform
        specialty: [SubDocs.CodeableConcept],	// Specific specialty of the practitioner
        period: SubDocs.Period,					// The period during which the practitioner is authorized to perform in these role(s)
        location: [SubDocs.Reference],			// The location(s) at which this practitioner provides care
        healthcareService: [SubDocs.Reference]
    }],
    qualification: [{							// 	Qualifications obtained by training and certification
        identifier: [SubDocs.Identifier],		// An identifier for this qualification for the practitioner
        code: SubDocs.CodeableConcept,			// Coded representation of the qualification
        period: SubDocs.Period,					// Period during which the qualification is valid
        issuer: SubDocs.Reference,				// 	Organization that regulates and issues the qualification
    }],
    communication: [SubDocs.CodeableConcept],	// A language the practitioner is able to use in patient communication
});

var practitioner = mongoose.model('Practitioner', PractitionerSchema);

exports.Practitioner = practitioner;
