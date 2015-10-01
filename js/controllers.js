'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);
var url = "http://parssv.com/phpTrander/";

phonecatControllers.controller('PhoneListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('phones/phones.json').success(function(data) {
      $scope.phones = data;
    });

    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 
  function($scope, $routeParams) {
    $scope.phoneId = $routeParams.phoneId;
  }]);

/****** Home Page controller *****/  
phonecatControllers.controller('homePageCtrl', ['$scope', '$http', '$location', 'Auth',
  function($scope, $http, $location, Auth) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get(url +'?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.name = $scope.userData.name;
				$scope.location = $scope.userData.location;
				$scope.newsletter = $scope.userData.newsletter;
				$scope.userID = $scope.userData.id;
				
				console.log($scope.userID);
				$scope.loading = true;
					$http.get('http://parssv.com/phpTrander/?action=show_profile_pic&user_id='+ $scope.userID).success(function(data) {
						$scope.profilePic = data;
						$scope.image = $scope.profilePic.profile;
						console.log($scope.profilePic);
						$scope.loading = false;
					});
					
					$http.get('http://parssv.com/phpTrander/?action=get_user_name&user_id='+ $scope.userID).success(function(data) {
						$scope.name = data;
						$scope.loading = false;
					});
					
					new Firebase('https://scorching-heat-3768.firebaseio.com/'+ $scope.name).transaction(function(currValue) {
					return (currValue||0)+1;
					}, function(err, success, snap) {
						if( err ) { throw err; }
						console.log('counter updated to '+snap.val());
					});
					
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	$scope.logout = function(){
		$scope.loading = true;
		console.log($scope.name);
		//var presenceRef = new Firebase("https://scorching-heat-3768.firebaseio.com/presence");
		//presenceRef.child($scope.name).remove();
		//Firebase.goOffline();
		
		
		Auth.$unauth();
		// unset localstorage username and password variables
		localStorage.setItem("tranderEmail", "");
		localStorage.setItem("tranderPassword", "");
		var pathurl = "/login";
		$scope.loading = false;
		$location.path(pathurl)
	}
}]);

/****** Login Page controller *****/
phonecatControllers.controller('loginPageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl);
	}
	
	if (localStorage.getItem("tranderEmail") !== "") {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			console.log($scope.userData);
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				var pathurl = "/home";
				console.log(pathurl);
				$location.path(pathurl);
				
			}
			if($scope.userData.status == 'registered'){
				var pathurl = "/verify";
				console.log(pathurl);
				$location.path(pathurl);
			}
		});
		
		}
	 
	
	$scope.username = "";
	$scope.password = "";
	
		$scope.submit = function(){
			Firebase.goOnline();
			var ref = new Firebase("https://scorching-heat-3768.firebaseio.com");
			ref.authWithPassword({
			  email    : $scope.email,
			  password : $scope.password
			}, function(error, authData) {
			  if (error) {
				console.log("Login Failed!", error);
			  } else {
				console.log("Authenticated successfully with payload:", authData);
			  }
			});
			$scope.loading = true;
			$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.email +'&password='+ $scope.password).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
			if($scope.userDetails.status == 'verified'){
				var pathurl = "/home";
				console.log(pathurl);
				
				// Check browser support
				if (typeof(Storage) != "undefined") {
					// set localstorage username and password variables
					localStorage.setItem("tranderEmail", $scope.email);
					localStorage.setItem("tranderPassword", $scope.password);
					
					//saving username and password to localstoarge.
					$scope.tranderEmail = localStorage.getItem("tranderEmail");
					$scope.tranderPassword = localStorage.getItem("tranderPassword");
					
					$location.path(pathurl)  //uncomment to redirect to the home page
				} 
				else {
					document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
				}
				
			}
		});
		}
	
}]);

/****** Registration Page controller *****/
phonecatControllers.controller('registrationPageCtrl', ['$scope', '$http', '$location', 'Auth',
  function($scope, $http, $location, Auth) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (localStorage.getItem("tranderProfileCount") == "0" && localStorage.getItem("tranderRegisteredUserId") !== null) {
		var pathurl = "/buyProfile";
		console.log(pathurl);
		$location.path(pathurl);
	}
	
	if(localStorage.getItem("tranderProfileCount") == 2){
		$scope.tranderProfileCount = localStorage.getItem("tranderProfileCount");
		$scope.old_user = localStorage["tranderRegisteredUserId"];
	}
	$scope.obj = {orderid: " "};
	
	$scope.submit = function(){
		$scope.loading = true;
		console.log($scope.name);
		console.log($scope.age);
		console.log($scope.email);
		console.log($scope.password);
		console.log($scope.gender);
		console.log($scope.obj.orderid);
		console.log($scope.old_user);
		
		
      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      });
   
		
		$http.get('http://parssv.com/phpTrander/?action=register&name='+ $scope.name +'&age='+ $scope.age +'&email='+ $scope.email +'&password='+ $scope.password +'&gender='+ $scope.gender +'&order_id='+ $scope.obj.orderid +'&old_user='+ $scope.old_user).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
			if($scope.userDetails.success == 'true')
			{
				localStorage["tranderProfileCount"] = "0";
				localStorage["tranderRegisteredUserId"] = $scope.userDetails.user_id;

				//...
				//var storedNames = JSON.parse(localStorage["names"]);
				var pathurl = "/verify";
				console.log(pathurl);
				$location.path(pathurl);
			}
		});
	}
}]);

/****** user verification Page controller *****/
phonecatControllers.controller('verifyPageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	$scope.submit = function(){
			$scope.loading = true;
			$http.get('http://parssv.com/phpTrander/?action=verify&token='+ $scope.token).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
			if($scope.userDetails.success == 'true')
			{
				var pathurl = "/profile";
				console.log(pathurl);
				$location.path(pathurl);
			}
		});
	}
}]);


/****** Profile Page controller *****/
phonecatControllers.controller('profilePageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
				$http.get('http://parssv.com/phpTrander/?action=show_profile&user_id='+ $scope.userID).success(function(data) {
						$scope.profileData = data;
						$scope.loading = false;
						$scope.height = $scope.profileData.height;
						$scope.weight = $scope.profileData.weight;
						$scope.ethnicity = $scope.profileData.ethnicity;
						$scope.btype = $scope.profileData.body_type;
						$scope.looking = $scope.profileData.looking_for;
						$scope.about = $scope.profileData.about_me;
						$scope.age = $scope.profileData.age;
						$scope.gps = $scope.profileData.gps;
					});
				$http.get('http://parssv.com/phpTrander/?action=get_user_name&user_id='+ $scope.userID).success(function(data) {
					$scope.data = data;
					$scope.name = $scope.data.name;
					$scope.gender = $scope.data.gender;
					console.log($scope.data);
				});
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	$scope.submit = function(){
			$scope.loading = true;
			console.log($scope.looking);
			console.log($scope.name);
			console.log($scope.gender);
			console.log($scope.userID);
			console.log($scope.height);
			console.log($scope.weight);
			console.log($scope.gps);
			$http.get('http://parssv.com/phpTrander/?action=add_user_profile&gender='+ $scope.gender +'&user_id='+ $scope.userID +'&name='+ $scope.name +'&height='+ $scope.height +'&weight='+ $scope.weight +'&age='+ $scope.age +'&body_type='+ $scope.btype +'&about='+ $scope.about +'&looking='+ $scope.looking +'&gps='+ $scope.gps +'&ethnicity='+ $scope.ethnicity).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
		});
	}
}]);

/****** Photos Page controller *****/
phonecatControllers.controller('photosPageCtrl', ['$scope', '$http', '$location', '$timeout', '$compile', 'Upload', 
function ($scope, $http, $location, $timeout, $compile, Upload) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
				$scope.name = $scope.userData.name;
				$http.get('http://parssv.com/phpTrander/?action=show_images&user_id='+ $scope.userID).success(function(data) {
				$scope.content = data;
				console.log($scope.content);
					if($scope.content.success == "true"){
						$scope.pageContent = $scope.content.type;
						console.log($scope.pageContent);
					}
				});
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	$scope.submit = function() {
		$scope.image_submit($scope.userID);
		console.log($scope.userID);
		console.log($scope.path);
	};
	
	$scope.setPrivate = function(id) {
		console.log(id);
		$scope.photo_id = id;
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=make_private&photo_id='+ $scope.photo_id +'&user_id='+$scope.userID).success(function(data) {
			$scope.imgDetails = data;
			console.log($scope.userDetails);
			$scope.loading = false;
		});
	};
	
	$scope.setPublic = function(id) {
		console.log(id);
		$scope.photo_id = id;
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=make_public&photo_id='+ $scope.photo_id +'&user_id='+$scope.userID).success(function(data) {
			$scope.imgDetails = data;
			$scope.loading = false;
			
		});
	};
	
	$scope.setPictureProfile = function(id) {
		console.log(id);
		$scope.photo_id = id;
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=set_profile&photo_id='+ $scope.photo_id +'&user_id='+$scope.userID).success(function(data) {
			$scope.imgDetails = data;
			$scope.loading = false;
		});
	};
	
	$scope.del = function (image_id) {
		$scope.photo_id = image_id;
		console.log($scope.photo_id);
		if(confirm("Do You Really Want to Delete!")){
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=delete_picture&photo_id='+ $scope.photo_id).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			window.location.reload();
		});
	}
  };
  
  $scope.$watch('files', function () {
             $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: 'http://parssv.com/phpTrander/?action=test', 
                        headers: {'Content-Type': file.type},
                        method: 'POST',
                        data: file,
                        file: file, 
                    }).progress(function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
						file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						var progressPercentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
						file.result = data;
                        $scope.image_submit = function(id) {
							console.log(id);
							console.log(config.file.name);
							var path = 'http://parssv.com/phpTrander/uploads/'+ config.file.name;
							$scope.loading = true;
						   $http.get('http://parssv.com/phpTrander/index.php?action=insert_photo&path='+ path +'&user_id='+ id).success(function(data) {
							$scope.itemDetails = data;
							console.log($scope.itemDetails);
							$scope.loading = false;
							window.location.reload();
							
							});
						};
            
                    });
                }
            }
		}
}]);

/****** Forgot Password Page controller *****/
phonecatControllers.controller('recoverPageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	$scope.submit = function(){
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=recover&email='+ $scope.email).success(function(data) {
		$scope.userDetails = data;
		$scope.loading = false;
		});
	}
  
}]);

/****** Browse Page controller *****/
phonecatControllers.controller('browsePageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
				$scope.loading = true;
				$http.get('http://parssv.com/phpTrander/?action=show_all_users&user_id='+ $scope.userID).success(function(data) {
					$scope.userData = data;
					$scope.loading = false;
				});
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	$scope.submit = function(){
		$scope.loading = true;
		console.log($scope.looking);
		console.log($scope.height);
		console.log($scope.btype);
		console.log($scope.weight);
		console.log($scope.ethnicity);
		console.log($scope.age);
		$http.get('http://parssv.com/phpTrander/?action=browse_user&age='+ $scope.age +'&weight='+ $scope.weight +'&height='+ $scope.height +'&ethnicity='+ $scope.ethnicity +'&btype='+ $scope.btype +'&looking_for='+ $scope.looking).success(function(data) {
		$('.members').hide();
		$('.filter_result').show();
		$scope.userFilterData = data;
		console.log($scope.userDetail);
		$scope.loading = false;
		});
	}
	
	$('.filter').hide();
	$scope.showFilter = function() {
		$('.filter').slideToggle();
	}
	
	$scope.userDetail = function(id) {
		var pathurl = "/userProfile";
		console.log(pathurl);
		$location.path(pathurl).search('user_id', id);
	};
	
	$scope.userFilterDetail = function(id) {
		var pathurl = "/userProfile";
		console.log(pathurl);
		$location.path(pathurl).search('user_id', id);
	};
}]);

/****** Message Page controller *****/
phonecatControllers.controller('messagePageCtrl', ['$scope', '$http', '$location', '$routeParams',
  function($scope, $http, $location, $routeParams) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
			
	
}]);
/****** Selected User Profile Page controller *****/
phonecatControllers.controller('userProfilePageCtrl', ['$scope', '$http', '$location', '$routeParams',
  function($scope, $http, $location, $routeParams) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	$scope.id = $routeParams.user_id;
	console.log($scope.id);
	
	$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=get_user_profile_details&user_id='+ $scope.id).success(function(data) {
			$scope.info = data;
			$scope.loading = false;
		});
		
	$scope.invite = function(){
		$http.get('http://parssv.com/phpTrander/?action=invite_user&request_to='+ $scope.id +'&request_from='+ $scope.userID).success(function(data) {
			$scope.message = data;
			$scope.loading = false;
		});
	}
}]);

/****** New Conversation Page controller *****/
phonecatControllers.controller('newMessagePageCtrl', ['$scope', '$http', '$location', 'Auth', '$routeParams',
  function($scope, $http, $location, Auth, $routeParams) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	$scope.friendName = $routeParams.friend_name;
	//console.log($scope.friendName);
	
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
				$scope.email = $scope.userData.email;
				//$scope.name = $scope.userData.name;
				$scope.password = $scope.userData.password;
				
				
				 var ref = new Firebase("https://scorching-heat-3768.firebaseio.com");
				ref.authWithPassword({
				  email    : $scope.tranderEmail,
				  password : $scope.tranderPassword
				}, function(error, authData) {
				  if (error) {
					console.log("Login Failed!", error);
				  } else {
					//console.log("Authenticated successfully with payload:", authData);
				  }
				});
				$http.get('http://parssv.com/phpTrander/?action=get_user_name&user_id='+ $scope.userID).success(function(data) {
					$scope.name = data;
					$scope.name = $scope.name.name;
					console.log($scope.name);
					$scope.loading = false;

    
		
	/*setOnline = function(uid){
	  var connectedRef = new Firebase("https://scorching-heat-3768.firebaseio.com/.info/connected");
	  var connected = $firebaseObject(connectedRef);
	  var online = $firebaseArray(usersRef.child(uid+'/online'));

	  connected.$watch(function (){
		if(connected.$value === true){
		  online.$add(true).then(function(connectedRef){
			connectedRef.onDisconnect().remove();
		  });
		}
	  });
	}*/
    /*$scope.removeUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$removeUser({
        email: $scope.email,
        password: $scope.password
      }).then(function() {
        $scope.success = "User removed";
      }).catch(function(error) {
        $scope.error = error;
      });
    };*/
	
		var ref = new Firebase("https://scorching-heat-3768.firebaseio.com");
		var authData = ref.getAuth();
		//console.log(authData);
		// Create a callback which logs the current auth state
		if (authData) {
			//console.log("User " + authData.uid + " is logged in with " + authData.provider);
			// CREATE A REFERENCE TO FIREBASE
			var messagesRef = new Firebase('https://scorching-heat-3768.firebaseio.com/');
			var path = $scope.name < $scope.friendName ? $scope.name +'/'+ $scope.friendName : $scope.friendName +'/'+ $scope.name;
			var messagesRef = ref.child("message/"+path);
			// REGISTER DOM ELEMENTS
			var messageField = $('#messageInput');
			var sendMessageBtn = $('#sendMessageBtn');
			var nameField = $('#nameInput');
			var messageList = $('#example-messages');
			// LISTEN FOR KEYPRESS EVENT
			
			
			
			sendMessageBtn.click(function (e) {
				//if (e.keyCode == 13) {
				//FIELD VALUES
				var username = nameField.val();
				var status = "unread";
				var message = messageField.val();
				if(message == "" || message == null){
				}else{
					//SAVE DATA TO FIREBASE AND EMPTY FIELD
					messagesRef.push({status:status, name:username, text:message, from:$scope.userID});
					messageField.val('');
				}
				//}
			});
			
			var presenceRef = new Firebase("https://scorching-heat-3768.firebaseio.com/presence/"+ $scope.friendName);
				presenceRef.on("value", function(snap) {
						var key = snap.key();
						var value = snap.val();
						//console.log(key);
						if (value.status === true) {
							$('#status').html('online');
						}
						else{
							$('#status').html('offline');
						}
					});
			
			// Add a callback that is triggered for each chat message.
			messagesRef.limitToLast(20).on('child_added', function (snapshot) {
			//GET DATA
			var num = snapshot.numChildren();
			var data = snapshot.val();
			var key = snapshot.key();
			console.log(key);
			var username = data.name || "anonymous";
			var message = data.text;
			var matchUsername = $scope.name;
			if(matchUsername == username){
				var bubbleClass = "bubble-left";
			}else{
				var bubbleClass = "bubble-right";
				/*path = messagesRef.toString();
				console.log(path);
			    var updateRef = new Firebase(path +"/"+ key);
				updateRef.update({status:status});*/
			}
			//$scope.dat.push(data);
			//console.log("File Path:"+ $scope.path[]);
			//console.log(num);
			//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			var messageElement = $("<div class='"+ bubbleClass +"'>");
			var nameElement = $("<strong class='example-chat-username'></strong>")
			nameElement.text(username);
			//messageElement.html("<p class='"+ bubbleClass +"'>"+ message +"</p>").prepend(nameElement);
			messageElement.html("<p>"+ message +"</p>");

			//ADD MESSAGE
			messageList.append(messageElement)
			//console.log("appended");
			//SCROLL TO BOTTOM OF MESSAGE LIST
			messageList[0].scrollTop = messageList[0].scrollHeight;
			});
		} else {
			console.log("User is logged out");
		}
	  
	  });
	}
	else{
		var pathurl = "/login";
		console.log(pathurl);
		$scope.loading = false;
		$location.path(pathurl);
	}
	});
  
}]);


/****** Favourite Page controller *****/
phonecatControllers.controller('favouritePageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
}]);

/****** Trander Parties Page controller *****/
phonecatControllers.controller('trandingPageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
				$scope.email = $scope.userData.email;
				$scope.name = $scope.userData.name;
				$scope.password = $scope.userData.password;
				console.log($scope.email);
				 var ref = new Firebase("https://scorching-heat-3768.firebaseio.com");
				ref.authWithPassword({
				  email    : $scope.tranderEmail,
				  password : $scope.tranderPassword
				}, function(error, authData) {
				  if (error) {
					console.log("Login Failed!", error);
				  } else {
					console.log("Authenticated successfully with payload:", authData);
				  }
				});
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	var ref = new Firebase("https://scorching-heat-3768.firebaseio.com");
	var authData = ref.getAuth();
	console.log(authData);
	// Create a callback which logs the current auth state
	if (authData) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
	     
		// CREATE A REFERENCE TO FIREBASE
		var messagesRef = new Firebase('https://scorching-heat-3768.firebaseio.com/public');

		// REGISTER DOM ELEMENTS
		var messageField = $('#messageInput');
		var nameField = $('#nameInput');
		var messageList = $('#example-messages');

		// LISTEN FOR KEYPRESS EVENT
		messageField.keypress(function (e) {
			if (e.keyCode == 13) {
				//FIELD VALUES
				var username = nameField.val();
				var message = messageField.val();
				

				//SAVE DATA TO FIREBASE AND EMPTY FIELD
				messagesRef.push({name:username, text:message, userId:$scope.userID});
				messageField.val('');
			}
		});

		// Add a callback that is triggered for each chat message.
		messagesRef.limitToLast(10).on('child_added', function (snapshot) {
		//GET DATA
		var data = snapshot.val();
		var username = data.name || "anonymous";
		var message = data.text;
		var matchUsername = $scope.name;
		if(matchUsername == username){
			var bubbleClass = "bubble-left";
		}else{
			var bubbleClass = "bubble-right";
		}

		//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
		var messageElement = $("<div class='"+ bubbleClass +"'>");
		var nameElement = $("<strong class='example-chat-username'></strong>")
		nameElement.text(username);
		//messageElement.html("<p class='"+ bubbleClass +"'>"+ message +"</p>").prepend(nameElement);
		messageElement.html("<p>"+ message +"</p>");

		//ADD MESSAGE
		messageList.append(messageElement)

		//SCROLL TO BOTTOM OF MESSAGE LIST
		messageList[0].scrollTop = messageList[0].scrollHeight;
		});
  
		$scope.deleteChat = function(snap) {
			console.log('delete');
			//snap.ref().remove();
			messagesRef.remove();
		};


    } else {
		console.log("User is logged out");
	  }
  
}]);

/****** Show user's friend Page controller *****/
phonecatControllers.controller('usersPageCtrl', ['$scope', '$http', '$location', '$firebaseArray',
  function($scope, $http, $location, $firebaseArray) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	if (1 == 1) {
		$scope.tranderEmail = localStorage.getItem("tranderEmail");
		$scope.tranderPassword = localStorage.getItem("tranderPassword");
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
			$scope.userData = data;
			$scope.loading = false;
			if($scope.userData.status == 'verified'){
				$scope.userID = $scope.userData.id;
				$scope.email = $scope.userData.email;
				$scope.name = $scope.userData.name;
				$scope.password = $scope.userData.password;
				console.log($scope.email);
				$http.get('http://parssv.com/phpTrander/?action=get_user_friend_list&user_id='+ $scope.userID).success(function(data) {
					$scope.users = data;
					console.log($scope.users);
				});
				var connectedRef = new Firebase("https://scorching-heat-3768.firebaseio.com/.info/connected");
				var presenceRef = new Firebase("https://scorching-heat-3768.firebaseio.com/presence");
				var lastOnlineRef = new Firebase("https://scorching-heat-3768.firebaseio.com/lastonline/"+ $scope.name);
				connectedRef.on("value", function(snap) {
					if (snap.val()) {
						//alert("connected");
						lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
						//Firebase.goOnline();
						presenceRef.child($scope.name).onDisconnect().remove();
						presenceRef.child($scope.name).set({id:$scope.userID, name:$scope.name, status:true});
					  } else {
						//alert("not connected");
						presenceRef.child($scope.name).remove();
						}
				});
					
				var ref = new Firebase('https://scorching-heat-3768.firebaseio.com/presence');
				var obj = $firebaseArray(ref);
				// To make the data available in the DOM, assign it to $scope
				$scope.data = obj;
						
			}
			else{
				var pathurl = "/login";
				console.log(pathurl);
				$scope.loading = false;
				$location.path(pathurl);
			}
		});
	}
	
	$scope.showChat = function(name) {
		var messagesRef = new Firebase('https://scorching-heat-3768.firebaseio.com/message/'+ name);
		var status = "read";
		//messagesRef.push({status:status});
		var pathurl = "/newMessage";
		console.log(pathurl);
		$location.path(pathurl).search('friend_name', name);
	};
	
	$scope.menuOptions = [
          ['Block User', function (uid) {
           alert(uid);
          }],
          null,
          ['Add to Favourates', function () {
             
          }, function () {
             
          }]
      ];
	
}]);

/****** Show user's friend Page controller *****/
phonecatControllers.controller('addFilterPageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
}]);

phonecatControllers.controller('buyProfilePageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl);
	}
	
	localStorage["tranderProfileCount"] = 2;
	$scope.reid = localStorage.getItem("tranderRegisteredUserId");
	$scope.url = "http://parssv.com/phpTrander/buyprofile.php?registered_id="+ $scope.reid;
	changeFrame($scope.url);
	
}]);


/*
var connectedRef = new Firebase("https://scorching-heat-3768.firebaseio.com/.info/connected");
					var presenceRef = new Firebase("https://scorching-heat-3768.firebaseio.com/presence");
					var lastOnlineRef = new Firebase("https://scorching-heat-3768.firebaseio.com/lastonline/"+ $scope.name);
					connectedRef.on("value", function(snap) {
					   if (snap.val()) {
						//alert("connected");
						lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
						//Firebase.goOnline();
						presenceRef.onDisconnect().remove();
						presenceRef.push({name:$scope.name, status:true});
					  } else {
						
						//alert("not connected");
						presenceRef.set(false);
						
					  }
					});
					
				presenceRef.on('child_added', function (snapshot) {
				//GET DATA
				var data = snapshot.val();
				snapshot.forEach(function(vote) {
					$scope.log.push({name: data.name, value:data.status});
				});
				console.log($scope.log);
				});*/

phonecatControllers.controller('testCtrl', ['$scope', '$http', '$timeout', '$compile', 'Upload', 
function ($scope, $http, $timeout, $compile, Upload) {
   $scope.$watch('files', function () {
             $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: 'http://parssv.com/phpTrander/?action=test', 
                        headers: {'Content-Type': file.type},
                        method: 'POST',
                        data: file,
                        file: file, 
                    }).progress(function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
						file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        $scope.image_submit = function() {
            /*$http.post('http://parssv.com/phpTrander/?action=insert_photo', 
            {
            'img_name' : config.file.name, 
            'img_src' : '../images/' + config.file.name
            }
            )
            .success(function (data, status, headers, config) {
            $scope.get_image();
            })

            .error(function(data, status, headers, config){

            });*/
            };
            $scope.image_submit();
                    });
                }
            }
		}
}]);
