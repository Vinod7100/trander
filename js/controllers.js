'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);


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
		$http.get('http://parssv.com/phpTrander/?action=login&email='+ $scope.tranderEmail +'&password='+ $scope.tranderPassword).success(function(data) {
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
						console.log($scope.profilePic);
						$scope.loading = false;
					});
					
					$http.get('http://parssv.com/phpTrander/?action=get_user_name&user_id='+ $scope.userID).success(function(data) {
						$scope.name = data;
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
	
	$scope.logout = function(){
		$scope.loading = true;
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
		});
		
		}
	 
	
	$scope.username = "";
	$scope.password = "";
	
		$scope.submit = function(){
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
	
	$scope.submit = function(){
		$scope.loading = true;
		console.log($scope.name);
		console.log($scope.age);
		console.log($scope.email);
		console.log($scope.password);
		console.log($scope.gender);
		
		
      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      });
   
		
		$http.get('http://parssv.com/phpTrander/?action=register&name='+ $scope.name +'&age='+ $scope.age +'&email='+ $scope.email +'&password='+ $scope.password +'&gender='+ $scope.gender).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
			if($scope.userDetails.success == 'true')
			{
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
				/*var pathurl = "/basic_info";
				console.log(pathurl);
				$location.path(pathurl);*/
			}
		});
	}
}]);

/****** User Basic Profile Info Page controller *****/
phonecatControllers.controller('basicPageCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
	  
	$scope.showPage = function(pathurl){
		console.log(pathurl);
		$location.path(pathurl)
	}
	
	
	
	$scope.submit = function(){
			$scope.loading = true;
			console.log($scope.name);
			console.log($scope.height);
			console.log($scope.weight);
			console.log($scope.gps);
			$http.get('http://parssv.com/phpTrander/?action=add_user_profile&name='+ $scope.name +'&height='+ $scope.height +'&weight='+ $scope.weight +'&age='+ $scope.age +'&body_type='+ $scope.btype +'&about='+ $scope.about +'&looking='+ $scope.looking +'&gps='+ $scope.gps +'&ethnicity='+ $scope.ethnicity).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
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
			console.log($scope.name);
			console.log($scope.userID);
			console.log($scope.height);
			console.log($scope.weight);
			console.log($scope.gps);
			$http.get('http://parssv.com/phpTrander/?action=add_user_profile&user_id='+ $scope.userID +'&name'+ $scope.name +'&height='+ $scope.height +'&weight='+ $scope.weight +'&age='+ $scope.age +'&body_type='+ $scope.btype +'&about='+ $scope.about +'&looking='+ $scope.looking +'&gps='+ $scope.gps +'&ethnicity='+ $scope.ethnicity).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			console.log($scope.userDetails);
		});
	}
}]);

/****** Photos Page controller *****/
phonecatControllers.controller('photosPageCtrl', ['$scope', '$http', '$location', 'FileUploader',
  function($scope, $http, $location, FileUploader) {
	  
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
				$http.get('http://parssv.com/phpTrander/?action=show_images&user_id='+ $scope.userID).success(function(data) {
				$scope.content = data;
				console.log($scope.content);
				if($scope.content.success == "true"){
					$scope.pageContent = $scope.content.message;
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
		console.log($scope.userID);
		console.log($scope.path);
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/index.php?action=insert_photo&path='+ $scope.path +'&user_id='+$scope.userID).success(function(data) {
			$scope.itemDetails = data;
			console.log($scope.itemDetails);
			$scope.loading = false;
		});
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
			//window.location.reload();
		});
	};
	
	$scope.setPictureProfile = function(id) {
		console.log(id);
		$scope.photo_id = id;
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=set_profile&photo_id='+ $scope.photo_id +'&user_id='+$scope.userID).success(function(data) {
			$scope.imgDetails = data;
			$scope.loading = false;
			//window.location.reload();
		});
	};
	
	$scope.del = function (image_id) {
		if(confirm("Do You Really Want to Delete!")){
		$scope.photo_id = image_id;
		console.log($scope.photo_id);
		$scope.loading = true;
		$http.get('http://parssv.com/phpTrander/?action=delete_picture&photo_id='+ $scope.photo_id).success(function(data) {
			$scope.userDetails = data;
			$scope.loading = false;
			window.location.reload();
		});
	}
  };
  
  $scope.$watch('status', function(status) {
       console.log(status);
    });
	
	 var uploader = $scope.uploader = new FileUploader({
            url: 'http://parssv.com/phpTrander/index.php?action=upload_photos'
        });
		
	uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

		$scope.path = [];
        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
			console.log(fileItem);

        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
			
			var myEl = angular.element('#item-images');
			$scope.path.push(response.path);
			//console.log("File Path:"+ $scope.path[]);
			//myEl.append("<input type='text' name='abc' ng-model='path' value=''/>");
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
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
	
		
		
		$scope.userDetail = function(id) {
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
				
	

   /* var connectedRef = new Firebase("https://scorching-heat-3768.firebaseio.com/.info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === true) {
		$scope.status == 'connected';
        //alert("connected");
      } else {
		$scope.status == 'Disconnected';
        //alert("not connected");
      }
    });*/
	
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
		console.log(authData);
		// Create a callback which logs the current auth state
		if (authData) {
			console.log("User " + authData.uid + " is logged in with " + authData.provider);
			
			// CREATE A REFERENCE TO FIREBASE
			var messagesRef = new Firebase('https://scorching-heat-3768.firebaseio.com/');
			var path = $scope.name < $scope.friendName ? $scope.name+'/'+$scope.friendName : $scope.friendName+'/'+$scope.name;
			var messagesRef = ref.child("message/"+path);
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
				messagesRef.push({name:username, text:message, from:$scope.userID});
				messageField.val('');
				}
			});

			// Add a callback that is triggered for each chat message.
			messagesRef.limitToLast(10).on('child_added', function (snapshot) {
			//GET DATA
			var data = snapshot.val();
			$scope.data = snapshot.val();
			var username = data.name || "anonymous";
			var message = data.text;
			
			//$scope.dat.push(data);
			//console.log("File Path:"+ $scope.path[]);
			console.log(data);
			//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			var messageElement = $("<div>");
			var nameElement = $("<strong class='example-chat-username'></strong>")
			nameElement.text(username);
			messageElement.text(message).prepend(nameElement);

			//ADD MESSAGE
			messageList.append(messageElement)

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

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var messageElement = $("<li>");
    var nameElement = $("<strong class='example-chat-username'></strong>")
    nameElement.text(username);
    messageElement.text(message).prepend(nameElement);

    //ADD MESSAGE
    messageList.append(messageElement)

    //SCROLL TO BOTTOM OF MESSAGE LIST
    messageList[0].scrollTop = messageList[0].scrollHeight;
  });
  
  $scope.deleteChat = function(snap) {
       console.log('delete');
	   snap.ref().remove();
    };


      } else {
		console.log("User is logged out");
	  }
  
}]);

/****** Show user's friend Page controller *****/
phonecatControllers.controller('usersPageCtrl', ['$scope', '$http', '$location',
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
				$http.get('http://parssv.com/phpTrander/?action=get_user_friend_list&user_id='+ $scope.userID).success(function(data) {
				$scope.users = data;
				console.log($scope.users);
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
	
	$scope.showChat = function(name) {
		var pathurl = "/newMessage";
		console.log(pathurl);
		$location.path(pathurl).search('friend_name', name);
		
		
	};
	
}]);