<?php
    header('Access-Control-Allow-Origin: http://localhost');
	
	require_once('config.php');
	
	if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'register'){ //registeration process
		$name = $_REQUEST['name'];
		$email = $_REQUEST['email'];
		$password = $_REQUEST['password'];
		$age = $_REQUEST['age'];
                $gender = $_REQUEST['gender'];
		
		if($name == "" || $email == "" || $password == "" || $gender == ""){
			$array = array(
				'error' => 'true',
				'message' => 'All the fields are mandatory.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		
		$count = is_email_exixts($email);
		if($count >= 1){
			$array = array(
				'error' => 'true',
				'message' => 'Email already exists.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		
	        $date = date("F j, Y");
		$current_date = strtotime($date);
		
		$tocken = "kreative".$current_date;
		$tocken = md5($tocken);
		
		$link = $site_url."verify/".$tocken;
		
		//Create a new PHPMailer instance
		$mail = new PHPMailer;
		//Set who the message is to be sent from
		$mail->setFrom($admin_email, $site_title);
		//Set an alternative reply-to address
		$mail->addReplyTo($admin_email, $site_title);
		//Set who the message is to be sent to
		$mail->addAddress($email, $name);
		//Set the subject line
		$mail->Subject = $site_title.' email verification link';
		//Replace the plain text body with one created manually
		$mail->Body = "Dear ".$name."\r\n"."You are successfully registered at ".$site_title.". But your account is not activated yet. To activate your account use verification code given below."."\r\n".$tocken."\r\n"."\r\n"."Thanks,"."\r\n"."Regards: "."\r\n".$site_title." Team";

		//send the message, check for errors
		if (!$mail->send()) {
		//if(1 == 2){
			$array = array(
				'error' => 'true',
				'message' => $mail->ErrorInfo
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		} else {
			/*** INSERT data ***/
			$query = $dbh->prepare("INSERT INTO users(name, email, password, token, age, gender, status, date, profile_status) VALUES ('$name', '$email', '$password', '$tocken', '$age', '$gender', 'registered', '$current_date', 'unblocked')");
			$query->execute();
			$count = $query->rowCount();
			if(!$count)
			{
				$array = array(
					'error' => 'true',
					'message' => $dbh->errorInfo()
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
			else{
				$array = array(
					'success' => 'true',
					'message' => 'Please check your mailbox and varfiy your email address.'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
		}
	}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'verify'){ //registeration process
		$token = $_REQUEST['token'];
		
		if($token == ""){
			$array = array(
				'error' => 'true',
				'message' => 'Field can not be empty.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		
		$query = $dbh->prepare("SELECT * FROM users WHERE token = '$token'");
		$query->execute();
		$count = $query->rowCount();
		if($count == 1){
			$rows = $query->fetchAll();
			foreach($rows as $row){
			$user_id = $row['id'];
			$query = $dbh->prepare("UPDATE users SET status = 'verified' WHERE id = '$user_id'");
			$res = $query->execute();
			if($res){
					$array = array(
					'success' => 'true',
					'message' => 'User Verified !'
					);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
				}
			}
		}
		else{
			$array = array(
				'error' => 'true',
				'message' => 'Something Wrong! Please Check your verification code'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}

	}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'add_user_profile'){ //add new profile
		$height = $_REQUEST['height'];
		$weight = $_REQUEST['weight'];
		$age = $_REQUEST['age'];
		$body_type = $_REQUEST['body_type'];
		$about = $_REQUEST['about'];
		$looking_for = $_REQUEST['looking'];
		$gps = $_REQUEST['gps'];
		$ethnicity = $_REQUEST['ethnicity'];
		$name = $_REQUEST['name'];
                $user_id = '9';

		$count = is_profile_exist($user_id);
		if($conut == 1)
		{
			$query = $dbh->prepare("UPDATE user_profile SET profile_name = '$name', height = $height, weight = '$weight', age = '$age', body_type = '$body_type', looking_for = '$looking_for', about_me = '$about', ethnicity = '$ethnicity', gps = '$gps' WHERE user_id = '$user_id'";
			$query->execute();
			$count = $query->rowCount();
			if(!$count)
			{
				$array = array(
					'error' => 'true',
					'message' => $dbh->errorInfo()
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
			else{
				$array = array(
					'success' => 'true',
					'message' => 'Profile Updated Successfully'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
		}
		else{
		if($height == "" || $body_type == "" || $age == "" || $looking_for == "" || $gps == "" || $about == ""){
			$array = array(
				'error' => 'true',
				'message' => 'Fields cannot be empty'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		$query = $dbh->prepare("INSERT INTO user_profile(profile_name, height, weight, age, body_type, looking_for, about_me, user_id, ethnicity, gps) VALUES ('$name', '$height', '$weight', '$age', '$body_type', '$looking_for', '$about', '$user_id', '$ethnicity', '$gps')");
			$query->execute();
			$count = $query->rowCount();
			if(!$count)
			{
				$array = array(
					'error' => 'true',
					'message' => $dbh->errorInfo()
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
			else{
				$array = array(
					'success' => 'true',
					'message' => 'New Profile Added Successfully'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
		}
		
	}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'login'){ //login process
		$email = $_REQUEST['email'];
		$password = $_REQUEST['password'];
		
		if($email == "" || $password == ""){
			$array = array(
				'error' => 'true',
				'message' => 'Username and Password can not be empty.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		
		$query = $dbh->prepare("SELECT * FROM users WHERE email = '$email' AND password = '$password'");
		$query->execute();
		$count = $query->rowCount();
		
		if($count == 1){
                        $rows = $query->fetchAll();
			$user = array();
			foreach($rows as $row){
                             $user['id'] = $row['id'];
			     $user['name'] = $row['name'];
                             $user['status'] = $row['status'];
			    
			}
                 
			header( "Content-Type: application/json" );
			echo json_encode($user);
			die();
		}
		else{
			$array = array(
				'error' => 'true',
				'message' => 'Username or password do not match.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
	}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'recover'){ //Forgot password process
		$email = $_REQUEST['email'];
		
		if($email == ""){
			$array = array(
				'error' => 'true',
				'message' => 'You must proivde an email address.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		
		$result = $dbh->prepare("SELECT * FROM users WHERE email = '$email'");
		$result->execute();
		$count = $result->rowCount();
		if($count == 1){
			
			$rows = $result->fetchAll();
			foreach($rows as $row){	
				$user_password = $row['password'];
				$user_email = $row['email'];
				$user_name = $row['name'];
			}
				//Create a new PHPMailer instance
				$mail = new PHPMailer;
				//Set who the message is to be sent from
				$mail->setFrom($admin_email, $site_title);
				//Set an alternative reply-to address
				$mail->addReplyTo('no-reply@example.com', $site_title);
				//Set who the message is to be sent to
				$mail->addAddress($user_email, $user_name);
				//Set the subject line
				$mail->Subject = $site_title.' password recovery';
				//Replace the plain text body with one created manually
				$mail->Body = "Dear ".$user_name."\r\n"."Below is your password."."\r\n".$user_password."\r\n"."\r\n"."Thanks,"."\r\n"."Regards: "."\r\n".$site_title." Team";

				//send the message, check for errors
				if (!$mail->send()) {
				//if(1==2){
					$array = array(
						'error' => 'true',
						'message' => $mail->ErrorInfo
					);
					header( "Content-Type: application/json" );
					echo json_encode($array);
					die();
				} else {
					$array = array(
						'success' => 'true',
						'message' => 'Password has been sent to your email address.'
					);
					header( "Content-Type: application/json" );
					echo json_encode($array);
					die();
				}
		}
		else{
			$array = array(
				'error' => 'true',
				'message' => 'Email id you provided does not belong to any account.'
			);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
	}
	
	if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'upload_photos'){
			if ( !empty( $_FILES ) ) {
				$target_dir = "uploads/";
				$user_id = "";
				$date = time();
				$target_file = $target_dir . $date . $user_id . basename($_FILES["file"]["name"]);
						$access_file_path = $site_url."uploads/". $date . $user_id . basename($_FILES["file"]["name"]);
				$uploadOk = 1;
				$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
				// Check if image file is a actual image or fake image
				if(1 == 1) {
					$check = getimagesize($_FILES["file"]["tmp_name"]);
					if($check !== false) {
						//echo "File is an image - " . $check["mime"] . ".";
						$uploadOk = 1;
					} else {
						//echo "File is not an image.";
						$uploadOk = 0;
					}
				}
				// Check file size
				if ($_FILES["file"]["size"] > 1500000) {
					//echo "Sorry, your file is too large.";
					$uploadOk = 0;
				}
				// Allow certain file formats
				if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"&& $imageFileType != "gif" ) {
					//echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
					$uploadOk = 0;
				}
				// Check if $uploadOk is set to 0 by an error
				if ($uploadOk == 0) {
					echo "Sorry, your file was not uploaded.";
					// if everything is ok, try to upload file
				} else {
					if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
						//echo "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.";
                                               
						$array = array(
							'success' => 'true',
							'message' => 'Image uploaded.',
							'path' => $access_file_path
						);
						header( "Content-Type: application/json" );
						echo json_encode($array);
						die();
					} else {
						//echo "Sorry, there was an error uploading your file.";
						$array = array(
							'error' => 'true',
							'message' => 'Image not uploaded.'
						);
						header( "Content-Type: application/json" );
						echo json_encode($array);
						die();
					}
				}
			} else {
				echo 'No files';
			}
		
	}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'insert_photo'){
		$user_id = $_REQUEST['user_id'];
		$image_urls = $_REQUEST['path'];
        $image_urls = explode(',',$image_urls);
		$current_date = time();
		
		/*** INSERT data ***/
		if($image_urls != ""){
			foreach($image_urls as $image_url){
				$query1 = $dbh->prepare("INSERT INTO photos(image_url, user_id) VALUES ('$image_url', '$user_id')");
                $query1->execute();
				$count = $query1->rowCount();
				if(!$count)
				{
					$array = array(
						'error' => 'true',
						'message' => $dbh->errorInfo()
					);
					header( "Content-Type: application/json" );
					echo json_encode($array);
					die();
				}
				else{
					$array = array(
							'success' => 'true',
						
							'message' => 'Image uploaded Successfully...'
						);
						header( "Content-Type: application/json" );
						echo json_encode($array);
						die();
				}
			}
		}
			
	}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'show_images'){ //show user images
		$user_id = $_REQUEST['user_id'];
		
		$query = $dbh->prepare("SELECT * FROM photos WHERE user_id = '$user_id'");
        $query->execute();
		$rows = $query->fetchAll();
		$i = 0;
		foreach($rows as $row){
			$photo[$i]['id'] = $row['id'];
			$photo[$i]['image_url'] = $row['image_url'];
			$photo[$i]['type'] = $row['type'];
                        $i++;
		}
		
		
		header( "Content-Type: application/json" );
		echo json_encode($photo);
		die();
	}
if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'make_public'){ //
		$photo_id = $_REQUEST['photo_id'];
		$type = 'public';
		$count = count_public_image();
		if($count <= 2)
		{
			$query1 = $dbh->prepare("UPDATE photos SET type = '$type' WHERE id = '$photo_id'");
			$query1->execute();
			$count = $query1->rowCount();
			if(!$count)
			{
				$array = array(
				'error' => 'true',
				'message' => $dbh->errorInfo()
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
			else{
				$array = array(
				'success' => 'true',
				'message' => 'Picture updated'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
		}
		else{
			$array = array(
			'error' => 'true',
				'message' => 'exceed limit'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
		}
	}
if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'make_private'){ //make picture private
		$photo_id = $_REQUEST['photo_id'];
		$type = 'private';
		$count = count_private_image();
		if($count <= 3)
		{
			$query1 = $dbh->prepare("UPDATE photos SET type = '$type' WHERE id = '$photo_id'");
			$query1->execute();
			$count = $query1->rowCount();
			if(!$count)
			{
				$array = array(
				'error' => 'true',
				'message' => $dbh->errorInfo()
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
			else{
				$array = array(
				'success' => 'true',
				'message' => 'Picture updated'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
		}
		else{
			$array = array(
			'error' => 'true',
				'message' => 'exceed limit'.$count
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
		}
	}

        if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'delete_picture'){ //delete user photo
		$photo_id = $_REQUEST['photo_id'];
		
		$images = get_user_images($photo_id);
		foreach($images as $image){
			$image = get_real_url($image);
                        //unlink($image);
                        //unlink($thumbnail);
			if(unlink($image)){
				echo "<div class='alert alert-success'>Deleted image file: $image</div>";
			}
              else{
                   echo "<div class='alert alert-danger'>Error deleting image file: $image</div>"; //$ok = 0;
                }
		}
		$query1 = $dbh->prepare("DELETE FROM photos WHERE id = '$photo_id'");
			$query1->execute();
			$count = $query1->rowCount();
			if(!$count)
			{
				$array = array(
				'error' => 'true',
				'message' => $dbh->errorInfo()
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
			else
			{
				$array = array(
				'success' => 'true',
				'message' => 'Picture Deleted'
				);
				header( "Content-Type: application/json" );
				echo json_encode($array);
				die();
			}
	}
	
	
	if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'get_user_friend_list'){ //Show user friend list
		$user_id = $_REQUEST['user_id'];
		$status = 'accepted';
		
		$query = $dbh->prepare("SELECT * FROM user_friend_list WHERE request_from = '$user_id' AND status = '$status'");			$query1->execute();
		$count = $query1->rowCount();
		$rows = $query->fetchAll();
		$i = 0;
		foreach($rows as $row){
			$friend[$i]['id'] = $row['request_to'];
			
			$user = get_user_info($friend[$i]['id']);
			$friend[$i]['name'] = $user['name'];
			
			$image = get_user_profile_pic($friend[$i]['id']);
			$friend[$i]['user_image'] = $image;
			$i++;
		}
		
		header( "Content-Type: application/json" );
		echo json_encode($friend);
		die();
	}
	
	function get_user_info($user_id){
		global $dbh;
		
		$query->execute();
		$rows = $query->fetchAll();
		foreach($rows as $row){
            $user['id'] = $row['id'];
			$user['name'] = $row['name'];
			$user['email'] = $row['email'];
			$user['status'] = $row['status'];
			$user['profile_status'] = $row['profile_status'];
			$user['password'] = $row['password'];
			$user['date'] = $row['date'];
		}
	}
	
	if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'get_user_profile'){ //Show user friend list
		$user_id = $_REQUEST['user_id'];
		
		$query = $dbh->prepare("SELECT * FROM user_profile WHERE user_id = '$user_id'");			
		$query->execute();
		$count = $query->rowCount();
		$rows = $query->fetchAll();
	
		foreach($rows as $row){
			$user['height'] = $row['height'];
			$user['weight'] = $row['weight'];
			$user['ethnicity'] = $row['ethnicity'];
			$user['body_type'] = $row['body_type'];
			$user['looking_for'] = $row['looking_for'];
			$user['about_me'] = $row['about_me'];
			
			$user = get_user_info($user_id);
			$user['name'] = $user['name'];
			
			$image = get_user_profile_pic($user_id);
			$user['user_image'] = $image;
		}
		
		header( "Content-Type: application/json" );
		echo json_encode($user);
		die();
	}
	
	if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'invites'){ //Show user friend list
		$to = $_REQUEST['request_to'];
		$from = $_REQUEST['request_from'];
		$status = 'requested';
		
		$query = $dbh->prepare("Insert into user_invites(request_to, request_from, status) VALUES('$to', '$from', '$status')");
		$query->execute();
		$count = $query->rowCount();
		if(!$count){
			$array = array(
				'error' => 'true',
				'message' => $dbh->errorInfo()
				);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
		else{
			$array = array(
				'success' => 'true',
				'message' => 'Your request has been sent successfully!'
				);
			header( "Content-Type: application/json" );
			echo json_encode($array);
			die();
		}
	}
	
?>
Siple Way to bind date Firebase
// create our angular module and inject firebase
angular.module('scheduleApp', ['firebase'])

// create our main controller and get access to firebase
.controller('mainController', function($scope, $firebase) {
  
  // connect to firebase 
  var ref = new Firebase("https://burning-torch-4263.firebaseio.com/days");  
  var fb = $firebase(ref);

  // sync as object 
  var syncObject = fb.$asObject();

  // three way data binding
  syncObject.$bindTo($scope, 'days');
  
});