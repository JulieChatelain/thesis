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
 * Measurements and simple assertions made about a patient, device or other subject. 
 */
var ObservationSchema = new mongoose.Schema({
    identifier: [SubDocs.Identifier],
    status: String,						// registered | preliminary | final | amended +
    category: SubDocs.CodeableConcept,	// Classification of type of observation: 
    									// social-history, risk-factor, vital-signs, imaging, laboratory, procedure, survey, exam, therapy
    code: SubDocs.CodeableConcept,		// Type of observation (code / type)
    subject: SubDocs.Reference,			// Who and/or what this is about
    encounter: SubDocs.Reference,		// Healthcare event during which this observation is made
    effectiveDateTime: Date,			// Clinically relevant time/time-period for observation
    effectivePeriod: SubDocs.Period,
    issued: Date,						// Date/Time this was made available
    performer: [SubDocs.Reference],		// Who is responsible for the observation
    // Actual result
    valueQuantity: SubDocs.Quantity,
    valueCodeableConcept: SubDocs.CodeableConcept,
    valueString: String,
    valueRange: SubDocs.Range,
    valueRatio: SubDocs.Ratio,
    valueSampledData: SubDocs.SampledData,
    valueAttachment: SubDocs.Attachment,
    valueTime: String,			// A time during the day, with no date specified
    							// Regex: ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?
    valueDateTime: Date,
    valuePeriod: SubDocs.Period,
    dataAbsentReason: SubDocs.CodeableConcept,	// Why the result is missing
    interpretation: SubDocs.CodeableConcept,	// High, low, normal, etc.
    comments: String,							// Comments about result
    bodySite: SubDocs.CodeableConcept,
    method: SubDocs.CodeableConcept,			// How it was done
    specimen: SubDocs.Reference,
    device: SubDocs.Reference,
    referenceRange: [{		// Provides guide for interpretation
    						// Must have at least a low or a high or text
        low: String,
        high: String,
        meaning: SubDocs.CodeableConcept,	// Indicates the meaning/use of this range of this range
        age: SubDocs.Range,					// Applicable age range, if relevant
        text: String,		// Text based reference range in an observation
    }],
    related: [{				// Resource related to this observation
        fhirType: String,	// has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by
        target: SubDocs.Reference,
    }],
    component: [{				// 	Component results
        code: SubDocs.CodeableConcept,
        valueQuantity: SubDocs.Quantity,
        valueCodeableConcept: SubDocs.CodeableConcept,
        valueString: String,
        valueRange: SubDocs.Range,
        valueRatio: SubDocs.Ratio,
        valueSampledData: SubDocs.SampledData,
	    valueAttachment: SubDocs.Attachment,
        valueTime: String,
        valueDateTime: Date,
        valuePeriod: SubDocs.Period,
        dataAbsentReason: SubDocs.CodeableConcept,	// Why the result is missing
        referenceRange: [{						// Provides guide for interpretation
												// Must have at least a low or a high or text
            low: String,
            high: String,
            meaning: SubDocs.CodeableConcept,	// Indicates the meaning/use of this range of this range
            age: SubDocs.Range,					// Applicable age range, if relevant
            text: String,						// Text based reference range in an observation
        }]
    }]
});

var observation = mongoose.model('Observation', ObservationSchema);
exports.Observation = observation;