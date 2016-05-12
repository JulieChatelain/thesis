app.service('display', function() {
	
	this.isEmpty = function (resource) { 
		
		if(resource == null || resource == 'undefined' || resource == ''){
			return true;
		}
		
		var stringResource = JSON.stringify(resource);
		
		if(stringResource.charAt(0) == "["){
			var len = resource.length;
			for (var i = 0; i < len; i++) {
				if(this.isEmpty(resource[i]) == false){
					return false;
				}
			}
			return true;
		}
		
		else if(stringProperty.charAt(0) == "{"){
			
		    for ( var property in resource ) {		    	  
		    	  if(this.isEmpty(resource[property]) == false)
		    			  return false;		    	  
		    }
	        return true; 
		}		
		return false;
	};
	
	this.displayResource = function(resource) {
		
		if(this.isEmpty(resource) == true){
			return "";
		}
		
		var display = "<table>";
		
		for ( var property in resource) {
			
			if(resource[property] != null && resource[property] != 'undefined' 
				&& resource[property] != ''){
				
				display = display + "<tr><td>" + property + "</td>";
				
				if(typeof resource[property] === 'string' || typeof resource[property] === 'number'){
					display = display + "<td>" + resource[property] + "</td>";
				}
				else if (typeof resource[property] === 'object') {
					var stringProperty = JSON.stringify(resource[property]);
					
					if(stringProperty.charAt(0) == "{"){
						
						display = display + "<td>";
						display = display + this.displayResource(resource[property]);
						display = display + "</td>";
						
					}else if(stringProperty.charAt(0) == "[") {
						var len = resource[property].length;
						display = display + "<td>";
						for (var i = 0; i < len; i++) {
							
							var stringProperty2 = JSON.stringify(resource[property][i]);
							
							if(typeof resource[property] === 'string' || typeof resource[property] === 'number'){
								display = display + resource[property][i] + "<br> ";
							}
							else if(stringProperty2.charAt(0) == "{"){
								display = display + this.displayResource(resource[property][i]) + "<br> ";
							}
						}
						display = display + "</td>";
					}
				}
				 
			}
		}
		
		display = display + "</table>";
		
	};

	
	
	
	
	
});