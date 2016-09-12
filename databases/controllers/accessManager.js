var mongoose = require('mongoose');

/**
 * -----------------------------------------------------------------------
 * if the demander has the necessary authorization to view the resource.
 * -----------------------------------------------------------------------
 */
var checkAuthorization = function(req, resource, next) {
	return next(5);
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
					|| (user.isPractitioner && user.reference.practitionerId == resRef))
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
