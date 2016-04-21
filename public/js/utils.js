
app.service('utils', function() {
	

	/** -----------------------------------------------------------------------
	 * Find the observation corresponding to the history of tobacco use
	 *  -----------------------------------------------------------------------
	 */
	
	this.findTobaccoUse = function(observations){
		if(typeof observations !== 'undefined'){
			for (var i = 0, len = observations.length; i < len; i++) {
				if(observations[i].code.coding.length > 0)
					if(observations[i].code.coding[0].code == '72166-2') {
						return observations[i];
					}	
			}
		}
		return {valueString: 'unknown'};		
	}
	

	this.findTobaccoHistory = function(observations){
		if(typeof observations !== 'undefined'){
			for (var i = 0, len = observations.length; i < len; i++) {
				if(observations[i].code.coding.length > 0)
					if(observations[i].code.coding[0].code == '11367-0') {
						return observations[i];
					}	
			}
		}
		return {valueString: 'unknown'};		
	}

	/** -----------------------------------------------------------------------
	 * Compute the age from the birthday
	 *  -----------------------------------------------------------------------
	 */
	this.calculateAge = function(birthday) {
		var ageDifMs = Date.now() - new Date(birthday);
		var ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	/** -----------------------------------------------------------------------
	 * Compute the duration in years, month and days between two dates.
	 *  -----------------------------------------------------------------------
	 */
	this.computeDuration = function(dateStart, dateEnd) {
		var ageDifMs = new Date(dateEnd) - new Date(dateStart);
		var ageDate = new Date(ageDifMs);
		var years = Math.abs(ageDate.getUTCFullYear() - 1970);
		var ageDate = new Date(ageDate - new Date(years,0,0));
		var months = ageDate.getUTCMonth();
		var ageDate = new Date(ageDate - new Date(0,months,0));
		var days = ageDate.getUTCDate();
		return ""+years+" an(s), "+months+" mois, "+days+" jour(s)";
	}
	/** -----------------------------------------------------------------------
	 * Compute the duration of the symptoms from the recorded onset
	 * to when the diagnostic is issued.
	 *  -----------------------------------------------------------------------
	 */
	this.computeSymptomsDuration = function(diagnostic, condition){
		if(diagnostic != null && typeof diagnostic !== 'undefined'){
			var end = diagnostic.issued;
			if(condition != null && typeof condition !== 'undefined'){
				var start = condition.onsetDateTime;
				return this.computeDuration(start, end);
			}
		}
	}

	/** -----------------------------------------------------------------------
	 * Search for the conditions "type 1 diabetes"
	 * -----------------------------------------------------------------------
	 */
	this.findDiabete = function(conditions) {
		for (var i = 0, len = conditions.length; i < len; i++) {
			var condition = conditions[i];
			for (var k = 0, klen = condition.code.coding.length; k < klen; k++) {
				var coding = condition.code.coding[k];
				if (coding.code == '46635009'
						&& coding.system == 'http://snomed.info/sct') {
					return condition;
				}
				if (coding.display.search('Diabetes mellitus') != -1) {
					return condition;
				}
			}
		}
		return null;
	};

	/** -----------------------------------------------------------------------
	 * Search for a diabete diagnostic
	 *  -----------------------------------------------------------------------
	 */
	this.findDiagDiabete = function(diagnostics) {
		for (var i = 0, len = diagnostics.length; i < len; i++) {
			var diag = diagnostics[i];
			for (var k = 0, klen = diag.codedDiagnosis.length; k < klen; k++) {
				var coded = diag.codedDiagnosis[k];
				for (var l = 0, llen = coded.coding.length; l < llen; l++) {
					var coding = coded.coding[l];
					if ((coding.code == '444073006' || coding.code == '444074000')
							&& coding.system == 'http://snomed.info/sct') {
						return diag;
					}
					if (coding.display.toLowerCase().search(
							'diabetes mellitus') != -1) {
						return diag;
					}
				}
			}
		}
		return null;
	};
	

	/** -----------------------------------------------------------------------
	 * Check if the diabetes was discovered when the patient was admitted in
	 * the hospital.
	 *  -----------------------------------------------------------------------
	 */
	
	this.hospitalizedForDiabete = function(diabDiagEncounter){
		if(diabDiagEncounter != null && typeof diabDiagEncounter !== 'undefined'){
			if('hospitalization' in diabDiagEncounter)
				if(diabDiagEncounter.hospitalization.admittingDiagnosis.length > 0) {
					return "Oui";
				}	
		}
		return "Non";
	}
	
	/** -----------------------------------------------------------------------
	 * Search all the symptoms of the diabete.
	 *  -----------------------------------------------------------------------
	 */
	this.findDiabeteSymptoms = function(diabete, diagDiabete) {
		var symptoms = [];
		if(diabete != null && typeof diabete !== 'undefined') {
			if('evidence' in diabete) {
				for (var i = 0, len = diabete.evidence.length; i < len; i++) {
					if('code' in diabete.evidence[i]){						
						if('text' in diabete.evidence[i].code){
							symptoms.push(diabete.evidence[i].code.text);							
						}
						else if('coding' in  diabete.evidence[i].code) {
							var coding = diabete.evidence[i].code.coding;
							if(coding.length > 0 && 'display' in coding[0]){
								symptoms.push(coding[0].display);
							}
						}						
					}
					else if('detail' in diabete.evidence[i]){
						var detail = diabete.evidence[i].detail;
						for (var k = 0, klen = detail.length; k < klen; k++) {
							symptoms.push('<a href="../rest/' + detail[k] +'">(' + 
									detail[k] + ')</a>');
						}
					}
				}
			}		
		}
		if(diagDiabete != null && typeof diagDiabete !== 'undefined'){
			if('result' in diagDiabete){
				for (var i = 0, len = diagDiabete.result.length; i < len; i++) {
					symptoms.push('<a href="../rest/' + diagDiabete.result[i] +
							'">(' + diagDiabete.result[i] + ')</a>');					
				}
			}
		}
		return symptoms;
	}
	
	
});