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
 * Demographics and other administrative information about an individualreceiving care or other health-related services. 
 */
var PatientSchema = new mongoose.Schema({
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
    active: Boolean,		// Whether this patient's record is in active use
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
    //	Indicates if the individual is deceased or not
    deceasedBoolean: Boolean,
    deceasedDateTime: Date,
    address: [{
          use : String, 		// home | work | temp | old - purpose of this address
    	  addressType : String,	// postal | physical | both
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
    profession:[String],
    maritalStatus: {			// Marital (civil) status of a patient
        coding: [{
            system: String,
            code: String,
            display: String
        }],
		text : String			// Plain text representation of the concept
    },
    // Whether patient is part of a multiple birth
    multipleBirthBoolean: Boolean,
    multipleBirthInteger: Number,
    photo: [{					// Attached images
		contentType : String, 	// Mime type of the content, with charset etc.
		language : String, 		// Human language of the content (BCP-47)
		data : Buffer, 			// Data inline, base64ed
		url : String, 			// Uri where the data can be found
		size : Number, 			// Number of bytes of content (if url provided)
		hash : Buffer, 			// Hash of the data (sha-1, base64ed)
		title : String, 		// Label to display in place of the data
		creation : Date			// Date attachment was first created	
    }],
    contact: [{					// 	A contact party (e.g. guardian, partner, friend) for the patient
        relationship: [{		// The kind of relationship
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
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
        address: [{				// Address for the contact person
          use : String, 		// home | work | temp | old - purpose of this address
      	  addressType : String, // postal | physical | both
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
        gender: String,
        organization: {			// Organization that is associated with the contact
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        period: {				// The period during which this contact person or organization is valid to be contacted relating to this patient
    		start : Date,
    		end : Date
        }
    }],
    communication: [{		//	A list of Languages which may be used to communicate with the patient about his or her health
        language: {			// The language which can be used to communicate with the patient about his or her health
            coding: [{
                system: String,
                code: String,
                display: String
            }],
    		text : String			// Plain text representation of the concept
        },
        preferred: Boolean	// Language preference indicator
    }],
    careProvider: [{		// Patient's nominated primary care provider
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    }],
    managingOrganization: {	// Organization that is the custodian of the patient record
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
    },
    link: [{					// Link to another patient resource that concerns the same actual person
        other: {				// The other patient resource that the link refers to
    		reference : String, // Relative, internal or absolute URL reference
    		display : String	// Text alternative for the resource
        },
        linkType: String,			// replace | refer | seealso - type of link
    }]
});

var patient =  mongoose.model('Patient', PatientSchema);

exports.Patient = patient;
