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

var PersonSchema = new mongoose.Schema({
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
    name: {
        use: String,
        text: String,
        family: [String],
        given: [String],
        prefix: [String],
        suffix: [String]
    },
    telecom: [{
	  	  system : {				// C? phone | fax | email | pager | other
				type : String,
				enum : [ 'phone', 'fax', 'email', 'pager', 'other' ],
				required : true
				}, 		
	  	  value : String, 			// The actual contact point details
	  	  use : { 					// home | work | temp | old | mobile - purpose of this contact point
	  		type : String,
				enum : [ 'home', 'work', 'temp', 'old', 'mobile' ],
				required : true
				}, 	
	  	  rank : Number, 			// Specify preferred order of use (1 = highest)
	  	  period : { 				// Time period when the contact point was/is in use
	  		  start: Date, 
	  		  end : Date 
	  		  } 	
    }],
    gender: String,
    birthDate: Date,
    address: [{
	      use : String, 		// home | work | temp | old - purpose of this address
	  	  type : String, 		// postal | physical | both
	  	  text : String, 		// Text representation of the address
	  	  line : [String], 		// Street name, number, direction & P.O. Box etc.
	  	  city : String, 		// Name of city, town etc.
	  	  district : String, 	// District name (aka county)
	  	  state : String, 		// Sub-unit of country (abbreviations ok)
	  	  postalCode : String, 	// Postal code for area
	  	  country : String, 	// Country (can be ISO 3166 3 letter code)
	  	  period : { 			// Time period when address was/is in use
	  		  	start: Date, 
	  		  	end: Date 
	  	  } 
    }],
    photo: {
    },
    managingOrganization: {
    },
    active: Boolean,
    link: [{
        target: {
        },
        assurance: String,
    }]
});

var person = mongoose.model('Person', PersonSchema);

exports.Person = person;
