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
 * Detailed information about conditions, problems or diagnoses <br>
 * Use to record detailed information about conditions, problems or diagnoses
 * recognized by a clinician. There are many uses including: recording a
 * diagnosis during an encounter; populating a problem list or a summary
 * statement, such as a discharge summary.
 */

var ConditionSchema = new mongoose.Schema({
	identifier : [ SubDocs.Identifier ],
	patient : SubDocs.Reference,		// 	Who has the condition?
	encounter : SubDocs.Reference,		// Encounter when condition first asserted
	asserter : SubDocs.Reference,		// Person who asserts this condition
	dateRecorded : Date,				// When first entered
	code : SubDocs.CodeableConcept,		// Identification of the condition, problem or diagnosis
	category : SubDocs.CodeableConcept, // complaint | symptom | finding | diagnosis
	clinicalStatus : {
		type : String,
		enum : [ 'active', 'relapse', 'remission', 'resolved' ],
		default: 'active'
	},
	verificationStatus : {
		type : String,
		required : true,
		enum : [ 'provisional', 'differential', 'confirmed', 'refuted',
				'entered-in-error', 'unknown' ],
		default: 'confirmed'
	},
	severity : SubDocs.CodeableConcept,		// Subjective severity of condition
	// Estimated or actual date, date-time, or age
	onsetDateTime : Date,
	onsetQuantity : SubDocs.Quantity,
	onsetPeriod :  SubDocs.Period,
	onsetString : String,
	// If/when in resolution/remission
	abatementDateTime : Date,
	abatementQuantity :  SubDocs.Quantity,
	abatementBoolean : Boolean,
	abatementPeriod :  SubDocs.Period,
	abatementRange : {low : String, high : String},
	abatementString : String,
	stage : {								// Stage/grade, usually assessed formally
		summary : SubDocs.CodeableConcept,	// Simple summary (disease specific)
		assessment : [ SubDocs.Reference],	// Formal record of assessment
	},
	evidence : [ {							// Supporting evidence
		code : SubDocs.CodeableConcept,		// 	Manifestation/symptom
		detail : [ SubDocs.Reference],		// Supporting information found elsewhere
	} ],
	bodySite : [ SubDocs.CodeableConcept ],	// 	Anatomical location, if relevant
	notes : String							// Additional information about the Condition
});

var condition = mongoose.model('Condition', ConditionSchema);

exports.Condition = condition;
