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

var ObservationSchema = new mongoose.Schema({
    identifier: [{
        use: String,
        label: String,
        system: String,
        value: String
    }],
    status: String,
    category: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    code: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    subject: {
    },
    encounter: {
    },
    effectiveDateTime: Date,
    effectivePeriod: {
    },
    issued: Date,
    performer: [{
    }],
    valueQuantity: {
        value: String,
        units: String,
        system: String,
        code: String
    },
    valueCodeableConcept: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    valueString: String,
    valueRange: {
    },
    valueRatio: {
    },
    valueSampledData: {
    },
    valueAttachment: {
    },
    valueTime: {
    },
    valueDateTime: Date,
    valuePeriod: {
    },
    dataAbsentReason: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    interpretation: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    comments: String,
    bodySite: {
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
    specimen: {
    },
    device: {
    },
    referenceRange: [{
        low: {
        },
        high: {
        },
        meaning: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        age: {
        },
        text: String,
    }],
    related: [{
        fhirType: String,
        target: {
        }
    }],
    component: [{
        code: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        valueQuantity: {
            value: String,
            units: String,
            system: String,
            code: String
        },
        valueCodeableConcept: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        valueString: String,
        valueRange: {
        },
        valueRatio: {
        },
        valueSampledData: {
        },
        valueAttachment: {
        },
        valueTime: {
        },
        valueDateTime: Date,
        valuePeriod: {
        },
        dataAbsentReason: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        referenceRange: [{
        }]
    }]
});

var observation = mongoose.model('Observation', ObservationSchema);
exports.Observation = observation;