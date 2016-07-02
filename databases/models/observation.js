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
    status: String,			// registered | preliminary | final | amended +
    category: {				// Classification of type of observation: 
    						// social-history, vital-signs, imaging, laboratory, procedure, survey, exam, therapy
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    code: {					// Type of observation (code / type)
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    subject: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    encounter: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    effectiveDateTime: Date,	// Clinically relevant time/time-period for observation
    effectivePeriod: {
		start : Date,
		end : Date
    },
    issued: Date,
    performer: [{
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    // Actual result
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
		low : String, 
		high : String
    },
    valueRatio: {
    	numerator: {
    		  value : Number, 				// Numerical value (with implicit precision)
    		  unit : String, 				// Unit representation
    		  system : String, 				// C? System that defines coded unit form
    		  code : String 				// Coded form of the unit    		
    	},
    	denominator: {
  		  value : Number, 				// Numerical value (with implicit precision)
		  unit : String, 				// Unit representation
		  system : String, 				// C? System that defines coded unit form
		  code : String 				// Coded form of the unit    	    		
    	}
    },
    valueSampledData: {
    	  origin : String, 			// R!  Zero value and units
    	  period : Number, 			// R!  Number of milliseconds between samples
    	  factor : Number, 			// Multiply data by this before adding to origin
    	  lowerLimit : Number,		// Lower limit of detection
    	  upperLimit : Number, 		// Upper limit of detection
    	  dimensions : Number, 		// R!  Number of sample points at each time point
    	  data : String 			// R!  Decimal values with spaces, or "E" | "U" | "L"
    },
    valueAttachment: {
		contentType : String, 	// Mime type of the content, with charset etc.
		language : String, 		// Human language of the content (BCP-47)
		data : Buffer, 			// Data inline, base64ed
		url : String, 			// Uri where the data can be found
		size : Number, 			// Number of bytes of content (if url provided)
		hash : Buffer, 			// Hash of the data (sha-1, base64ed)
		title : String, 		// Label to display in place of the data
		creation : Date			// Date attachment was first created	
    },
    valueTime: String,
    valueDateTime: Date,
    valuePeriod: {
		start : Date,
		end : Date
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
    comments: String,		// Comments about result
    bodySite: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    method: {				// How it was done
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    specimen: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    device: {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    referenceRange: [{		// Provides guide for interpretation
    						// Must have at least a low or a high or text
        low: String,
        high: String,
        meaning: {			// Indicates the meaning/use of this range of this range
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        age: {				// Applicable age range, if relevant
            low: String,
            high: String,
        },
        text: String,		// Text based reference range in an observation
    }],
    related: [{				// Resource related to this observation
        fhirType: String,	// has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by
        target: {
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        }
    }],
    component: [{				// 	Component results
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
    		low : String, 
    		high : String
        },
        valueRatio: {
        	  numerator: {
      		  value : Number, 				// Numerical value (with implicit precision)
      		  unit : String, 				// Unit representation
      		  system : String, 				// C? System that defines coded unit form
      		  code : String 				// Coded form of the unit    		
	      	},
	      	denominator: {
	    		  value : Number, 				// Numerical value (with implicit precision)
	  		  unit : String, 				// Unit representation
	  		  system : String, 				// C? System that defines coded unit form
	  		  code : String 				// Coded form of the unit    	    		
	      	}
        },
        valueSampledData: {
    	  origin : String, 			// R!  Zero value and units
    	  period : Number, 			// R!  Number of milliseconds between samples
    	  factor : Number, 			// Multiply data by this before adding to origin
    	  lowerLimit : Number,		// Lower limit of detection
    	  upperLimit : Number, 		// Upper limit of detection
    	  dimensions : Number, 		// R!  Number of sample points at each time point
    	  data : String 			// R!  Decimal values with spaces, or "E" | "U" | "L"
	    },
	    valueAttachment: {
			contentType : String, 	// Mime type of the content, with charset etc.
			language : String, 		// Human language of the content (BCP-47)
			data : Buffer, 			// Data inline, base64ed
			url : String, 			// Uri where the data can be found
			size : Number, 			// Number of bytes of content (if url provided)
			hash : Buffer, 			// Hash of the data (sha-1, base64ed)
			title : String, 		// Label to display in place of the data
			creation : Date			// Date attachment was first created	
        },
        valueTime: String,
        valueDateTime: Date,
        valuePeriod: {
    		start : Date,
    		end : Date
        },
        dataAbsentReason: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        referenceRange: [{	// Provides guide for interpretation
			// Must have at least a low or a high or text
            low: String,
            high: String,
            meaning: {			// Indicates the meaning/use of this range of this range
                coding: [{
                    system: String,
                    code: String,
                    display: String
                }]
            },
            age: {				// Applicable age range, if relevant
                low: String,
                high: String,
            },
            text: String,		// Text based reference range in an observation
        }]
    }]
});

var observation = mongoose.model('Observation', ObservationSchema);
exports.Observation = observation;