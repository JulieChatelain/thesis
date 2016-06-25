//var i18n = require('./config/i18n');

/** -----------------------------------------------------------------------
 * Check if a resource is empty
 *  -----------------------------------------------------------------------
 */
var isEmpty = function (resource) { 
	
	if(resource == null || resource == 'undefined' || resource == '' || resource == 'NULL'){
		return true;
	}
	if(typeof resource === 'string' || typeof resource === 'number'){
		return false;
	}
	
	var stringResource = JSON.stringify(resource);
	
	if(stringResource.charAt(0) == "["){
		var len = resource.length;
		for (var i = 0; i < len; i++) {
			if(isEmpty(resource[i]) == false){
				return false;
			}
		}
		return true;
	}		
	else if(stringResource.charAt(0) == "{"){
		
	    for ( var property in resource ) {		    	  
	    	  if(isEmpty(resource[property]) == false)
	    			  return false;		    	  
	    }
        return true; 
	}		
	return false;
};

/** -----------------------------------------------------------------------
 * Convert a codeable concept resource to text.
 *  -----------------------------------------------------------------------
 */
var getCodeableConcept = function(cc) {
	if("text" in cc && cc.text != ""){
		return code.text;
	}
	var codes = cc.coding;
	var len = codes.length;
	for (var i = 0; i < len; i++) {
		var code = codes[i];
		if("display" in code && code.display != ""){
			return code.display;
		}
	}
	return "";
};

/** -----------------------------------------------------------------------
 * Convert a range resource to text.
 *  -----------------------------------------------------------------------
 */
var getRange = function(range,res){
	var rangeString = "";
	if("low" in range && ! isEmpty(range.low)){
		if("value" in range.low)
			rangeString += range.low.value;
		if("unit" in range.low && range.low.unit != '')
			rangeString += " " + range.low.unit;			
	}
	if("high" in range && ! isEmpty(range.high)){
		if("value" in range.high)
			rangeString += " " + res.__('XtoY') + " " + range.high.value;
		if("unit" in range.high && range.high.unit != '')
			rangeString += " " + range.high.unit;			
	}
	
	return rangeString;
};
/** -----------------------------------------------------------------------
 * Convert a reference resource to text.
 *  -----------------------------------------------------------------------
 */
var getReference = function(r,linkName,res,host){
	var rString = "";
	if(isEmpty(r)){
		return rString;
	}
	if("reference" in r && r.reference != '')
		rString += "<a href='"+host+"/ehr/"+r.reference+"'>";
	if("display" in r && r.display != '')
		rString += r.display;
	else if(linkName != null)
		rString += linkName;
	else
		rString += r.reference;
	rString += 	"</a>";
		
	return rString;
};
/** -----------------------------------------------------------------------
 * Convert a timing resource to text.<br>
 * frequency per period for duration
 *  -----------------------------------------------------------------------
 */
var getTiming = function(timing, res){
	var timingString = "";
	// frequency
	if("frequency" in timing){
		timingString += timing.frequency;
		if("frequencyMax" in timing)
			timingString += " " + res._('XtoY') + " " + timing.frequencyMax;
		timingString += " " + res.__('times');
	}
	// period
	if("periodUnits" in timing){
		timingString += " " + res.__('per');
		if("period" in timing){
			timingString += " " + timing.period;
			if("periodMax" in timing)
				timingString += " " + res._('XtoY') + " " + timing.periodMax;
		}
		timingString += " " + res.__(timing.periodUnits);
	}
	// duration
	if("durationUnits" in timing){
		timingString += " " + res.__('for');
		if("duration" in timing){
			timingString += " " + timing.duration;
			if("durationMax" in timing)
				timingString += " " + res._('XtoY') + " " + timing.durationMax;
		}
		timingString += " " + res.__(timing.durationUnits);
	}
	// when
	if("when" in timing && timing.when != ''){
		timingString += " " + res.__('when') + " " + res.__(timing.when);
	}
};
/** -----------------------------------------------------------------------
 * Convert ratio resource to text.
 *  -----------------------------------------------------------------------
 */
var getRatio = function(ratio, res) {
	var ratioString = "";
	if("numerator" in ratio && ! isEmpty(ratio.numerator)){
		var nd = ratio.numerator;
		if("comparator" in nd && nd.comparator != ''){
			ratioString += res.__(nd.comparator) + " ";
		}else{
			ratioString += res.__('<=') + " ";
		}
		if("value" in nd){
			ratioString += nd.value + " ";
		}
		if("unit" in nd && nd.unit != ''){
			ratioString += res.__(nd.unit);
		}
	}
	if("denominator" in ratio && ! isEmpty(ratio.denominator)){
		var nd = ratio.numerator;
		ratioString += " " + res.__('per') + " ";
		if("comparator" in nd && nd.comparator != ''){
			ratioString += res.__(nd.comparator) + " ";
		}else{
			ratioString += res.__('<=') + " ";
		}
		if("value" in nd){
			ratioString += nd.value + " ";
		}
		if("unit" in nd && nd.unit != ''){
			ratioString += res.__(nd.unit);
		}		
	}
	
	return ratioString;
};

/** -----------------------------------------------------------------------
 * Convert period resource to text.
 *  -----------------------------------------------------------------------
 */
var getPeriod = function(period, res){
	var periodString = "";
	if("start" in period && ! isEmpty(period.start)
			&& "end" in period && ! isEmpty(period.end)){
		periodString += res.__('between')+ " " + res.__('the') + dateToString(period.start);
		periodString += res.__('and')+ " " + res.__('the') + dateToString(period.end);
	}
	return periodString;
}

/** -----------------------------------------------------------------------
 * Convert a date to a string in format dd/mm/yyyy.
 *  -----------------------------------------------------------------------
 */
var dateToString = function(d) {
	var date = new Date(d);
	var d = date.getDate();
	if(Number(d) < 10) d = "0" + d;
	var m = date.getMonth() + 1;
	if(Number(m) < 10) m = "0" + m;
	var yyyy = date.getFullYear() 
	return d+"/"+m+"/"+yyyy;
};

/** -----------------------------------------------------------------------
 * Transforms a jason resource into human readable text (format html).
 *  -----------------------------------------------------------------------
 */
/**
 *  -----------------------------------------------------------------------
 * MEDICATION ORDER<br>
 * Format example for a medication order:
 * "<p>
 * <strong>Prescription:</strong>:<br>
 * Avaler (voie orale) 1 ml à 2 ml de medicamentX 3 à 4 fois par 
 * 1 à 2 heures avec un verre d'eau pendant 2 à 3 ans<br>
 * Maximum 10 ml par jour. <br>
 * <strong>Note:</strong> ...<br>
 * Prescrit le 10/10/10 par <a href="localhost:3000/ehr/practitioner/3786786">Dr. Gregory HOUSE</a>. 
 * (<a href="localhost:3000/ehr/encounter/324578478786">lien vers la rencontre où la prescription a eu lieu</a>)<br>
 * Raison de la prescription: patient souffre de <a href="localhost:3000/ehr/condition/3786786">maladieX</a>. <br>
 * Modifié en dernier le 10/12/10 par <a href="localhost:3000/ehr/practitioner/3786786">Dr. Jean DUPUIS</a>.<br>
 * Stoppé le 02/02/12, raison : fin du traitement.<br>
 * </p>
 *  -----------------------------------------------------------------------
 */
var medicationOrderToString = function(mo, res, host) {
	if(isEmpty(mo) == true){
		return "";
	}
	var moString = "";	
	
	// How medication should be taken
	if("dosageInstruction" in mo && !isEmpty(mo.dosageInstruction)){
		var dosages = mo.dosageInstruction;
		var len = dosages.length;
		for (var i = 0; i < len; i++) {
			var dosage = dosages[i];
			moString += "<strong>";
			if("text" in dosage && dosage.text != ''){
				moString += dosage.text;
			}else{
				// Technique for administering medication
				if("method" in dosage && "coding" in dosage.method){
					moString += res.__(getCodeableConcept(dosage.method)) + "";
				}
				// How drug should enter body
				if("route" in dosage && "coding" in dosage.route){
					moString += " (" + res.__(getCodeableConcept(dosage.route)) + ")";
				}
				// Amount of medication per dose
				if("doseRange" in dosage && !isEmpty(dosage.doseRange)){				
					moString += " " + getRange(dosage.doseRange, res) + "";
				}
				// Medication to be taken
				if("medicationReference" in mo && !isEmpty(mo.medicationReference)){
					moString += " " + res.__('of') + " " + getReference(mo.medicationReference, null, res, host) + "";
				}
				// When medication should be administered
				if("timing" in dosage && !isEmpty(dosage.timing)) {
					moString += " " + getTiming(dosage.timing, res) + "";
				}
				// As needed ?
				if("asNeededBoolean" in dosage && dosage.asNeededBoolean == true){
					moString += " " + res.__('takeAsNeeded') + ".";
				}
				// Max/min dose per period
				if("maxDosePerPeriod" in mo && !isEmpty(mo.maxDosePerPeriod)){
					moString += "<br>";
					moString += " " + getRatio(mo.maxDosePerPeriod, res) + ".";
				}
			}
			moString += "</strong><br>";
		}
	}
	// Why it was prescribed
	moString += "<strong>" + res.__('prescriptionReason') + ":</strong> " + res.__('patientSufferFrom');
	if("reasonCodeableConcept" in mo && !isEmpty(mo.reasonCodeableConcept)){
		moString += " " + res.__(getCodeableConcept(mo.reasonCodeableConcept)) + "."; 
	}
	else if("reasonReference" in mo && !isEmpty(mo.reasonReference)){
		moString += " " + getReference(mo.reasonReference, null ,res, host) + ".";
	}
	moString += "<br>";
	
	// Information about the prescription
	if("note" in mo && !isEmpty(mo.note)){
		moString += "<i>" + res.__('Note') + ": " + mo.note + "</i><br>";
	}
	// When it was prescribed and by who
	moString += res.__('Prescribed');
	if("dateWritten" in mo && !isEmpty(mo.dateWritten)){
		moString += " " + res.__('the') + " " + dateToString(mo.dateWritten); 
	}
	if("prescriber" in mo && !isEmpty(mo.prescriber)){
		moString += " " + res.__('by') + " " + getReference(mo.prescriber, null ,res, host);
	}
	if("encounter" in mo && !isEmpty(mo.encounter)){
		moString += " (" + getReference(mo.encounter, res.__('prescriptionEncounter'), res, host) + ")";
	}
	moString += "<br>";
	
	// Last modified the dd/mm/yyyy by ...
	moString += res.__('LastModified');
	if("meta" in mo && !isEmpty(mo.meta)){
		if("lastUpdated" in mo.meta && !isEmpty(mo.meta.lastUpdated)){
			moString += " " + res.__('the') + " " + dateToString(mo.meta.lastUpdated); 
		}
		if("updatedBy" in mo.meta && !isEmpty(mo.meta.updatedBy)){
			moString += " " + res.__('by') + " <a href='"+host+"/ehr/" 
			+ mo.meta.updatedBy+"'>" + mo.meta.updatedBy+"</a>";
		}		
	}	
	moString += ".<br>";
	
	// When prescription was stopped and why
	var stopped = false;
	if(mo.status != 'active'){
		moString += res.__(mo.status);
	}
	
	if("dateEnded" in mo && !isEmpty(mo.dateEnded)){
		moString += " " + res.__('the') + " " + dateToString(mo.dateEnded); 
	}
	if("reasonEnded" in mo && !isEmpty(mo.reasonEnded)){
		moString += " " + res.__('reason') + ": " + res.__(getCodeableConcept(mo.reasonEnded));
	}
	if(mo.status != 'active'){
		moString += ".<br>";
	}			
	
	return moString;
	
};

/**
 *  -----------------------------------------------------------------------
 * CONDITION<br>
 * Format example for a condition:
 * "<p>
 * Maladie: maladieX<br>
 * Etat de la maladie : en rémission<br>
 * Etat de confirmation de la maladie: provisoire <br>
 * Gravité: provisoire <br>
 * Stade : metastase stage terminal <br>
 * Manifestation : entre le 1/10/10 et le 15/10/10<br>
 * Symptômes : symptome1, symptome2,... <br>
 * Rémission : entre le 1/10/12 et le 15/10/12<br>
 * Personne qui a déclaré la maladie: Jean DUPONT<br>
 * (<a href="localhost:3000/ehr/encounter/324578478786">lien vers la rencontre où la declaration a eu lieu</a>)<br>
 * Enregistrer le 10/10/10 
 * Avaler (voie orale) 1 ml à 2 ml de medicamentX 3 à 4 fois par 
 * 1 à 2 heures avec un verre d'eau pendant 2 à 3 ans<br>
 * Maximum 10 ml par jour. <br>
 * <strong>Note:</strong> ...<br>
 * Prescrit le 10/10/10 par <a href="localhost:3000/ehr/practitioner/3786786">Dr. Gregory HOUSE</a>. 
 * (<a href="localhost:3000/ehr/encounter/324578478786">lien vers la rencontre où la prescription a eu lieu</a>)<br>
 * Raison de la prescription: patient souffre de <a href="localhost:3000/ehr/condition/3786786">maladieX</a>. <br>
 * Modifié en dernier le 10/12/10 par <a href="localhost:3000/ehr/practitioner/3786786">Dr. Jean DUPUIS</a>.<br>
 * Stoppé le 02/02/12, raison : fin du traitement.<br>
 * </p>
 *  -----------------------------------------------------------------------
 */
var conditionToString = function(c, res, host){
	
};
/** -----------------------------------------------------------------------
 * Generate a text version (html format) of the resource
 *  -----------------------------------------------------------------------
 */
var generateText = function(resource,res,host) {
	switch (resource.resourceType) {
	case 'MedicationOrder':
		return medicationOrderToString(resource,res,host);
	default:
		break;
	}
	var humanReadable = "<p>" + "<strong>" + resource.resourceType
			+ "</strong><br>" + "<strong>url : </strong><a href='" + host + "/rest/" + resource.id
			+ "'>" + resource.id + "</a><br>";
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

/** -----------------------------------------------------------------------
 * Check if two objects are similar
 *  -----------------------------------------------------------------------
 */
var compareObjects = function(a, b) {
	if(a == null && b != null) return false;
	if(b == null && a!= null) return false;
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
		}
		else if(a[propA].charAt(0) == '['){
			propValue = JSON.parse(a[propA]);
			propBValue = b[propB];
			for (var i = 0, len = propValue.length; i < len; i++) {
				var elemFound = false;			
				for (var k = 0, klen = propBValue.length; k < klen; k++) 
					if(compareObjects(propValue[i],propBValue[k]))
						elemFound = true;
				if(!elemFound)
					return false;
			}
		}else {
			return (propValue == b[propB]);
		}
	}
	return true;
};
exports.compareObjects = compareObjects;