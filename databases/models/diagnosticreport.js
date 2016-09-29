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
 * The findings and interpretation of diagnostic tests performed on patients, 
 * groups of patients, devices, and locations, and/or specimens derived from these. 
 * The report includes clinical context such as requesting and provider information, 
 * and some mix of atomic results, images, textual and coded interpretations, 
 * and formatted representation of diagnostic reports. 
 */
var DiagnosticReportSchema = new mongoose.Schema({
	identifier: [SubDocs.Identifier],
    status: {							// planned | arrived | in-progress | onleave | finished | cancelled
    	type: String, 
    	enum : ["register" , "partial" , "final" , "corrected" , "appended" , "cancelled", "entered-in-error"],
    	required : true,
    	default: 'final'
    },						
    category: SubDocs.CodeableConcept,	// 	Service category ex: BLB Blood Bank, CG Cytogenetics, CH Chemistry, CP CAT Scan,...
    code: SubDocs.CodeableConcept,		// Name/Code for this diagnostic report    	
    subject: SubDocs.Reference,			// The subject of the report, usually, but not always, the patient
    encounter: SubDocs.Reference,		// Health care event when test ordered
    effectiveDateTime: Date,			// Clinically Relevant time/time-period for report
    effectivePeriod: SubDocs.Period,	// Clinically Relevant time/time-period for report
    issued: Date,						// DateTime this version was released
    performer: SubDocs.Reference,		// Responsible Diagnostic Service
    request: [SubDocs.Reference],		// What was requested (DiagnosticOrder | ProcedureRequest | ReferralRequest)
    specimen: [SubDocs.Reference],		// Specimens this report is based on
    result: [SubDocs.Reference],		// Observations - simple, or complex nested groups
    imagingStudy: [SubDocs.Reference],	// Reference to full details of imaging associated with the diagnostic report
    image: [{							// Key images associated with this report
        comment: String,				// Comment about the image (e.g. explanation)
        link: SubDocs.Reference			// Reference to the image source
    }],
    conclusion: String,							// Clinical Interpretation of test results
    codedDiagnosis: [SubDocs.CodeableConcept],	// Codes for the conclusion
    presentedForm: [SubDocs.Attachment]			// Entire report as issued
});

var diagReport = mongoose.model('DiagnosticReport', DiagnosticReportSchema);
exports.DiagnosticReport = diagReport;