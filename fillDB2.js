var db = connect("localhost:27017/institution");

db.users.drop();
db.ehroptions.drop();
db.patients.drop();
db.practitioners.drop();
db.conditions.drop();
db.encounters.drop();
db.locations.drop();
db.medicationorders.drop();
db.diagnosticreports.drop();
db.observations.drop();
db.resourcehistorys.drop();

var id1 = ObjectId();
var id2 = ObjectId();
var id3 = ObjectId();
var id4 = ObjectId();
var idi = ObjectId();
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
var id20 = ObjectId();
var id21 = ObjectId();
var id22 = ObjectId();
var id23 = ObjectId();
var id24 = ObjectId();
var id258 = ObjectId();
var id259 = ObjectId();
var id333 = ObjectId();
var id777 = ObjectId();
var id666 = ObjectId();

// ********************************************************************
db.medicationorders.insert([ {
	_id : id22,
	dateWritten : new Date(2000, 03, 15),
	status : "active",
	patient : {
		reference : "Patient/" + id5.str,
		display : "Jean DUPONT"
	},
	prescriber : {
		reference : "Practitioner/" + id4.str,
		display : "Dr. Gregory HOUSE"
	},
	note : "...",
	reasonCodeableConcept : {
		coding : [ {
			display : "diabète"
		} ]
	},
	medicationCodeableConcept : {
		coding : [ {
			display : "Medicament XX"
		} ]
	},
	dosageInstruction : [ {
		text : "1 injection de X ml, trois fois par jour"
	} ]
}, {
	_id : id23,
	dateWritten : new Date(2000, 03, 15),
	status : "active",
	patient : {
		reference : "Patient/" + id6.str,
		display : "Marie DUPUIS"
	},
	prescriber : {
		reference : "Practitioner/" + id4.str,
		display : "Dr. Gregory HOUSE"
	},
	note : "...",
	reasonCodeableConcept : {
		coding : [ {
			display : "diabète"
		} ]
	},
	medicationCodeableConcept : {
		coding : [ {
			display : "Medicament XX"
		} ]
	},
	dosageInstruction : [ {
		text : "1 injection de X ml, trois fois par jour"
	} ]
}, {
	_id : id24,
	dateWritten : new Date(1995, 03, 15),
	status : "completed",
	dateEnded : new Date(2000, 03, 15),
	patient : {
		reference : "Patient/" + id5.str,
		display : "Jean DUPONT"
	},
	prescriber : {
		reference : "Practitioner/" + id4.str,
		display : "Dr. Gregory HOUSE"
	},
	note : "...",
	reasonCodeableConcept : {
		coding : [ {
			display : "diabète"
		} ]
	},
	medicationCodeableConcept : {
		coding : [ {
			display : "Medicament YY"
		} ]
	},
	dosageInstruction : [ {
		text : "1 injection de X ml, quatre fois par jour"
	} ]
} ]);
// ********************************************************************
db.ehroptions.insert([ {
	name : "diabHistory",
	url : "views/ehrOptions/diabHistory.html"
}, {
	name : "bloodTests",
	url : "views/ehrOptions/bloodTests.html"
}, {
	name : "currentTreatments",
	url : "views/ehrOptions/currentTreatments.html"
}, {
	name : "treatmentHistory",
	url : "views/ehrOptions/treatmentsHistory.html"
}, {
	name : "personalHistory",
	url : "views/ehrOptions/personalHistory.html"
}, {
	name : "conditions",
	url : "views/ehrOptions/conditions.html"
}, {
	name : "riskFactors",
	url : "views/ehrOptions/riskFactors.html"
} ]);

// ********************************************************************
db.locations
		.insert({
			_id : id20,
			name : "Saint-Luc",
			description : "Hopital",
			fhirType : {
				coding : [ {
					system : "http://hl7.org/fhir/ValueSet/v3-ServiceDeliveryLocationRoleType",
					code : "HOSP",
					display : "Hopital"
				} ]
			},
			address : {
				use : "work",
				type : "physical",
				text : "13 Rue des Macarons, 3000 Bruxelles"
			},
			physicalType : {
				coding : [ {
					system : "http://hl7.org/fhir/location-physical-type",
					code : "bu",
					display : "Bâtiment"
				} ]
			},
			mode : "instance",
		});

// ********************************************************************
db.practitioners.insert({
	_id : id3,
	identifier : [ {
		use : "official",
		value : "0",
		assigner : "JC"
	} ],
	name : {
		family : [ "House" ],
		given : [ "Gregory" ]
	},
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

// ********************************************************************
db.patients.insert([ {
	_id : idi,
	identifier : [ {
		use : "official",
		value : "0",
		assigner : "JC"
	} ],
	name : {
		family : [ "Duprés" ],
		given : [ "Xavier" ]
	},
	photo : [ {
		url : "/img/avatar/male1.png"
	} ],
	profession : [ "Fermier" ],
	telecom : [ {
		system : "phone",
		value : "04/339.87.45",
		use : "home"
	} ],
	birthDate : new Date(1970, 03, 15),
	careProvider : [ {
		reference : "Practitioner/" + id4.str,
		display : "Jean-Marie Dutronc, Diabétologue"
	} ]
}, {
	_id : id1,
	identifier : [ {
		use : "official",
		value : "0",
		assigner : "JC"
	} ],
	name : {
		family : [ "Dupont" ],
		given : [ "Jean" ]
	},
	photo : [ {
		url : "/img/avatar/male1.png"
	} ],
	profession : [ "Charpentier" ],
	telecom : [ {
		system : "phone",
		value : "04/339.87.40",
		use : "home"
	} ],
	birthDate : new Date(1980, 03, 15),
	careProvider : [ {
		reference : "Practitioner/" + id4.str,
		display : "Jean-Marie Dutronc, Diabétologue"
	} ]
}, {
	_id : id2,
	identifier : [ {
		use : "official",
		value : "1",
		assigner : "JC"
	} ],
	name : {
		family : [ "Dupuis" ],
		given : [ "Marie" ]
	},
	photo : [ {
		url : "/img/avatar/female1.png"
	} ],
	profession : [ "Institutrice" ],
	telecom : [ {
		system : "phone",
		value : "04/111.22.33",
		use : "home"
	} ],
	birthDate : new Date(1985, 04, 20),
	careProvider : [ {
		reference : "Practitioner/" + id4.str,
		display : "Jean-Marie Dutronc, Diabétologue"
	} ]
} ]);

// ********************************************************************

db.users.insert({
	reference : [ "Practitioner/" + id4.str ],
	access : [ {
		id : "Patient/" + id5.str
	}, {
		id : "Patient/" + id6.str
	} ]
});

// ********************************************************************

db.conditions.insert([ {
	_id : id15,
	patient : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	encounter : {
		reference : "Encounter/" + id10.str
	},
	asserter : {
		reference : "Practitioner/" + id4.str,
		display : "Dutronc Jean-Marie"
	},
	dateRecorded : new Date(),
	code : {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "267384006",
			display : "Coma hypoglycemic"
		} ]
	},
	category : {
		coding : [ {
			system : "http://hl7.org/fhir/condition-category",
			code : "symptom",
			display : "Symptôme"
		} ]
	},
	clinicalStatus : "resolved",
	verificationStatus : "confirmed",
	onsetDateTime : new Date(1995, 03, 15),
	evidence : [ {
		code : {
			coding : [ {
				system : "http://snomed.info/sct",
				code : "17173007",
				display : "Soif excessive"
			} ],
			coding : [ {
				system : "http://snomed.info/sct",
				code : "272060000",
				display : "Fatigue"
			} ],
			coding : [ {
				system : "http://snomed.info/sct",
				code : "89362005",
				display : "Perte de poids"
			} ],
			coding : [ {
				system : "http://snomed.info/sct",
				code : "371632003",
				display : "Coma"
			} ]
		}
	} ]
}, {
	_id : id11,
	patient : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	encounter : {
		reference : "Encounter/" + id10.str
	},
	asserter : {
		reference : "Practitioner/" + id4.str,
		display : "Dutronc Jean-Marie"
	},
	dateRecorded : new Date(),
	code : {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "46635009",
			display : "Diabetes mellitus type 1"
		} ]
	},
	category : {
		coding : [ {
			system : "http://hl7.org/fhir/condition-category",
			code : "diagnosis",
			display : "Diagnostic"
		} ]
	},
	clinicalStatus : "active",
	verificationStatus : "confirmed",
	onsetDateTime : new Date(1995, 03, 15),
	evidence : [ {
		code : {
			coding : [ {
				system : "http://snomed.info/sct",
				code : "17173007",
				display : "Soif excessive"
			} ]
		}
	}, {
		code : {
			coding : [ {
				system : "http://snomed.info/sct",
				code : "272060000",
				display : "Fatigue"
			} ]
		}
	}, {
		code : {
			coding : [ {
				system : "http://snomed.info/sct",
				code : "89362005",
				display : "Perte de poids"
			} ]
		}
	} ],
	bodySite : [ {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "181277001",
			display : "Pancreas"
		} ]
	} ]
}, {
	_id : id12,
	patient : {
		reference : "Patient/" + id6.str,
		display : "Marie Dupuis"
	},
	encounter : {
		reference : "Encounter/" + id8.str
	},
	asserter : {
		reference : "Practitioner/" + id4.str,
		display : "Dutronc Jean-Marie"
	},
	dateRecorded : new Date(),
	code : {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "46635009",
			display : "Diabetes mellitus type 1"
		} ]
	},
	category : {
		coding : [ {
			system : "http://hl7.org/fhir/condition-category",
			code : "diagnosis",
			display : "Diagnostic"
		} ]
	},
	clinicalStatus : "active",
	verificationStatus : "confirmed",
	onsetDateTime : new Date(1998, 03, 15),
	evidence : [ {
		code : {
			coding : [ {
				system : "http://snomed.info/sct",
				code : "17173007",
				display : "Soif excessive"
			} ]
		}
	}, {
		code : {
			coding : [ {
				system : "http://snomed.info/sct",
				code : "272060000",
				display : "Fatigue"
			} ]
		}

	} ],
	bodySite : [ {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "181277001",
			display : "Pancreas"
		} ]
	} ]
} ]);

// ********************************************************************

db.observations.insert([ {
	_id : id258,
	status : "final",
	category : {
		coding : [ {
			system : "http://hl7.org/fhir/ValueSet/observation-category",
			code : "social-history",
			display : "Histoire sociale"
		} ]
	},
	code : {
		coding : [ {
			system : "http://loinc.org",
			code : "11367-0",
			display : "Historique de consommation de tabac"
		} ]
	},
	subject : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	issued : new Date(2015, 11, 12),
	valueCodeableConcept : {
		coding : [ {
			system : "http://loinc.org",
			code : "LA18981-3",
			display : "Gros fumeur"
		} ]
	},
	valueString : "2 à 3 paquets par jour"
}, {
	_id : id259,
	status : "final",
	category : {
		coding : [ {
			system : "http://hl7.org/fhir/ValueSet/observation-category",
			code : "risk-factor",
			display : "Facteur de risque"
		} ]
	},
	code : {
		coding : [ {
			system : "http://loinc.org",
			code : "72166-2",
			display : "Status de la consommation de tabac"
		} ]
	},
	subject : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	issued : new Date(2015, 11, 12),
	valueCodeableConcept : {
		coding : [ {
			system : "http://loinc.org",
			code : "LA18981-3",
			display : "Gros fumeur"
		} ]
	},
	valueString : "2 à 3 paquets par jour"
}, {
	_id : id333,
	status : "final",
	category : {
		coding : [ {
			system : "http://hl7.org/fhir/ValueSet/observation-category",
			code : "laboratory",
			display : "Résultat de laboratoire"
		} ]
	},
	code : {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "43396009",
			display : "Hemoglobin A1c measurement (procedure)"
		} ]
	},
	subject : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	issued : new Date(2015, 11, 12),
    effectiveDateTime: new Date(2016, 01, 01),
	valueQuantity : {
        value: '9',
        units: '%'
	},
    interpretation: {			// High, low, normal, etc.
        coding: [{
            system: "http://snomed.info/sct",
            code: "165680008",
            display: "Hemoglobin A1c between 7%-10% indicating borderline diabetic control (finding)"
        }]
    }
} ]);
// ********************************************************************

db.encounters.insert([ {
	_id : id7,
	classCode : "ambulatory",
	patient : {
		reference : "Patient/" + id6.str,
		display : "Marie Dupuis"
	},
	reason : [ {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "17173007",
			display : "Soif excessive"
		} ]
	}, {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "272060000",
			display : "Fatigue"
		} ]
	} ]
}, {
	_id : id9,
	classCode : "inpatient",
	patient : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	reason : [ {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "371632003",
			display : "Coma"
		} ]
	} ],
	hospitalization : {
		admittingDiagnosis : [ {
			reference : "Condition/" + id16.str
		} ],
		dischargeDiagnosis : [ {
			reference : "Condition/" + id13.str
		} ]
	},
	location : [ {
		location : {
			reference : "Location/" + id21.str,
			display : "Hopital Saint-Luc"
		},
		status : "completed",
		period : {
			start : new Date(1995, 05, 15),
			end : new Date(1995, 05, 20)
		}
	} ]
} ]);

// ********************************************************************

db.diagnosticreports.insert([ {
	_id : id777,
	status : "final",
	subject : {
		reference : "Patient/" + id5.str,
		display : "Jean Dupont"
	},
	encounter : {
		reference : "Encounter/" + id8.str,
		display : "Consultation du 15-05-1995"
	},
	effectiveDateTime : new Date(1998, 03, 15),
	issued : new Date(1998, 07, 15),
	performer : {
		reference : "Practitioner/" + id4.str,
		display : "Dutronc Jean-Marie"
	},
	conclusion : "Le patient souffre de diabète de typ 1",
	codedDiagnosis : [ {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "444073006",
			display : "Type I diabetes mellitus uncontrolled"
		} ]
	} ]
}, {
	_id : id666,
	status : "final",
	subject : {
		reference : "Patient/" + id6.str,
		display : "Jean Dupont"
	},
	encounter : {
		reference : "Encounter/" + id10.str,
		display : "Hopital Saint-Luc, le 15-05-1995"
	},
	effectiveDateTime : new Date(1995, 05, 15),
	issued : new Date(1995, 05, 15),
	performer : {
		reference : "Practitioner/" + id4.str,
		display : "Dutronc Jean-Marie"
	},
	conclusion : "Le patient souffre de diabète de typ 1",
	codedDiagnosis : [ {
		coding : [ {
			system : "http://snomed.info/sct",
			code : "444073006",
			display : "Type I diabetes mellitus uncontrolled"
		} ]
	} ]
} ]);

db.resourcehistorys.insert([ {
	_id : id4,
	resourceType : "Practitioner",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id3,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id5,
	resourceType : "Patient",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id1,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id6,
	resourceType : "Patient",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id2,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id8,
	resourceType : "Encounter",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id7,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id10,
	resourceType : "Encounter",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id9,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id13,
	resourceType : "Condition",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id11,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id14,
	resourceType : "Condition",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id12,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id16,
	resourceType : "Condition",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id15,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	_id : id21,
	resourceType : "Location",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id20,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "Patient",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : idi,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "DiagnosticReport",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id777,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "DiagnosticReport",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id666,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "Observation",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id258,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "Observation",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id259,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "Observation",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id333,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "MedicationOrder",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id22,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "MedicationOrder",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id23,
		updatedBy : "Practitioner/" + id4.str
	} ]
}, {
	resourceType : "MedicationOrder",
	createdBy : "Practitioner/" + id4.str,
	history : [ {
		resourceId : id24,
		updatedBy : "Practitioner/" + id4.str
	} ]
} ]);
