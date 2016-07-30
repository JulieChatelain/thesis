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

var EncounterSchema = new mongoose.Schema({
    identifier: [{
		use : {
			type : String,
			enum : [ 'usual', 'official', 'temp', 'secondary' ],
			required : true
		},
		assigner : String, 	// Organization that issued id (may be just text)
		system : String, 	// The namespace for the identifier (uri)
		value : {			// The value that is unique
			type : String,
			required : true
		}
    }],
    status: {				// planned | arrived | in-progress | onleave | finished | cancelled
    	type: String, 
    	required:true
    	},			
    statusHistory: [{		// List of past encounter statuses
        status: {
	    	type: String, 
	    	required:true
    	},	
        period: {
    		start : Date,
    		end : Date
        }
    }],
    classification: {				// inpatient | outpatient | ambulatory | emergency +
    	type: String,
    	required: true
    },
    encounterType: [{				// Specific type of encounter
        coding: [{
            system: String,
            code: String,
            display: String
        }],
		text : String			// Plain text representation of the concept
    }],
    priority: {				//Indicates the urgency of the encounter
        coding: [{
            system: String,
            code: String,
            display: String
        }],
		text : String			// Plain text representation of the concept
    },
    patient: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    episodeOfCare: [{		// Episode(s) of care that this encounter should be recorded against
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    incomingReferral: [{	// The ReferralRequest that initiated this encounter
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    participant: [{				// List of participants involved in the encounter
        role: [{				// Role of participant in encounter
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        }],
        period: {				// 	Period of time during the encounter participant was present
    		start : Date,
    		end : Date
        },
        individual: {			// Persons involved in the encounter other than the patient
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        }
    }],
    appointment: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    period: {				// The start and end time of the encounter
		start : Date,
		end : Date
    },
    length: {				// Quantity of time the encounter lasted (less time absent)
    	value: Number,
    	unit: String,
    	system : String
    },
    reason: [{				// Reason the encounter takes place (code)
        coding: [{
            system: String,
            code: String,
            display: String
        }],
		text : String			// Plain text representation of the concept
    }],
    indication: [{			// Reason the encounter takes place (resource: condition, procedure)
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    hospitalization: {			// Details about the admission to a healthcare service
        preAdmissionIdentifier: {
            use: String,
            label: String,
            system: String,
            value: String
        },
        origin: {				// The location from which the patient came before admission
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        admitSource: {			// 	From where patient was admitted (physician referral, transfer)
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        admittingDiagnosis: [{  // The admitting diagnosis as reported by admitting practitioner (condition)
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        }],
        reAdmission: {			// The type of hospital re-admission that has occurred (if any). If the value is absent, then this is not identified as a readmission
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        dietPreference: [{		// Diet preferences reported by the patient
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        }],
        specialCourtesy: [{		// Special courtesies (VIP, board member)
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        }],
        specialArrangement: [{	// Wheelchair, translator, stretcher, etc.
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        }],
        destination: {			// Location to which the patient is discharged
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        dischargeDisposition: {	// Category or kind of location after discharge
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        dischargeDiagnosis: [{	// The final diagnosis given a patient before release from the hospital after all testing, surgery, and workup are complete
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        }]
    },
    location: [{				// List of locations where the patient has been
        location: {				// Location the encounter takes place
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        status: {				// 	planned | active | reserved | completed        	
        	type: String,		// EncounterLocationStatus (Required)
        	required: true
        },
        period: {				// Time period during which the patient was present at the location
    		start : Date,
    		end : Date
        }
    }],
    serviceProvider: {		// The custodian organization of this Encounter record
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    partOf: {				// Another Encounter this encounter is part of
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }
});

var encounter = mongoose.model('Encounter', EncounterSchema);

exports.Encounter = encounter;
