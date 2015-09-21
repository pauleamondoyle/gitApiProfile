window.onload = function(){

	
	var repoUrlRoot = 'https://api.github.com/users/pauleamondoyle/repos?token=e34775cfdc0227206b523042529cd594259674ec'
	var userUrlRoot = 'https://api.github.com/users/pauleamondoyle?token=e34775cfdc0227206b523042529cd594259674ec'
	
//  ________________________________________________________________
// Relative time function from http://stackoverflow.com/questions/7516548/how-to-convert-date-and-time-to-timeago-format-in-jquery

	function relativeTime(date_str) {
	    if (!date_str) {return;}
	    date_str = $.trim(date_str);
	    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
	    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
	    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
	    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
	    var parsed_date = new Date(date_str);
	    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
	    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
	    delta=(delta<2)?2:delta;
	    var r = '';
	    if (delta < 60) {
	    r = delta + ' seconds ago';
	    } else if(delta < 120) {
	    r = 'a minute ago';
	    } else if(delta < (45*60)) {
	    r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
	    } else if(delta < (2*60*60)) {
	    r = 'an hour ago';
	    } else if(delta < (24*60*60)) {
	    r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
	    } else if(delta < (48*60*60)) {
	    r = 'a day ago';
	    } else {
	    r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
	    }
	    return r;
	};

// ________________________________________________________________
// FORMAT DISPLAY DATE TO "MONTH" DD, YEAR FORMAT

var joinedYear = "",
	joinedDate = "",
	joinedMonth = ""
var monthObj = {01: "January", 02: "February", 03: "March", 04: "April", 05: "May", 06: "June", 07: "July", 08: "August", 09: "September", 10: "October", 11: "November", 12: "December"}


var formatYear = function(gitJoinedDate){
	joinedYear = gitJoinedDate.slice(0,4)
	return joinedYear;
}

var formatMonth = function(gitJoinedDate){
	var joinedMonthKey = gitJoinedDate.slice(5,7)
	joinedMonth = monthObj[joinedMonthKey]
	return joinedMonth
}

var formatDate = function(gitJoinedDate){
	joinedDate = gitJoinedDate.slice(8,10)
	return joinedDate
}

// ________________________________________________________________
// AJAX SUCCESS FUNCTIONS

	var addRepos = function(repoArray){
		var listElement = $("#repo-list")[0];
		listElement.innerHTML = ""
		repoArray.forEach(function(repoObject){
			listElement.innerHTML += "<li> <div class='repoNameContainer'> <a href=" + repoObject.svn_url +">" + repoObject.name + "</a> <span class='repoTimeStamp'> <p>" + relativeTime(repoObject.updated_at) + "</p> </span> </div>" + "<div class='repoDetailContainer'> <p> <span class='repoDetails'>" + repoObject.language + " " + "&nbsp;" + "<a> <i class='material-icons'> grade </i> &nbsp;" + repoObject.stargazers_count + "&nbsp;" + "</a>" + " " + "<a><i class='material-icons'> call_split </i> &nbsp;" + repoObject.forks + "</a></span> </p> </div> </li>"
		})
	}

	var addUserInfo = function(userObj){
		var avatarImg = $("#avatar")[0],
			userName = $("#userName")[0],
			contactInfoBox = $("#contact-info")[0],
			followerBox = $("#followers")[0],
			createdFullDate = userObj.created_at
		userName.innerHTML = ""
		contactInfoBox.innerHTML = ""
		followerBox.innerHTML = ""
		avatarImg.innerHTML = ""	
		avatarImg.src = userObj.avatar_url;
		userName.innerHTML = "<p>" + userObj.name + "</p> <p>" + userObj.login + "</p>" 
		contactInfoBox.innerHTML = "<p> <i class='material-icons'> location_on </i>" + "&nbsp;"+ " " +  userObj.location + "</p> <p> <i class='material-icons'> email </i>" + " " + "&nbsp;" + "<a href='mailto:'" + userObj.email + ">" + userObj.email + "</a> </p><p><i class='material-icons'> av_timer </i> Joined on " + formatMonth(createdFullDate) + " " + formatDate(createdFullDate) + ", " + formatYear(createdFullDate) + "</p>"
			
		followerBox.innerHTML = "<p class='followerData'> <a href='https://github.com/pauleamondoyle/followers'>" + userObj.followers + "<br><span> Followers</span> </p> </a> <p class='followerData'> <a href='https://github.com/stars'>" + userObj.public_gists + "<br> <span> Starred </span> </p> </a> <p class='followerData'> <a href='https://github.com/pauleamondoyle/following'>" + userObj.following + "<br> <span> Following </span> </p> </a>"
	}

	var repoSuccessFunction = function(responseData){
		console.log('Got the repo data')
		console.log(responseData)
		addRepos(responseData)
	}

	var userSuccessFunction = function(responseData){
		console.log('Got the user data')
		console.log(responseData)
		addUserInfo(responseData)
	}


// ________________________________________________________________
// AJAX FUNCTIONS & LOAD SITE

	var repoAjaxParams = {
		url: repoUrlRoot,
		success: repoSuccessFunction 
	}

	var userAjaxParams = {
		url: userUrlRoot,
		success: userSuccessFunction
	}

	var getGit = function(){
		$.ajax(userAjaxParams)
		$.ajax(repoAjaxParams)
	}


// ________________________________________________________________
// SEARCH FUNCTION & ROUTING

	var getSearchInput = function(event){
		if (event.keyCode === 13){
			var inputElement = event.srcElement
			var userValue = inputElement.value
			inputElement.value = ""
			location.hash = userValue
		}
	}
	
	var searchGit = function(){
		var userValue = location.hash.slice(1)
		var searchUrlRoot = "https://api.github.com/users/"
		var apiKey = "token=e34775cfdc0227206b523042529cd594259674ec"

		var repoSearchAjaxParams = {
			url: searchUrlRoot + userValue + "/repos?" + apiKey,
			success: repoSuccessFunction
		}

		var userSearchAjaxParams = {
			url: searchUrlRoot + userValue + "?" + apiKey,
			success: userSuccessFunction
		}
			$.ajax(userSearchAjaxParams)
			$.ajax(repoSearchAjaxParams)	
	}

	window.onhashchange = function(){
		var userValue = location.hash.slice(1)
		searchGit(userValue)
	}

	var performSearch = function(){
		var inputElement = $("input")[0]
		inputElement.onkeypress = getSearchInput
		var userValue = location.hash
		searchGit(userValue)
	}


// ________________________________________________________________
// GO!

	getGit();	

	console.log('ajaxCalled')

	performSearch()

}

//Routing: 
// event listeners: enter keystroke -> location.hash=input.value.  Second event listener window.onhashchange (but window.ADDhashchange is better?). So the input.value becomes  the onhash, which changes the url. But then you need to add the onhash listener so that when the hash changes in the url, the page changes. Make api url variable, a username variable (I guess that's onhash?), and the api key to use for ajax.