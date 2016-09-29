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
 * Concept - reference to a terminology or just text
 */
var CodeableConceptSchema = new mongoose.Schema({
	coding : [ { 				// Code defined by a terminology system
		system : String, 		// Identity of the terminology system
		version : String, 		// Version of the system - if relevant
		code : String, 			// Symbol in syntax defined by the system
		display : String, 		// Representation defined by the system
		userSelected : Boolean 	// If this coding was chosen directly by the user
	} ],
	text : String				// Plain text representation of the concept
});

/**
 * A reference from one resource to another
 */
var ReferenceSchema = new mongoose.Schema({
	reference : String, 		// Relative, internal or absolute URL reference
	display : String			// Text alternative for the resource
});

/**
 * Time range defined by start and end date/time
 */
var PeriodSchema = new mongoose.Schema({
	start : Date,
	end : Date
});

/**
 * An identifier intended for computation
 */
var IdentifierSchema = new mongoose.Schema({
	use : {
		type : String,
		enum : [ 'usual', 'official', 'temp', 'secondary' ],
		required : true,
		default: 'usual'
	},
	idType : CodeableConceptSchema,	// Description of identifier
	system : String, 				// The namespace for the identifier (uri)
	value : String,					// The value that is unique
	period : PeriodSchema,			// Time period when id is/was valid for use
	assigner : ReferenceSchema	 	// Organization that issued id (may be just text)
});

/**
 * A postal address
 */
var AddressSchema = new mongoose.Schema({
    use : {					// purpose of this address
    	type: String,
		enum : [ 'home', 'word', 'temp', 'old' ],
		required : true,
		default: 'home'
    }, 			
    addressType : {
    	type: String,
		enum : [ 'postal', 'physical', 'both'],
		required : true,
		default: 'postal'
    },	
    text : String, 			// Text representation of the address
    line : [String], 		// Street name, number, direction & P.O. Box etc.
    city : String, 			// Name of city, town etc.
    district : String, 		// District name (aka county)
    state : String, 		// Sub-unit of country (abbreviations ok)
    postalCode : String, 	// Postal code for area
    country : String, 		// Country (can be ISO 3166 3 letter code)
    period : PeriodSchema	// Time period when address was/is in use
});

/**
 * 	Details of a Technology mediated contact point (phone, fax, email, etc.)
 */
var ContactPointSchema = new mongoose.Schema({
	  system : {				// C? phone | fax | email | pager | other
		type : String,
		enum : [ 'phone', 'fax', 'email', 'pager', 'other' ],
		required : true,
		default: 'phone'
		}, 		
	  value : String, 			// The actual contact point details
	  use : { 					// purpose of this contact point
		type : String,
		enum : [ 'home', 'work', 'temp', 'old', 'mobile' ],
		required : true,
		default: 'home'
		}, 	
	  rank : Number, 			// Specify preferred order of use (1 = highest)
	  period : PeriodSchema 	// Time period when the contact point was/is in use
});

/**
 * Name of a human - parts and usage
 */
var HumanNameSchema = new mongoose.Schema({ 
    use: { 					
		type : String,
		enum : [ 'usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden' ],
		required : true,
		default: 'usual'
	},
    text: String,		// Text representation of the full name
    family: [String],	// Family name (often called 'Surname')
    given: [String],	// Given names (not always 'first'). Includes middle names
    prefix: [String],	// Parts that come before the name
    suffix: [String],	// Parts that come after the name
    period: PeriodSchema// Time period when name was/is in use
});

var AttachmentSchema = new mongoose.Schema({
	contentType : { 		// Mime type of the content, with charset etc.			
		type : String,
		required : true,
		default: 'image/png'
	}, 	
	language : { 			// Human language of the content (BCP-47)		
		type : String,
		required : true,
		default: 'en'
	}, 	 		
	data : Buffer, 			// Data inline, base64ed
	url : String, 			// Uri where the data can be found
	size : { 				// Number of bytes of content (if url provided)
		type : Number,
		min : 0
	}, 			
	hash : Buffer, 			// Hash of the data (sha-1, base64ed)
	title : String, 		// Label to display in place of the data
	creation : Date			// Date attachment was first created	
});

/**
 * A measured amount (or an amount that can potentially be measured). 
 */
var QuantitySchema = new mongoose.Schema({ 
    value : String,			// Numerical value (with implicit precision)
    comparator : { 			// How to understand the value			
		type : String,
		enum : [ '=', '<', '<=', '>=', '>' ],
		required : true,
		default: '='
	},
    unit : String,			// Unit representation
    system : String,		// System that defines coded unit form
    code : String			// Coded form of the unit
});
/**
 * A set of ordered Quantity values defined by a low and high limit. 
 */
var RangeSchema = new mongoose.Schema({
	low : String, 
	high : String
});

/**
 * A relationship between two Quantity values expressed as a numerator and a denominator. 
 */
var RatioSchema = new mongoose.Schema({
	numerator : QuantitySchema,
	denominator: QuantitySchema
});

/**
 * Data that comes from a series of measurements taken by 
 * a device, with upper and lower limits. 
 * There may be more than one dimension in the data. 
 */
var SampledDataSchema = new mongoose.Schema({
	  origin : String, 			// R!  Zero value and units
	  period : Number, 			// R!  Number of milliseconds between samples
	  factor : Number, 			// Multiply data by this before adding to origin
	  lowerLimit : Number,		// Lower limit of detection
	  upperLimit : Number, 		// Upper limit of detection
	  dimensions : { 			// R!  Number of sample points at each time point
			type : Number,
			min : 0
		}, 	 		
	  data : String 			// R!  Decimal values with spaces, or "E" | "U" | "L"
});

/**
 * A text note which also contains information about who made the statement and when. 
 */
var AnnotationSchema = new mongoose.Schema({
	//	Individual responsible for the annotation
	authorReference : ReferenceSchema,
	authorString: String,
	// When the annotation was made
	time: Date,
	//	The annotation - text content
	text: String
});

/**
 * A timing schedule that specifies an event that may occur multiple times.
 */
var TimingSchema = new mongoose.Schema({	
	event: [Date],			// When the event occurs	
	/*	When the event is to occur
		Either frequency or when can exist, not both
		if there's a duration, there needs to be duration units
		if there's a period, there needs to be period units
		If there's a periodMax, there must be a period
		If there's a durationMax, there must be a duration
	 */
	repeat :{
		// Length/Range of lengths, or (Start and/or end) limits
		boundsQuantity: String,
		boundsRange: RangeSchema,
		boundsPeriod: PeriodSchema,
		duration : Number, 		// How long when it happens
	    durationMax : Number, 	// How long when it happens (Max)
	    durationUnits : {
			type : String,
			enum : [ 's', 'min', 'h', 'd', 'wk', 'mo', 'a' ]
		},
	    frequency : Number, 	// Event occurs frequency times per period
	    frequencyMax : Number, 	// Event occurs up to frequencyMax times per period
	    period : Number, 		// Event occurs frequency times per period
	    periodMax : Number, 	// Upper limit of period (3-4 hours)
	    periodUnits : {
			type : String,
			enum : [ 's', 'min', 'h', 'd', 'wk', 'mo', 'a' ]
		}, 
	    when : String 			// Regular life events the event is tied to    
	},
	code : CodeableConceptSchema// QD | QOD | Q4H | Q6H | BID | TID | QID | AM | PM + (TimingAbbreviation)
});

exports.CodeableConcept = CodeableConceptSchema;
exports.Reference 		= ReferenceSchema;
exports.Period 			= PeriodSchema;
exports.Identifier		= IdentifierSchema;
exports.Address 		= AddressSchema;
exports.ContactPoint	= ContactPointSchema;
exports.HumanName		= HumanNameSchema;
exports.Attachment		= AttachmentSchema;
exports.Quantity		= QuantitySchema;
exports.Range			= RangeSchema;
exports.Ratio			= RatioSchema;
exports.SampledData		= SampledDataSchema;
exports.Annotation		= AnnotationSchema;
exports.Timing			= TimingSchema;