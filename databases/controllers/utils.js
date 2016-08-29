var mongoose = require('mongoose');

/**
 * ----------------------------------------------------------------------- Check
 * if a resource is empty
 * -----------------------------------------------------------------------
 */
var isEmpty = function(resource) {

	if (resource == null || resource == 'undefined' || resource == ''
			|| resource == 'NULL') {
		return true;
	}
	if (typeof resource === 'string' || typeof resource === 'number') {
		return false;
	}

	var stringResource = JSON.stringify(resource);

	if (stringResource.charAt(0) == "[") {
		var len = resource.length;
		for (var i = 0; i < len; i++) {
			if (isEmpty(resource[i]) == false) {
				return false;
			}
		}
		return true;
	} else if (stringResource.charAt(0) == "{") {

		for ( var property in resource) {
			if (isEmpty(resource[property]) == false)
				return false;
		}
		return true;
	}
	return false;
};
exports.isEmpty = isEmpty;

/**
 * -----------------------------------------------------------------------
 * Convert a codeable concept resource to text.
 * -----------------------------------------------------------------------
 */
var getCodeableConcept = function(cc) {
	if ("text" in cc && cc.text != "") {
		return code.text;
	}
	var codes = cc.coding;
	var len = codes.length;
	for (var i = 0; i < len; i++) {
		var code = codes[i];
		if ("display" in code && code.display != "") {
			return code.display;
		}
	}
	return "";
};

/**
 * -----------------------------------------------------------------------
 * Convert a range resource to text.
 * -----------------------------------------------------------------------
 */
var getRange = function(range, res) {
	var rangeString = "";
	if ("low" in range && !isEmpty(range.low)) {
		if ("value" in range.low)
			rangeString += range.low.value;
		if ("unit" in range.low && range.low.unit != '')
			rangeString += " " + range.low.unit;
	}
	if ("high" in range && !isEmpty(range.high)) {
		if ("value" in range.high)
			rangeString += " " + res.__('XtoY') + " " + range.high.value;
		if ("unit" in range.high && range.high.unit != '')
			rangeString += " " + range.high.unit;
	}

	return rangeString;
};
/**
 * -----------------------------------------------------------------------
 * Convert a reference resource to text.
 * -----------------------------------------------------------------------
 */
var getReference = function(r, linkName, res, host) {
	var rString = "";
	if (isEmpty(r)) {
		return rString;
	}
	if ("reference" in r && r.reference != '')
		rString += "<a href='" + host + "/ehr/" + r.reference + "'>";
	if ("display" in r && r.display != '')
		rString += r.display;
	else if (linkName != null)
		rString += linkName;
	else
		rString += r.reference;
	rString += "</a>";

	return rString;
};
/**
 * -----------------------------------------------------------------------
 * Convert a timing resource to text.<br>
 * frequency per period for duration
 * -----------------------------------------------------------------------
 */
var getTiming = function(timing, res) {
	var timingString = "";
	// frequency
	if ("frequency" in timing) {
		timingString += timing.frequency;
		if ("frequencyMax" in timing)
			timingString += " " + res._('XtoY') + " " + timing.frequencyMax;
		timingString += " " + res.__('times');
	}
	// period
	if ("periodUnits" in timing) {
		timingString += " " + res.__('per');
		if ("period" in timing) {
			timingString += " " + timing.period;
			if ("periodMax" in timing)
				timingString += " " + res._('XtoY') + " " + timing.periodMax;
		}
		timingString += " " + res.__(timing.periodUnits);
	}
	// duration
	if ("durationUnits" in timing) {
		timingString += " " + res.__('for');
		if ("duration" in timing) {
			timingString += " " + timing.duration;
			if ("durationMax" in timing)
				timingString += " " + res._('XtoY') + " " + timing.durationMax;
		}
		timingString += " " + res.__(timing.durationUnits);
	}
	// when
	if ("when" in timing && timing.when != '') {
		timingString += " " + res.__('when') + " " + res.__(timing.when);
	}
};
/**
 * -----------------------------------------------------------------------
 * Convert ratio resource to text.
 * -----------------------------------------------------------------------
 */
var getRatio = function(ratio, res) {
	var ratioString = "";
	if ("numerator" in ratio && !isEmpty(ratio.numerator)) {
		var nd = ratio.numerator;
		if ("comparator" in nd && nd.comparator != '') {
			ratioString += res.__(nd.comparator) + " ";
		} else {
			ratioString += res.__('<=') + " ";
		}
		if ("value" in nd) {
			ratioString += nd.value + " ";
		}
		if ("unit" in nd && nd.unit != '') {
			ratioString += res.__(nd.unit);
		}
	}
	if ("denominator" in ratio && !isEmpty(ratio.denominator)) {
		var nd = ratio.numerator;
		ratioString += " " + res.__('per') + " ";
		if ("comparator" in nd && nd.comparator != '') {
			ratioString += res.__(nd.comparator) + " ";
		} else {
			ratioString += res.__('<=') + " ";
		}
		if ("value" in nd) {
			ratioString += nd.value + " ";
		}
		if ("unit" in nd && nd.unit != '') {
			ratioString += res.__(nd.unit);
		}
	}

	return ratioString;
};

/**
 * -----------------------------------------------------------------------
 * Convert period resource to text.
 * -----------------------------------------------------------------------
 */
var getPeriod = function(period, res) {
	var periodString = "";
	if ("start" in period && !isEmpty(period.start) && "end" in period
			&& !isEmpty(period.end)) {
		periodString += res.__('between') + " " + res.__('the')
				+ dateToString(period.start);
		periodString += res.__('and') + " " + res.__('the')
				+ dateToString(period.end);
	}
	return periodString;
};

/**
 * -----------------------------------------------------------------------
 * Convert quantity resource to text.
 * -----------------------------------------------------------------------
 */
var getQuantity = function(qty, res) {
	var qtyString = "";
	if ("value" in qty) {
		qtyString += qty.value;
	}
	if ("units" in qty && qty.units != "") {
		qtyString += " " + res.__(qty.units);
	}

	return qtyString;
};

/**
 * -----------------------------------------------------------------------
 * Convert sampled data resource to text.
 * -----------------------------------------------------------------------
 */
var getSampledData = function(data, res) {
	var dataString = "";
	// TODO
	return dataString;
};

/**
 * -----------------------------------------------------------------------
 * Convert a date to a string in format dd/mm/yyyy.
 * -----------------------------------------------------------------------
 */
var dateToString = function(d) {
	var date = new Date(d);
	var d = date.getDate();
	if (Number(d) < 10)
		d = "0" + d;
	var m = date.getMonth() + 1;
	if (Number(m) < 10)
		m = "0" + m;
	var yyyy = date.getFullYear()
	return d + "/" + m + "/" + yyyy;
};

/**
 * -----------------------------------------------------------------------
 * Convert attachment resource to text.
 * -----------------------------------------------------------------------
 */
var getAttachment = function(att, res) {
	var str = "";
	if ("url" in att && att.url != "") {
		if ("title" in att && att.title != "")
			str += "<a href='" + att.url + "'>" + att.title + "</a>";
		else
			str += "<a href='" + att.url + "'>" + att.url + "</a>";
	} else {
		if ("title" in att && att.title != "")
			str += att.title;
	}
	if ("creation" in att && !isEmpty(att.creation)) {
		str += " (" + dateToString(att.creation) + ")";
	}
	return str;
};

/**
 * -----------------------------------------------------------------------
 * Transforms a jason resource into human readable text (format html).
 * -----------------------------------------------------------------------
 */
/**
 * -----------------------------------------------------------------------
 * MEDICATION ORDER<br>
 * Format example for a medication order: "
 * <p>
 * <strong>Prescription:</strong>:<br>
 * Avaler (voie orale) 1 ml à 2 ml de medicamentX 3 à 4 fois par 1 à 2 heures
 * avec un verre d'eau pendant 2 à 3 ans<br>
 * Maximum 10 ml par jour. <br>
 * <strong>Note:</strong> ...<br>
 * Prescrit le 10/10/10 par <a
 * href="localhost:3000/ehr/practitioner/3786786">Dr. Gregory HOUSE</a>. (<a
 * href="localhost:3000/ehr/encounter/324578478786">lien vers la rencontre où la
 * prescription a eu lieu</a>)<br>
 * Raison de la prescription: patient souffre de <a
 * href="localhost:3000/ehr/condition/3786786">maladieX</a>. <br>
 * Modifié en dernier le 10/12/10 par <a
 * href="localhost:3000/ehr/practitioner/3786786">Dr. Jean DUPUIS</a>.<br>
 * Stoppé le 02/02/12, raison : fin du traitement.<br>
 * </p>
 * -----------------------------------------------------------------------
 */
var medicationOrderToString = function(mo, res, host) {
	if (isEmpty(mo) == true) {
		return "";
	}
	var moString = "";

	// How medication should be taken
	if ("dosageInstruction" in mo && !isEmpty(mo.dosageInstruction)) {
		var dosages = mo.dosageInstruction;
		var len = dosages.length;
		for (var i = 0; i < len; i++) {
			var dosage = dosages[i];
			moString += "<strong>";
			if ("text" in dosage && dosage.text != '') {
				moString += dosage.text;
			} else {
				// Technique for administering medication
				if ("method" in dosage && "coding" in dosage.method) {
					moString += getCodeableConcept(dosage.method) + "";
				}
				// How drug should enter body
				if ("route" in dosage && "coding" in dosage.route) {
					moString += " (" + getCodeableConcept(dosage.route) + ")";
				}
				// Amount of medication per dose
				if ("doseRange" in dosage && !isEmpty(dosage.doseRange)) {
					moString += " " + getRange(dosage.doseRange, res) + "";
				}
				// Medication to be taken
				if ("medicationReference" in mo
						&& !isEmpty(mo.medicationReference)) {
					moString += " "
							+ res.__('of')
							+ " "
							+ getReference(mo.medicationReference, null, res,
									host) + "";
				}
				// When medication should be administered
				if ("timing" in dosage && !isEmpty(dosage.timing)) {
					moString += " " + getTiming(dosage.timing, res) + "";
				}
				// As needed ?
				if ("asNeededBoolean" in dosage
						&& dosage.asNeededBoolean == true) {
					moString += " " + res.__('takeAsNeeded') + ".";
				}
				// Max/min dose per period
				if ("maxDosePerPeriod" in mo && !isEmpty(mo.maxDosePerPeriod)) {
					moString += "<br>";
					moString += " " + getRatio(mo.maxDosePerPeriod, res) + ".";
				}
			}
			moString += "</strong><br>";
		}
	}
	// Why it was prescribed
	moString += "<strong>" + res.__('prescriptionReason') + ":</strong> "
			+ res.__('patientSufferFrom');
	if ("reasonCodeableConcept" in mo && !isEmpty(mo.reasonCodeableConcept)) {
		moString += " " + getCodeableConcept(mo.reasonCodeableConcept) + ".";
	} else if ("reasonReference" in mo && !isEmpty(mo.reasonReference)) {
		moString += " " + getReference(mo.reasonReference, null, res, host)
				+ ".";
	}
	moString += "<br>";

	// Information about the prescription
	if ("note" in mo && !isEmpty(mo.note)) {
		moString += "<i>" + res.__('Note') + ": " + mo.note + "</i><br>";
	}
	// When it was prescribed and by who
	moString += res.__('Prescribed');
	if ("dateWritten" in mo && !isEmpty(mo.dateWritten)) {
		moString += " <strong>" + res.__('the') + " "
				+ dateToString(mo.dateWritten) + "</strong>";
	}
	if ("prescriber" in mo && !isEmpty(mo.prescriber)) {
		moString += " " + res.__('by') + " "
				+ getReference(mo.prescriber, null, res, host);
	}
	if ("encounter" in mo && !isEmpty(mo.encounter)) {
		moString += " ("
				+ getReference(mo.encounter, res.__('prescriptionEncounter'),
						res, host) + ")";
	}

	// When prescription was stopped and why
	var stopped = false;
	if (mo.status != 'active') {
		moString += " " + res.__(mo.status);
	}

	if ("dateEnded" in mo && !isEmpty(mo.dateEnded)) {
		moString += " <strong>" + res.__('the') + " "
				+ dateToString(mo.dateEnded) + "</strong>";
	}
	if ("reasonEnded" in mo && !isEmpty(mo.reasonEnded)) {
		moString += " " + res.__('reason') + ": "
				+ getCodeableConcept(mo.reasonEnded);
	}

	moString += "<br>";

	// Last modified the dd/mm/yyyy by ...

	moString += "<hr><span class='small'>" + res.__('LastModified');
	if ("meta" in mo && !isEmpty(mo.meta)) {
		if ("lastUpdated" in mo.meta && !isEmpty(mo.meta.lastUpdated)) {
			moString += " " + res.__('the') + " "
					+ dateToString(mo.meta.lastUpdated);
		}
		if ("updatedBy" in mo.meta && !isEmpty(mo.meta.updatedBy)) {
			moString += " " + res.__('by') + " <a href='" + host + "/ehr/"
					+ mo.meta.updatedBy + "'>" + mo.meta.updatedBy + "</a>";
		}
	}
	moString += "</span>.<br>";

	return moString;

};

/**
 * -----------------------------------------------------------------------
 * CONDITION<br>
 * Format example for a condition: "
 * <p>
 * Maladie: maladieX<br>
 * Status de la maladie : en rémission<br>
 * Status de confirmation de la maladie: provisoire <br>
 * Gravité: provisoire <br>
 * Stade : metastase stage terminal <br>
 * Manifestation : entre le 1/10/10 et le 15/10/10<br>
 * Symptômes : symptome1, symptome2,... <br>
 * Rémission : entre le 1/10/12 et le 15/10/12<br>
 * Personne qui a déclaré la maladie: Jean DUPONT<br>
 * (lien vers la rencontre où la declaration a eu lieu)<br>
 * Enregistrer le 10/10/10 <strong>Note:</strong> ...<br>
 * Modifié en dernier le 10/12/10 par Dr.Jean DUPUIS.<br>
 * </p>
 * -----------------------------------------------------------------------
 */
var conditionToString = function(resource, res, host) {
	if (isEmpty(resource) == true) {
		return "";
	}
	var rString = "";
	// Category
	if ("category" in resource && !isEmpty(resource.category)) {
		rString += "" + getCodeableConcept(resource.category) + ": ";
	}
	// Identification of the condition, problem or diagnosis
	if ("code" in resource && !isEmpty(resource.code)) {
		rString += "<strong>" + getCodeableConcept(resource.code) + "</strong>";
	}
	rString += "<em>";
	// Anatomical location, if relevant
	if ("bodySite" in resource && !isEmpty(resource.bodySite)) {
		rString += " (";
		var site = resource.bodySite;
		var len = site.length;
		for (var i = 0; i < len; i++) {
			rString += getCodeableConcept(site[i]) + ";"
		}
		rString += ")";
	}
	if ("clinicalStatus" in resource && !isEmpty(resource.clinicalStatus)) {
		rString += " (" + res.__('clinicalStatus') + ": "
				+ res.__(resource.clinicalStatus) + ")";
	}
	if ("verificationStatus" in resource
			&& !isEmpty(resource.verificationStatus)) {
		rString += " (" + res.__(resource.verificationStatus) + ")";
	}
	rString += ".</em><br>";
	// Subjective severity of condition
	if ("severity" in resource && !isEmpty(resource.severity)) {
		rString += res.__('severity') + ": <em>"
				+ getCodeableConcept(resource.severity) + "</em><br>";
	}
	// Stage/grade, usually assessed formally
	if ("stage" in resource && !isEmpty(resource.stage)) {
		var stage = resource.stage;
		if ("summary" in stage && !isEmpty(stage.summary)) {
			rString += res.__('stage') + ":<em> "
					+ getCodeableConcept(stage.summmary);
		}
		if ("assessment" in stage && !isEmpty(stage.assessment)) {
			rString += "(";
			var assessment = stage.assessment;
			var len = assessment.length;
			for (var i = 0; i < len; i++) {
				rString += getRerence(assessment[i], null, res, host) + ";";
			}
			rString += ")";
		}
		rString += ".</em><br>";
	}

	// Estimated or actual date, date-time, or age
	if ("onsetDateTime" in resource && !isEmpty(resource.onsetDateTime)) {
		rString += res.__('onset') + ":<strong> ";
		rString += dateToString(resource.onsetDateTime);
		rString += ".</strong><br>";
	} else if ("onsetQuantity" in resource && !isEmpty(resource.onsetQuantity)) {
		rString += res.__('onset') + ":<strong> ";
		rString += getQuantity(resource.onsetQuantity, res);
		rString += ".</strong><br>";
	} else if ("onsetPeriod" in resource && !isEmpty(resource.onsetPeriod)) {
		rString += res.__('onset') + ":<strong> ";
		rString += getPeriod(resource.onsetPeriod, res);
		rString += ".</strong><br>";
	} else if ("onsetString" in resource && !isEmpty(resource.onsetString)) {
		rString += res.__('onset') + ":<strong> ";
		rString += resource.onsetString;
		rString += ".</strong><br>";
	}

	// Supporting evidence (Manifestation/symptom)
	if ("evidence" in resource && !isEmpty(resource.evidence)) {
		rString += res.__('symptoms') + ":<em> ";
		var len = resource.evidence.length;
		for (var i = 0; i < len; i++) {
			var evidence = resource.evidence[i];
			if ("code" in evidence && !isEmpty(evidence.code)) {
				rString += getCodeableConcept(evidence.code) + "; ";
			}
			if ("detail" in evidence && !isEmpty(evidence.detail)) {
				var lenDetail = evidence.detail.length;
				rString += "(";
				for (var k = 0; k < lenDetail; k++) {
					rString += getReference(evidence.detail[k], null, res, host)
							+ "; ";
				}
				rString += ")";
			}
		}
		rString += ".</em><br>";
	}
	// If/when in resolution/remission
	if ("abatementDateTime" in resource && !isEmpty(resource.abatementDateTime)) {
		rString += res.__('abatement') + ":<em> ";
		rString += dateToString(resource.abatementDateTime);
		rString += ".</em><br>";
	} else if ("abatementQuantity" in resource
			&& !isEmpty(resource.abatementQuantity)) {
		rString += res.__('abatement') + ":<em> ";
		rString += getQuantity(resource.abatementQuantity, res);
		rString += ".</em><br>";
	} else if ("abatementPeriod" in resource
			&& !isEmpty(resource.abatementPeriod)) {
		rString += res.__('abatement') + ":<em> ";
		rString += getPeriod(resource.abatementPeriod, res);
		rString += ".</em><br>";
	} else if ("abatementString" in resource
			&& !isEmpty(resource.abatementString)) {
		rString += res.__('abatement') + ":<em> ";
		rString += resource.abatementString;
		rString += ".</em><br>";
	}

	// Additional information about the Condition
	if ("notes" in resource && !isEmpty(resource.notes)) {
		rString += "<i>" + res.__('Note') + ": " + resource.notes + "</i><br>";
	}

	// Person who asserts this condition
	if ("asserter" in resource && !isEmpty(resource.asserter)) {
		rString += res.__('asserter') + ": "
				+ getReference(resource.asserter, null, res, host) + ".<br>";
	}

	// Encounter when condition first asserted
	if ("encounter" in resource && !isEmpty(resource.encounter)) {
		rString += " <em>("
				+ getReference(resource.encounter, res
						.__('conditionEncounterLink'), res, host)
				+ ")</em><br>";
	}
	rString += "<hr><span class='small'>";
	// When first entered
	if ("dateRecorded" in resource && !isEmpty(resource.dateRecorded)) {
		rString += "" + res.__('dateRecorded') + " "
				+ dateToString(resource.dateRecorded) + " ; ";
	}

	// Last modified the dd/mm/yyyy by ...
	rString += "" + res.__('LastModified');
	if ("meta" in resource && !isEmpty(resource.meta)) {
		if ("lastUpdated" in resource.meta
				&& !isEmpty(resource.meta.lastUpdated)) {
			rString += " " + res.__('the') + " "
					+ dateToString(resource.meta.lastUpdated) + "";
		}
		if ("updatedBy" in resource.meta && !isEmpty(resource.meta.updatedBy)) {
			rString += " " + res.__('by') + " <a href='" + host + "/ehr/"
					+ resource.meta.updatedBy + "'>" + resource.meta.updatedBy
					+ "</a>";
		}
	}
	rString += "</small>.<br>";

	return rString;
};

/**
 * OBSERVATION<br>
 * Example:<br>
 * Facteur de risque : consommation de tabac<br>
 * (lien vers la rencontre où la declaration a eu lieu)<br>
 * Validité: 10/10/10<br>
 * Responsable de l'observation: Jean Dupont <br>
 * ------------------------------------------------ **raison d'un eventuel
 * manque de données** 3 paquets de cigarettes par jour (bodysite)
 * <em>Interprétation : Valeur très élevée</em> Méthode: ... Valeurs de
 * référence: ... ------------------------------------------------ Commentaires:
 * ...<br>
 * Enregistrer le 10/10/10; Modifié en dernier le 10/12/10 par Dr.Jean DUPUIS.<br>
 */
var observationToString = function(resource, res, host) {

	if (isEmpty(resource) == true) {
		return "";
	}
	var rString = "";

	// Category
	if ("category" in resource && !isEmpty(resource.category)) {
		rString += "<strong>" + getCodeableConcept(resource.category)
				+ ": </strong>";
	}
	// Type of observation (code / type)
	if ("code" in resource && !isEmpty(resource.code)) {
		rString += "<strong>" + getCodeableConcept(resource.code) + "</strong>";
	}
	// Anatomical location, if relevant
	if ("bodySite" in resource && !isEmpty(resource.bodySite)) {
		rString += " (";
		var site = resource.bodySite;
		var len = site.length;
		for (var i = 0; i < len; i++) {
			rString += getCodeableConcept(site[i]) + ";"
		}
		rString += ")";
	}

	rString += "<br>";

	// Encounter when observation first asserted
	if ("encounter" in resource && !isEmpty(resource.encounter)) {
		rString += " <em>("
				+ getReference(resource.encounter, res
						.__('conditionEncounterLink'), res, host)
				+ ")</em><br>";
	}

	// Clinically relevant time/time-period for observation
	if ("effectiveDateTime" in resource && !isEmpty(resource.effectiveDateTime)) {
		rString += res.__('Validity') + ":<em> ";
		rString += dateToString(resource.effectiveDateTime);
		rString += ".</em><br>";
	} else if ("effectivePeriod" in resource
			&& !isEmpty(resource.effectivePeriod)) {
		rString += res.__('Validity') + ":<em> ";
		rString += getPeriod(resource.effectivePeriod, res);
		rString += ".</em><br>";
	}
	// Person(s) who asserts this condition
	if ("performer" in resource && !isEmpty(resource.performer)) {
		rString += res.__('Performer') + ":<em> ";
		var len = resource.performer.length;
		for (var i = 0; i < len; i++) {

			rString += getReference(resource.performer[i], null, res, host)
					+ "; ";
		}
		rString += "</em><br> ";
	}

	rString += "<hr>";

	// If and Why the result is missing
	if ("dataAbsentReason" in resource && !isEmpty(resource.dataAbsentReason)) {
		rString += res.__('MissingData') + ": <em>"
				+ getCodeableConcept(resource.dataAbsentReason) + "</em><br>";
	} else {

		if ("valueString" in resource && !isEmpty(resource.valueString)) {
			rString += resource.valueString;
			rString += "<br>";
		} else if ("valueQuantity" in resource
				&& !isEmpty(resource.valueQuantity)) {
			rString += getQuantity(resource.valueQuantity, res);
			rString += "<br>";
		} else if ("valueRange" in resource && !isEmpty(resource.valueRange)) {
			rString += getRange(resource.valueRange, res);
			rString += "<br>";
		} else if ("valueRatio" in resource && !isEmpty(resource.valueRatio)) {
			rString += getRatio(resource.valueRatio);
			rString += "<br>";
		} else if ("valueSampledData" in resource
				&& !isEmpty(resource.valueSampledData)) {
			rString += getSampledData(resource.valueSampledData);
			rString += "<br>";
		} else if ("valueTime" in resource && !isEmpty(resource.valueTime)) {
			rString += resource.valueTime;
			rString += "<br>";
		} else if ("valueDateTime" in resource
				&& !isEmpty(resource.valueDateTime)) {
			rString += dateToString(resource.valueDateTime);
			rString += "<br>";
		} else if ("valuePeriod" in resource && !isEmpty(resource.valuePeriod)) {
			rString += getPeriod(resource.valuePeriod, res);
			rString += "<br>";
		} else if ("valueAttachment" in resource
				&& !isEmpty(resource.valueAttachment)) {
			rString += getAttachment(resource.valueAttachment, res);
			rString += "<br>";
		}

		// Interpretation: High, low, normal, etc.
		if ("interpretation" in resource && !isEmpty(resource.interpretation)) {
			rString += res.__('Interpretation') + ":<em> "
					+ getCodeableConcept(resource.interpretation) + "</em><br>";
		}

		// How it was done
		if ("method" in resource && !isEmpty(resource.method)) {
			rString += res.__('Method') + ":<em> "
					+ getCodeableConcept(resource.method) + "</em><br>";
		}

		// Reference range : Provides guide for interpretation
		if ("referenceRange" in resource && !isEmpty(resource.referenceRange)) {
			rString += res.__('ReferenceRange') + ": ";
			var ref = resource.referenceRange;
			if ("text" in ref && ref.text != "")
				rString += "<em> " + resource.referenceRange + "</em><br>";
			if ("low" in ref && ref.low != "" && "high" in ref
					&& ref.high != "") {
				rString += "<em>" + res.__('Between') + " " + ref.low + " "
						+ res.__('and') + " " + ref.high + "</em> ";
			} else if ("low" in ref && ref.low != "") {
				rString += "<em>" + ref.low + "</em> ";
			}
			if ("age" in ref && !isEmpty(ref.age)) {
				rString += res.__('Age') + ": <em>" + getRange(ref.age, res)
						+ "</em> ";
			}
			if ("meaning" in ref && !isEmpty(ref.meaning)) {
				rString += "<em> " + getCodeableConcept(ref.meaning) + "</em>";
			}
			rString += "<br>";
		}
	}

	// Comments about result
	if ("comments" in resource && !isEmpty(resource.comments)) {
		rString += "<hr><i>" + res.__('Comments') + ": " + resource.comments
				+ "</i><br>";
	}

	rString += "<hr><span class='small'>";

	// Date/Time this was made available
	if ("issued" in resource && !isEmpty(resource.issued)) {
		rString += "" + res.__('dateRecorded') + " "
				+ dateToString(resource.issued) + " ; ";
	}

	// Last modified the dd/mm/yyyy by ...
	rString += res.__('LastModified');
	if ("meta" in resource && !isEmpty(resource.meta)) {
		if ("lastUpdated" in resource.meta
				&& !isEmpty(resource.meta.lastUpdated)) {
			rString += " " + res.__('the') + " "
					+ dateToString(resource.meta.lastUpdated) + "";
		}
		if ("updatedBy" in resource.meta && !isEmpty(resource.meta.updatedBy)) {
			rString += " " + res.__('by') + " <a href='" + host + "/ehr/"
					+ resource.meta.updatedBy + "'>" + resource.meta.updatedBy
					+ "</a>";
		}
	}

	rString += "</span><br>";

	return rString;
};

/**
 * -----------------------------------------------------------------------
 * Generate a text version (html format) of the resource
 * -----------------------------------------------------------------------
 */
var generateText = function(resource, res, host) {
	switch (resource.resourceType) {
	case 'MedicationOrder':
		return medicationOrderToString(resource, res, host);
	case 'Condition':
		return conditionToString(resource, res, host);
	case 'Observation':
		return observationToString(resource, res, host);
	default:
		break;
	}
	var humanReadable = "<p>" + "<strong>" + resource.resourceType
			+ "</strong><br>" + "<strong>url : </strong><a href='" + host
			+ "/rest/" + resource.id + "'>" + resource.id + "</a><br>";
	if ('name' in resource && typeof resource.name.given[0] !== 'undefined'
			&& typeof resource.name.family[0] !== 'undefined') {
		humanReadable = humanReadable + "<strong>Name : </strong> "
				+ resource.name.given[0] + " " + resource.name.family[0]
				+ "<br>"
	}
	if ('code' in resource && typeof resource.code.coding[0] !== 'undefined') {
		humanReadable = humanReadable + "<strong>"
				+ resource.code.coding[0].display + "</strong><br>"
	}
	if ('patient' in resource
			&& typeof resource.patient.display !== 'undefined') {
		humanReadable = humanReadable + "<strong>Concerns : </strong>"
				+ resource.patient.display + "<br>";
	}
	if ('subject' in resource
			&& typeof resource.subject.display !== 'undefined') {
		humanReadable = humanReadable + "<strong>Concerns : </strong>"
				+ resource.subject.display + "<br>";
	}
	if ('conclusion' in resource && typeof resource.conclusion !== 'undefined') {
		humanReadable = humanReadable + "<strong>Conclusion : </strong>"
				+ resource.conclusion + "<br>";
	}
	humanReadable = humanReadable + "</p>";
	return humanReadable;
};
exports.generateText = generateText;

/**
 * ----------------------------------------------------------------------- Check
 * if two objects are similar
 * -----------------------------------------------------------------------
 */
var compareObjects = function(a, b) {
	if (a == null && b != null)
		return false;
	if (b == null && a != null)
		return false;
	for ( var propA in a) {
		propB = propA.trim();
		if (!propB in b) {
			return false;
		}
		var propValue = a[propA];
		if (a[propA].charAt(0) == '{') {
			propValue = JSON.parse(a[propA]);
			if (typeof propValue === 'object') {
				return compareObjects(propValue, b[propB]);
			} else {
				return (propValue == b[propB]);
			}
		} else if (a[propA].charAt(0) == '[') {
			propValue = JSON.parse(a[propA]);
			propBValue = b[propB];
			for (var i = 0, len = propValue.length; i < len; i++) {
				var elemFound = false;
				for (var k = 0, klen = propBValue.length; k < klen; k++)
					if (compareObjects(propValue[i], propBValue[k]))
						elemFound = true;
				if (!elemFound)
					return false;
			}
		} else {
			return (propValue == b[propB]);
		}
	}
	return true;
};
exports.compareObjects = compareObjects;

/**
 * ----------------------------------------------------------------------- Get
 * the "minimumRead" version of the resource
 * -----------------------------------------------------------------------
 */

var getWorkTelecom = function(telecom) {
	var workTel = [];
	for (var i = 0, len = telecom.length; i < len; i++) {
		if (telecom[i].use == 'work')
			workTel.push(telecom[i]);
	}
	return workTel;
};
var getWorkAddress = function(address) {
	var workAddress = [];
	for (var i = 0, len = address.length; i < len; i++) {
		if (address[i].use == 'work')
			workAddress.push(address[i]);
	}
	return workAddress;
};

var getMinimumRead = function(resource, modelName) {
	var model = mongoose.model(modelName);
	var res = new model(resource);

	switch (resource.resourceType) {
	case 'Patient':
		delete res.identifier;
		delete res.telecom;
		delete res.address;
		delete res.multipleBirthBoolean;
		delete res.multipleBirthInteger;
		delete res.contact;
		delete res.communication;
		return res;
	case 'Practitioner':
		delete res.identifier;
		res.telecom = getWorkTelecom(res.telecom);
		res.address = getWorkAddress(res.address);
		return res;
	default:
		return resource;
	}

};
exports.getMinimumRead = getMinimumRead;

/**
 * ----------------------------------------------------------------------- Check
 * if the demander has the necessary authorization to view the resource.
 * -----------------------------------------------------------------------
 */
var checkAuthorization = function(req, resource, next) {
	//return next(5);
	if (typeof req.token != 'undefined' && typeof req.user != 'undefined') {

		var AccessAuthorization = mongoose.model('AccessAuthorization');
		var user = req.user;
		var resRef = "";
		var dateNow = new Date();
		var authLvl = 0; // 0 = Not authorized to view it.
		// find to whom the resource belong to
		if (typeof resource.patient != 'undefined') {
			resRef = resource.patient.reference;
			if (user.isPatient && user.reference.patientId == resRef)
				return next(3);
		} else if (typeof resource.subject != 'undefined') {
			resRef = resource.subject.reference;
			if (user.isPatient && user.reference.patientId == resRef)
				return next(3);
		} else if (req.params.model == 'Patient'
				|| req.params.model == 'Practitioner') {
			resRef = resource.id;
			if ((user.isPatient && user.reference.patientId == resRef)
					|| (user.isPractitioner && user.reference.practitionertId == resRef))
				return next(5);

		}
		if (user.isPractitioner) {
			var userPractitionerId = user.reference.practitionerId;
			
			// find the authorizations
			AccessAuthorization
					.findOne(
							{
								referenceId : userPractitionerId
							},
							function(err, auth) {
								if (err) {
									console.log("Find access error: " + err);
									return next(0);
								} else {
									if(auth == null){
										authLvl = 0;
									}else{
										var len = auth.access.length;
										for (var i = 0; i < len; i++) {
											if (auth.access[i].refId == resRef
													&& auth.access[i].isApproved) {
												// we search for the highest
												// authorization:
												if (auth.access[i].level > authLvl)
													authLvl = auth.access[i].level;
											}
										}
									}
									// Practitioner can see the minimum readable
									// of any patient and practitioner
									if (authLvl == 0
											&& (req.params.model == 'Patient' || req.params.model == 'Practitioner')) {
										return next(1);
									}
									return next(authLvl);
								}
							});

		} else {
			// Patient can see the minimum readable of any practitioner.
			if (req.params.model == 'Practitioner') {
				return next(1);
			} else {
				return next(0);
			}
		}
	} else {
		return next(0);
	}
};

exports.checkAuthorization = checkAuthorization;
