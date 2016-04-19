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

var MedicationOrderSchema = new mongoose.Schema({
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
    dateWritten: Date,
    status: String,
    dateEnded: Date,
    reasonEnded: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    patient: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    prescriber: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    encounter: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    reasonCodeableConcept: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    reasonReference: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    note: String,
    medicationCodeableConcept: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    medicationReference: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    dosageInstruction: [{
        text: String,
        additionalInstructions: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        timing: {
        },
        asNeededBoolean: Boolean,
        asNeededCodeableConcept: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        siteCodeableConcept: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        siteReference: {
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        route: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        method: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        doseRange: {
        },
        doseSimpleQuantity: {
        },
        rateRatio: {
        },
        rateRange: {
        },
        maxDosePerPeriod: {
        }
    }],
    dispenseRequest: {
        medicationCodeableConcept: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        medicationReference: {
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        validityPeriod: {
        },
        numberOfRepeatsAllowed: {
        },
        quantity: {
        },
        expectedSupplyDuration: {
        }
    },
    substitution: {
        fhirType: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        reason: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        }
    },
    priorPrescription: {
    }
});

var medicationOrder = mongoose.model('MedicationOrder', MedicationOrderSchema);
exports.MedicationOrder = medicationOrder;