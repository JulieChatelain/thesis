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
 * An order for both supply of the medication and the instructions 
 * for administration of the medication to a patient. The resource 
 * is called "MedicationOrder" rather than "MedicationPrescription" 
 * to generalize the use across inpatient and outpatient settings 
 * as well as for care plans, etc. 
 */
var MedicationOrderSchema = new mongoose.Schema({
	identifier: [SubDocs.Identifier],
    dateWritten: Date,						// When prescription was authorized
    status: {
		type : String,
		enum : [ 'active', 'on-hold', 'completed', 'entered-in-error', 'stopped', 'draft' ],
		required : true
	},	
    dateEnded: Date,						// When prescription was stopped
    reasonEnded: SubDocs.CodeableConcept,	// Why the prescription was stopped
    patient: SubDocs.Reference,
    prescriber: SubDocs.Reference,
    encounter: SubDocs.Reference,					// Created during encounter/admission/stay
    reasonCodeableConcept: SubDocs.CodeableConcept,	// 	Reason or indication for writing the prescription
    reasonReference: SubDocs.Reference,
    note: String,									// Information about the prescription
    medicationReference: SubDocs.Reference,			// Medication to be taken
    
    // How medication should be taken
    dosageInstruction: [{							
        text: String,								// Dosage instructions expressed as text
        additionalInstructions: SubDocs.CodeableConcept,// Supplemental instructions - e.g. "with meals"
        timing: SubDocs.Timing,						// When medication should be administered
        asNeededBoolean: Boolean,
        asNeededCodeableConcept: SubDocs.CodeableConcept,
        siteCodeableConcept: SubDocs.CodeableConcept,// Body site to administer to
        siteReference : SubDocs.Reference,
        route: SubDocs.CodeableConcept,				// How drug should enter body
        method: SubDocs.CodeableConcept,			// Technique for administering medication
        // Amount of medication per dose
        doseRange: SubDocs.Range,					// Ex: between x ml and x ml
        doseQuantity: String,
        // Amount of medication per unit of time
        rateRatio: SubDocs.Ratio,
        rateRange: SubDocs.Range,
        // Upper limit on medication per unit of time
        maxDosePerPeriod: SubDocs.Ratio
    }],
    // Medication supply authorization
    dispenseRequest : {
    	//Product to be supplied
    	medicationCodeableConcept: SubDocs.CodeableConcept,
    	medicationReference: SubDocs.Reference,
    	validityPeriod: SubDocs.Period,				// Time period supply is authorized for
    	numberOfRepeatsAllowed: {type: Number, min: 0}, // Number of refills authorized
    	quantity: String,							// Amount of medication to supply per dispense
    	expectedSupplyDuration: String				// Number of days supply per dispense
    },
    // Any restrictions on medication substitution
    substitution : {
    	substitutionType: SubDocs.CodeableConcept,	// generic | formulary +
    	reason: SubDocs.CodeableConcept				// Why should (not) substitution be made
    },
    priorPrescription : SubDocs.Reference			// An order/prescription that this supersedes
});


var medicationOrder = mongoose.model('MedicationOrder', MedicationOrderSchema);
exports.MedicationOrder = medicationOrder;