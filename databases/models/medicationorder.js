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
/**
 * An order for both supply of the medication and the instructions 
 * for administration of the medication to a patient. The resource 
 * is called "MedicationOrder" rather than "MedicationPrescription" 
 * to generalize the use across inpatient and outpatient settings 
 * as well as for care plans, etc. 
 */
var MedicationOrderSchema = new mongoose.Schema({
    identifier: [{			// External identifier
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
    dateWritten: Date,		// When prescription was authorized
    status: {
		type : String,
		enum : [ 'active', 'on-hold', 'completed', 'entered-in-error', 'stopped', 'draft' ],
		required : true
	},	
    dateEnded: Date,		// When prescription was stopped
    reasonEnded: {			// Why the prescription was stopped
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
    prescriber: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    encounter: {			// Created during encounter/admission/stay
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    reasonCodeableConcept: {	// 	Reason or indication for writing the prescription
        coding: [{
            system: String,
            code: String,
            display: String
        }],
		text : String			// Plain text representation of the concept
    },
    reasonReference: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    note: String,			// Information about the prescription
    medicationReference: {	// Medication to be taken
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    dosageInstruction: [{		//How medication should be taken
        text: String,				// Dosage instructions expressed as text
        additionalInstructions: {	// Supplemental instructions - e.g. "with meals"
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        timing: {					// When medication should be administered
        	duration : Number, 		// How long when it happens
            durationMax : Number, 	// How long when it happens (Max)
            durationUnits : {
    			type : String,
    			enum : [ 's', 'min', 'h', 'd', 'wk', 'mo', 'a' ]
    		},
            frequency : Number, 	// Event occurs frequency times per period
            frequencyMax : Number, 	// Event occurs up to frequencyMax times per period
            period : Number, 		// Event occurs frequency times per period
            periodMax : Number, 	// Upper limit of period (3-4 hours)
            periodUnits : {
    			type : String,
    			enum : [ 's', 'min', 'h', 'd', 'wk', 'mo', 'a' ]
    		}, 
            when : String 			// Regular life events the event is tied to
        },
        asNeededBoolean: Boolean,
        siteCodeableConcept: {	// Body site to administer to
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        route: {				// How drug should enter body
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        method: {				// Technique for administering medication
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        doseRange: {			// Ex: between x ml and x ml
        	low: {
            	value: Number,
            	unit: String
            },
        	high: {
            	value: Number,
            	unit: String
            },
        },
        maxDosePerPeriod: {			// Max 40 ml per  3 day
        	numerator: {
	        	value : Number, 		// Numerical value (with implicit precision)
	        	comparator : {			//  how to understand the value
	    			type : String,
	    			enum : [ '<', '<=', '>=', '>' ]
	    		}, 	
	        	unit : String, 			// Unit representation
	        	system : String, 		// C? System that defines coded unit form
	        	code : String 			// Coded form of the unit
        	},
        	denominator:  {
	        	value : Number, 		// Numerical value (with implicit precision)
	        	comparator : {			//  how to understand the value
	    			type : String,
	    			enum : [ '<', '<=', '>=', '>' ]
	    		}, 	
	        	unit : String, 			// Unit representation
	        	system : String, 		// C? System that defines coded unit form
	        	code : String 			// Coded form of the unit
        	}
        }
    }]
});
/*
MedicationOrderSchema.methods = {
		
}*/

var medicationOrder = mongoose.model('MedicationOrder', MedicationOrderSchema);
exports.MedicationOrder = medicationOrder;