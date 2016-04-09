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

var DiagnosticReportSchema = new mongoose.Schema({
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
    status: String,			// 	registered | partial | final | corrected | appended | cancelled | entered-in-error
    category: {				// 	Service category ex: BLB Blood Bank, CG Cytogenetics, CH Chemistry, CP CAT Scan,...
        coding: [{			//  See : Diagnostic Service Section Codes
            system: String,
            code: String,
            display: String
        }]
    },
    code: {					// Name/Code for this diagnostic report    						
        coding: [{			// LOINC Diagnostic Report Codes (Preferred)
            system: String,
            code: String,
            display: String
        }]
    },
    subject: {				// The subject of the report, usually, but not always, the patient
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    encounter: {			// Health care event when test ordered
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    effectiveDateTime: Date,	// Clinically Relevant time/time-period for report
    effectivePeriod: {			// Clinically Relevant time/time-period for report
		start : Date,
		end : Date
    },
    issued: Date,			// DateTime this version was released
    performer: {			// Responsible Diagnostic Service
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    request: [{				// What was requested (DiagnosticOrder | ProcedureRequest | ReferralRequest)
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    specimen: [{			// Specimens this report is based on
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    result: [{				// Observations - simple, or complex nested groups
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    imagingStudy: [{		// Reference to full details of imaging associated with the diagnostic report
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    image: [{				// Key images associated with this report
        comment: String,	// Comment about the image (e.g. explanation)
        link: {				// Reference to the image source
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        }
    }],
    conclusion: String,		// Clinical Interpretation of test results
    codedDiagnosis: [{		// Codes for the conclusion
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    presentedForm: [{		// Entire report as issued
		contentType : String, 	// Mime type of the content, with charset etc.
		language : String, 		// Human language of the content (BCP-47)
		data : Buffer, 			// Data inline, base64ed
		url : String, 			// Uri where the data can be found
		size : Number, 			// Number of bytes of content (if url provided)
		hash : Buffer, 			// Hash of the data (sha-1, base64ed)
		title : String, 		// Label to display in place of the data
		creation : Date			// Date attachment was first created	
    }]
});

var diagReport = mongoose.model('DiagnosticReport', DiagnosticReportSchema);
exports.DiagnosticReport = diagReport;