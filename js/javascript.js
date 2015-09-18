window.onload = function(){

	
	var repoUrlRoot = 'https://api.github.com/users/pauleamondoyle/repos?token=13a53698751202273971595ed307c8f8cb58c658'
	var userUrlRoot = 'https://api.github.com/users/pauleamondoyle?token=13a53698751202273971595ed307c8f8cb58c658'
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
//  ________________________________________________________________

	var addRepos = function(repoArray){
		var listElement = $("#repo-list")[0];
		repoArray.forEach(function(repoObject){
			listElement.innerHTML += 
				"<li><div class='repoNameContainer'> <a href=" + repoObject.svn_url +">" + repoObject.name + "</a> <span class='repoTimeStamp'> <p>" + relativeTime(repoObject.updated_at) + "</p> </span> </div>" + "<div class='repoDetailContainer'> <p> <span class='repoDetails'>" + repoObject.language + " " + "&nbsp;" + "<a> <i class='material-icons'> grade </i> &nbsp;" + repoObject.stargazers_count + "&nbsp;" + "</a>" + " " + "<a><i class='material-icons'> call_split </i> &nbsp;" + repoObject.forks + "</a></span> </p> </div> </li>"
		})
	}

	var addUserInfo = function(userObj){
		var avatarImg = $("#avatar")[0],
			userName = $("#userName")[0],
			contactInfoBox = $("#contact-info")[0],
			followerBox = $("#followers")[0],
			createdFullDate = userObj.created_at
			
		avatarImg.src = userObj.avatar_url;
		userName.innerHTML = "<p>" + userObj.name + "</p> <p>" + userObj.login + "</p>" 
		contactInfoBox.innerHTML = "<p> <i class='material-icons'> location_on </i>" + "&nbsp;"+ " " +  userObj.location + "</p> <p> <i class='material-icons'> email </i>" + " " + "&nbsp;" + "<a href='mailto:'" + userObj.email + ">" + userObj.email + "</a> </p><p><i class='material-icons'> av_timer </i> Joined on " + createdFullDate + "</p>"
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

	getGit();	

	console.log('ajaxCalled')

}