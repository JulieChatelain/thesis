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
 * Specific and identified anatomical location <br>
 * Record details about the anatomical location of a specimen or body part. This
 * resource may be used when a coded concept does not provide the necessary
 * detail needed for the use case.
 */

var BodySiteSchema = new mongoose.Schema({
	patient : {
		reference : String, // Relative, internal or absolute URL reference
		display : String	// Text alternative for the resource
	
	},
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
	code : { 				// Named anatomical location
		coding : [ {
			system : String, 	// Identity of the terminology system (uri)
			code : String, 		// Symbol in syntax defined by the system
			display : String	// Representation defined by the system
		
		} ],
		text : String			// Plain text representation of the concept
	
	},
	modifier : [ { 				// Modification to location code
		coding : [ { 			// ex: 419465000 Unilateral right
			system : String, 	// Identity of the terminology system (uri)
			code : String, 		// Symbol in syntax defined by the system
			display : String	// Representation defined by the system
		
		} ],
		text : String			// Plain text representation of the concept
	
	} ],
	description : String, 		// The Description of anatomical location
	image : [ { 				// Attached images
		contentType : String, 	// Mime type of the content, with charset etc.
		language : String, 		// Human language of the content (BCP-47)
		data : Buffer, 			// Data inline, base64ed
		url : String, 			// Uri where the data can be found
		size : Number, 			// Number of bytes of content (if url provided)
		hash : Buffer, 			// Hash of the data (sha-1, base64ed)
		title : String, 		// Label to display in place of the data
		creation : Date			// Date attachment was first created	
	} ]
});

var bodysite = mongoose.model('BodySite', BodySiteSchema);
exports.BodySite = bodysite;