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
 * An interaction between a patient and healthcare provider(s) 
 * for the purpose of providing healthcare service(s) or assessing 
 * the health status of a patient. 
 */
var EncounterSchema = new mongoose.Schema({
	identifier: [SubDocs.Identifier],
    status: {						// planned | arrived | in-progress | onleave | finished | cancelled
    	type: String, 
    	enum : ["planned" , "arrived" , "in-progress" , "onleave" , "finished" , "cancelled"],
    	required : true,
    	default: 'finished'
    	},			
    statusHistory: [{				// List of past encounter statuses
        status: {
	    	type: String, 
	    	enum : ["planned" , "arrived" , "in-progress" , "onleave" , "finished" , "cancelled"],
	    	required : true
    	},	
        period: SubDocs.Period
    }],
    classification: {				// inpatient | outpatient | ambulatory | emergency +
    	type: String,
    	enum : ["inpatient" , "outpatient" , "ambulatory" , "emergency", "home", "field", "daytime", "virtual", "other"],
    	required: true,
		default: 'ambulatory'
    },
    encounterType: [SubDocs.CodeableConcept],	// Specific type of encounter
    priority: SubDocs.CodeableConcept,			//Indicates the urgency of the encounter
    patient: SubDocs.Reference,					// The patient present at the encounter
    episodeOfCare: [SubDocs.Reference],			// Episode(s) of care that this encounter should be recorded against
    incomingReferral: [SubDocs.Reference],		// The ReferralRequest that initiated this encounter
    participant: [{								// List of participants involved in the encounter
        role: [SubDocs.CodeableConcept],		// Role of participant in encounter
        period: SubDocs.Period,					// 	Period of time during the encounter participant was present
        individual: SubDocs.Reference,			// Persons involved in the encounter other than the patient
    }],
    appointment: SubDocs.Reference,				// The appointment that scheduled this encounter
    period: SubDocs.Period,						// The start and end time of the encounter
    length: SubDocs.Quantity,					// Quantity of time the encounter lasted (less time absent)
    reason: [SubDocs.CodeableConcept],			// Reason the encounter takes place (code)
    indication: [SubDocs.Reference],			// Reason the encounter takes place (resource: condition, procedure)
    hospitalization: {							// Details about the admission to a healthcare service
        preAdmissionIdentifier: SubDocs.Identifier,
        origin: SubDocs.Reference,				// The location from which the patient came before admission
        admitSource: SubDocs.CodeableConcept,	// 	From where patient was admitted (physician referral, transfer)
        admittingDiagnosis: [SubDocs.Reference], // The admitting diagnosis as reported by admitting practitioner (condition)
        reAdmission: SubDocs.CodeableConcept,	// The type of hospital re-admission that has occurred (if any). If the value is absent, then this is not identified as a readmission
            
        dietPreference: [SubDocs.CodeableConcept],		// Diet preferences reported by the patient
        specialCourtesy: [SubDocs.CodeableConcept],		// Special courtesies (VIP, board member)
        specialArrangement: [SubDocs.CodeableConcept],	// Wheelchair, translator, stretcher, etc.
        destination: SubDocs.Reference,					// Location to which the patient is discharged
        dischargeDisposition: SubDocs.CodeableConcept,	// Category or kind of location after discharge
        dischargeDiagnosis: [SubDocs.Reference]			// The final diagnosis given a patient before release from the hospital after all testing, surgery, and workup are complete
    	
    },
    location: [{					// List of locations where the patient has been
        location: SubDocs.Reference,// Location the encounter takes place
        status: {					// 	planned | active | reserved | completed        	
        	type: String,			// EncounterLocationStatus (Required)
        	enum : ["planned" , "active" , "reserved" , "completed"],
        	required: true,
        	default: 'completed'
        },
        period: SubDocs.Period				// Time period during which the patient was present at the location
    }],
    serviceProvider: SubDocs.Reference,		// The custodian organization of this Encounter record
    partOf: SubDocs.Reference,				// Another Encounter this encounter is part of
    conclusion : String						// (Not in original model)
});

var encounter = mongoose.model('Encounter', EncounterSchema);

exports.Encounter = encounter;
