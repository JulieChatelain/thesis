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
 * Demographics and other administrative information about an individualreceiving care or other health-related services. 
 */
var PatientSchema = new mongoose.Schema({
    identifier: [SubDocs.Identifier],
    active: Boolean,		// Whether this patient's record is in active use
    name: SubDocs.HumanName,
    telecom: [SubDocs.ContactPoint],
    gender: String,
    birthDate: Date,
    
    //	Indicates if the individual is deceased or not
    deceasedBoolean: Boolean,
    deceasedDateTime: Date,
    
    address: [SubDocs.Address],
    profession:[String],
    maritalStatus: SubDocs.CodeableConcept,	// Marital (civil) status of a patient   
    
    // Whether patient is part of a multiple birth
    multipleBirthBoolean: Boolean,
    multipleBirthInteger: Number,
    
    photo: [SubDocs.Attachment],	// Attached images
    contact: [{						// 	A contact party (e.g. guardian, partner, friend) for the patient
        relationship: [SubDocs.CodeableConcept], // The kind of relationship
        name: SubDocs.HumanName,
        telecom: [SubDocs.ContactPoint],
        address: [SubDocs.Address],
        gender: String,
        organization: SubDocs.Reference,	// Organization that is associated with the contact
        period: SubDocs.Period				// The period during which this contact person or organization is valid to be contacted relating to this patient
    	
    }],
    communication: [{						//	A list of Languages which may be used to communicate with the patient about his or her health
        language: SubDocs.CodeableConcept,	// The language which can be used to communicate with the patient about his or her health
        preferred: Boolean					// Language preference indicator
    }],
    careProvider: [SubDocs.Reference],		// Patient's nominated primary care provider
    managingOrganization: SubDocs.Reference,// Organization that is the custodian of the patient record
    link: [{								// Link to another patient resource that concerns the same actual person
        other: SubDocs.Reference,			// The other patient resource that the link refers to
        linkType: String,					// replace | refer | seealso - type of link
    }]
});

var patient =  mongoose.model('Patient', PatientSchema);

exports.Patient = patient;
