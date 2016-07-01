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
 * Detailed information about conditions, problems or diagnoses <br>
 * Use to record detailed information about conditions, problems or diagnoses
 * recognized by a clinician. There are many uses including: recording a
 * diagnosis during an encounter; populating a problem list or a summary
 * statement, such as a discharge summary.
 */

var ConditionSchema = new mongoose.Schema({
	identifier : [ {
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
	
	} ],
	patient : {				// 	Who has the condition?
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
	
	},
	encounter : {			// Encounter when condition first asserted
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
	
	},
	asserter : {			// Person who asserts this condition
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
	},
	dateRecorded : Date,	// When first entered
	code : {				// Identification of the condition, problem or diagnosis
		coding : [ {
			system : String, 	// Identity of the terminology system (uri)
			code : String, 		// Symbol in syntax defined by the system
			display : String	// Representation defined by the system
		
		} ],
		text : String			// Plain text representation of the concept
	},
	category : {				// complaint | symptom | finding | diagnosis
		coding : [ {
			system : String, 	// Identity of the terminology system (uri)
			code : String, 		// Symbol in syntax defined by the system
			display : String	// Representation defined by the system
		
		} ],
		text : String			// Plain text representation of the concept
	},
	clinicalStatus : {
		type : String,
		enum : [ 'active', 'relapse', 'remission', 'resolved' ]
	},
	verificationStatus : {
		type : String,
		required : true,
		enum : [ 'provisional', 'differential', 'confirmed', 'refuted',
				'entered-in-error', 'unknown' ]
	},
	severity : {				// Subjective severity of condition
		coding : [ {
			system : String, 	// Identity of the terminology system (uri)
			code : String, 		// Symbol in syntax defined by the system
			display : String	// Representation defined by the system
		
		} ],
		text : String			// Plain text representation of the concept
	},
	// Estimated or actual date, date-time, or age
	onsetDateTime : Date,
	onsetQuantity : {
		value : Number,
		units : String,
		system : String,
		code : String
	},
	onsetPeriod : {
		start : Date,
		end : Date
	},
	onsetString : String,
	// If/when in resolution/remission
	abatementDateTime : Date,
	abatementQuantity : {
		value : Number,
		units : String,
		system : String,
		code : String
	},
	abatementBoolean : Boolean,
	abatementPeriod : {
		start : Date,
		end : Date
	},
	abatementRange : {low : String, high : String},
	abatementString : String,
	stage : {					// Stage/grade, usually assessed formally
		summary : {				// Simple summary (disease specific)
			coding : [ {
				system : String, 	// Identity of the terminology system (uri)
				code : String, 		// Symbol in syntax defined by the system
				display : String	// Representation defined by the system
			
			} ],
			text : String			// Plain text representation of the concept
		},
		assessment : [ {		// Formal record of assessment
			reference : String, // Relative, internal or absolute URL reference
			display : String	// Text alternative for the resource
			} ]
	},
	evidence : [ {				// Supporting evidence
		code : {				// 	Manifestation/symptom
			coding : [ {
				system : String, 	// Identity of the terminology system (uri)
				code : String, 		// Symbol in syntax defined by the system
				display : String	// Representation defined by the system
			
			} ],
			text : String			// Plain text representation of the concept
		},
		detail : [ {			// Supporting information found elsewhere
			reference : String, // Relative, internal or absolute URL reference
			display : String	// Text alternative for the resource
			} ]
	} ],
	bodySite : [ {				// 	Anatomical location, if relevant
		coding : [ {
			system : String, 	// Identity of the terminology system (uri)
			code : String, 		// Symbol in syntax defined by the system
			display : String	// Representation defined by the system
		
		} ],
		text : String			// Plain text representation of the concept
	} ],
	notes : String				// Additional information about the Condition
});

var condition = mongoose.model('Condition', ConditionSchema);

exports.Condition = condition;
