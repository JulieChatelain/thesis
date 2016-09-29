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
 * This resource is primarily used for the identification 
 * and definition of a medication. It covers the ingredients 
 * and the packaging for a medication. 
 */
var MedicationSchema = new mongoose.Schema({
    code: SubDocs.CodeableConcept,			// Codes that identify this medication
    isBrand: Boolean,						// True if a brand
    manufacturer: SubDocs.Reference,		// Manufacturer of the item
    product: {								// Administrable medication details
        form: SubDocs.CodeableConcept,		// ex: powder | tablets | carton ...
        ingredient: [{						// Active or inactive ingredient
            item: SubDocs.Reference,		// The product contained
            amount: SubDocs.Ratio			// Quantity of ingredient present
        }],
        batch: [{
            lotNumber: String,
            expirationDate: Date,
        }]
    },
    medPackage: {								// Details about packaged medications
        container: SubDocs.CodeableConcept,		// E.g. box, vial, blister-pack
        content: [{								// What is in the package
            item: SubDocs.Reference,			// A product in the package
            amount: SubDocs.Ratio				// Quantity present in the package
        }]
    }
});

var medication = mongoose.model('Medication', MedicationSchema);
exports.Medication = medication;