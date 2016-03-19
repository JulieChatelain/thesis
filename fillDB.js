var db = connect("localhost:27017/institution");

db.User.drop();
db.EHROption.drop();
db.Patient.drop();
db.Practitioner.drop();
db.Condition.drop();
db.Encounter.drop();
db.Location.drop();
db.ResourceHistory.drop();

var id3 = ObjectId();
var id20 = ObjectId();
var id21 = ObjectId();

db.location.insert(
		{
			_id: id20,
		    name: "Saint-Luc",
		    description: "Hopital",
		    fhirType: {
		        coding: [{
		            system: "http://hl7.org/fhir/ValueSet/v3-ServiceDeliveryLocationRoleType",
		            code: "HOSP",
		            display: "Hopital"
		        }]
		    },
		    address: {
		    	use: "work",
		    	type: "physical",
		    	text: "13 Rue des Macarons, 3000 Bruxelles"
		    },
		    physicalType: {
		        coding: [{
		            system: "http://hl7.org/fhir/location-physical-type",
		            code: "bu",
		            display: "Bâtiment"
		        }]
		    },
		    mode: "instance",
		}
);

db.practitioner.insert({
	_id : id3,
	identifier : [ {
		use : "official",
		value : "0",
		assigner : "JC"
	} ],
	name : [ {
		family : [ "Dutronc" ],
		given : [ "Jean-Marie" ]
	} ],
	photo : [ {
		url : "/img/avatar/male1.png"
	} ],
	telecom : [ {
		system : "phone",
		value : "04/330.87.40"
	} ],
	birthDate : new Date(1970, 03, 15),
	practitionerRole : [ {
		role : {
			coding : [ {
				system : "http://hl7.org/fhir/practitioner-role",
				code : "doctor",
				display : "Médecin"
			} ]
		},
		specialty : [ {
			coding : [ {
				code : "diabetologist",
				display : "Diabetologue"
			} ]
		} ]
	} ]

});

db.EHROption.insert([ {
	name : "Histoire du diabète",
	url : "views/ehrOptions/diabHistory.html"
}, {
	name : "Traitements en cours",
	url : "views/ehrOptions/currentTreatments.html"
}, {
	name : "Historique des traitements",
	url : "views/ehrOptions/treatmentsHistory.html"
}, {
	name : "Antécédents principaux",
	url : "views/ehrOptions/mainHistory.html"
}, {
	name : "Antécédents personnels",
	url : "views/ehrOptions/personalHistory.html"
}, {
	name : "Antécédents familiaux",
	url : "views/ehrOptions/familyHistory.html"
}, {
	name : "Prises de sang",
	url : "views/ehrOptions/bloodTests.html"
}, {
	name : "Complications",
	url : "views/ehrOptions/complications.html"
}, {
	name : "Facteurs de risque",
	url : "views/ehrOptions/riskFactors.html"
}, {
	name : "Maladies actuelles",
	url : "views/ehrOptions/conditions.html"
}, ]);

var id1 = ObjectId();
var id2 = ObjectId();

db.Patient.insert([ {
	_id : id1,
	identifier : [ {
		use : "official",
		value : "0",
		assigner : "JC"
	} ],
	name : [ {
		family : [ "Dupont" ],
		given : [ "Jean" ]
	} ],
	photo : [ {
		url : "/img/avatar/male1.png"
	} ],
	profession : [ "Charpentier" ],
	telecom : [ {
		system : "phone",
		value : "04/339.87.40"
	} ],
	birthDate : new Date(1980, 03, 15)
}, {
	_id : id2,
	identifier : [ {
		use : "official",
		value : "1",
		assigner : "JC"
	} ],
	name : [ {
		family : [ "Dupuis" ],
		given : [ "Marie" ]
	} ],
	photo : [ {
		url : "/img/avatar/female1.png"
	} ],
	profession : [ "Institutrice" ],
	telecom : [ {
		system : "phone",
		value : "04/111.22.33"
	} ],
	birthDate : new Date(1985, 04, 20)
} ]);

var id4 = ObjectId();
var id5 = ObjectId();
var id6 = ObjectId();

var id7 = ObjectId();
var id8 = ObjectId();
var id9 = ObjectId();
var id10 = ObjectId();
var id11 = ObjectId();
var id12 = ObjectId();
var id13 = ObjectId();
var id14 = ObjectId();
var id15 = ObjectId();
var id16 = ObjectId();



db.User.insert({
	refId : [id4],
	patients : [id5,id6]
});

db.Condition.insert([
	{
		_id: id15,
		patient: {
			reference: "Patient/"+ id5.str,
			display: "Jean Dupont"
	    },
	    encounter: {
			reference: "Encounter/"+ id10.str
	    },
	    asserter: {
			reference: "Practitioner/"+ id4.str,
			display: "Dutronc Jean-Marie"
	    },
	    dateRecorded: new Date(),
	    code: {
	        coding: [{
	            system: "http://snomed.info/sct",
	            code: "267384006",
	            display: "Coma hypoglycemic"
	        }]
	    },
	    category: {
	        coding: [{
	            system: "http://hl7.org/fhir/condition-category",
	            code: "symptom",
	            display: "Symptôme"
	        }]
	    },
	    clinicalStatus: "resolved",
	    verificationStatus: "confirmed",
	    onsetAge: {
	        value: "15",
	        units: "year",
	        system: "http://unitsofmeasure.org/ucum.html",
	        code: "a"
	    },
	    evidence: [{
	        code: {
	            coding: [{
	                system: "http://snomed.info/sct",
	                code: "17173007",
	                display: "Soif excessive"
	            }],
	            coding: [{
	                system: "http://snomed.info/sct",
	                code: "272060000",
	                display: "Fatigue"
	            }],
	            coding: [{
	                system: "http://snomed.info/sct",
	                code: "89362005",
	                display: "Perte de poids"
	            }],
	            coding: [{
	                system: "http://snomed.info/sct",
	                code: "371632003",
	                display: "Coma"
	            }]
	        }
	    }]
	},
    {
    	_id: id11,
    	patient: {
    		reference: "Patient/"+ id5.str,
    		display: "Jean Dupont"
        },
        encounter: {
			reference: "Encounter/"+ id10.str
        },
        asserter: {
			reference: "Practitioner/"+ id4.str,
			display: "Dutronc Jean-Marie"
        },
        dateRecorded: new Date(),
        code: {
            coding: [{
                system: "http://snomed.info/sct",
                code: "46635009",
                display: "Diabetes mellitus type 1"
            }]
        },
        category: {
            coding: [{
                system: "http://hl7.org/fhir/condition-category",
                code: "diagnosis",
                display: "Diagnostic"
            }]
        },
        clinicalStatus: "active",
        verificationStatus: "confirmed",
        onsetAge: {
            value: "15",
            units: "year",
            system: "http://unitsofmeasure.org/ucum.html",
            code: "a"
        },
        evidence: [{
            code: {
                coding: [{
                    system: "http://snomed.info/sct",
                    code: "17173007",
                    display: "Soif excessive"
                }],
                coding: [{
                    system: "http://snomed.info/sct",
                    code: "272060000",
                    display: "Fatigue"
                }],
                coding: [{
                    system: "http://snomed.info/sct",
                    code: "89362005",
                    display: "Perte de poids"
                }]
            }
        }],
        bodySite: [{
            coding: [{
                system: "http://snomed.info/sct",
                code: "181277001",
                display: "Pancreas"
            }]
        }]
    },
    {
    	_id: id12,
    	patient: {
    		reference: "Patient/"+ id6.str,
    		display: "Marie Dupuis"
        },
        encounter: {
    		reference: "Encounter/"+ id8.str
        },
        asserter: {
			reference: "Practitioner/"+ id4.str,
			display: "Dutronc Jean-Marie"
        },
        dateRecorded: new Date(),
        code: {
            coding: [{
                system: "http://snomed.info/sct",
                code: "46635009",
                display: "Diabetes mellitus type 1"
            }]
        },
        category: {
            coding: [{
                system: "http://hl7.org/fhir/condition-category",
                code: "diagnosis",
                display: "Diagnostic"
            }]
        },
        clinicalStatus: "active",
        verificationStatus: "confirmed",
        onsetAge: {
            value: "10",
            units: "year",
            system: "http://unitsofmeasure.org/ucum.html",
            code: "a"
        },
        evidence: [{
            code: {
                coding: [{
                    system: "http://snomed.info/sct",
                    code: "17173007",
                    display: "Soif excessive"
                }],
                coding: [{
                    system: "http://snomed.info/sct",
                    code: "272060000",
                    display: "Fatigue"
                }]
            }
        }],
        bodySite: [{
            coding: [{
                system: "http://snomed.info/sct",
                code: "181277001",
                display: "Pancreas"
            }]
        }]
    }
]);

db.Encounter.insert([{
	_id: id7,
	class: "ambulatory",
	patient: {
		reference: "Patient/"+ id6.str,
		display: "Marie Dupuis"
	},
	reason: [
	    {
        coding: [{
            system: "http://snomed.info/sct",
            code: "17173007",
            display: "Soif excessive"
        }]},
        {
        coding: [{
            system: "http://snomed.info/sct",
            code: "272060000",
            display: "Fatigue"
        }]}
        ]
	},{
	_id: id9,
	class: "inpatient",
	patient: {
		reference: "Patient/"+ id5.str,
		display: "Jean Dupont"
	},
	reason: [{
		coding: [{
            system: "http://snomed.info/sct",
            code: "371632003",
            display: "Coma"
        }]
	}],
    hospitalization: {
       admittingDiagnosis: [{
    	   reference: "Condition/"+id16.str
        }],
        dischargeDiagnosis: [{
        	reference: "Condition/"+id13.str
        }]
    },
    location: [{
        location: {
        	reference: "Location/"+id21.str,
        	display: "Hopital Saint-Luc"
        },
        status: "completed",
        period: {
        	start: new Date(1995, 05, 15),
        	end: new Date(1995, 05, 20)
        }
    }]
	}             
]);

db.ResourceHistory.insert([ 
       {
   		_id : id4,
   		resourceType : "Practitioner",
   		history : [{
   			resourceId : id3,
   			addedBy : id4}]
       },
       {
       	_id : id5,
       	resourceType: "Patient",
       	history : [{
       		resourceId : id1,
       		addedBy : id4
       	}]
       },
       {
       	_id : id6,
       	resourceType: "Patient",
       	history : [{
       		resourceId : id2,
       		addedBy : id4
       	}]
       },
       {
      	_id : id8,
      	resourceType: "Encounter",
      	history : [{
      		resourceId : id7,
      		addedBy : id4
      	}]
      },
      {
    	_id : id10,
    	resourceType: "Encounter",
    	history : [{
    		resourceId : id9,
    		addedBy : id4
    	}]
      },
      {
      	_id : id13,
      	resourceType: "Condition",
      	history : [{
      		resourceId : id11,
      		addedBy : id4
      	}]
      },
      {
    	_id : id14,
    	resourceType: "Condition",
    	history : [{
    		resourceId : id12,
    		addedBy : id4
    	}]
      },
      {
      	_id : id16,
      	resourceType: "Condition",
      	history : [{
      		resourceId : id15,
      		addedBy : id4
      	}]
      },
      {
    	_id : id21,
    	resourceType: "Location",
    	history : [{
    		resourceId : id20,
    		addedBy : id4
    	}]
       }
   ]);
