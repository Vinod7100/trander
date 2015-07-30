<div class="col-xs-12 page" style="background-image:url('img/bg2.jpg'); background-repeat: no-repeat; background-size: cover;">
	<loading></loading>
	<div class="page-header">
		<a href="" ng-click="showPage('/home')" class="btn-pull-left"><i class="fa fa-arrow-circle-left"></i></a>
		<h3 style="margin:0px; text-align:center"></h3>
		<a href="" ng-click="showPage('/home')" class="btn-pull-right"><i class="fa fa-home"></i></a>
	</div>
	<div class="col-xs-12" style="padding-top:10%;">
		<form class="form p-box" ng-submit="submit()">
			<div class="form-group">
				<span><i class="fa fa-envelope"></i></span>
				<input type="text" class="form-control" name="message" ng-model="message" placeholder="Type your message here..." required/>
			</div>
			<div class="form-group">
				<input type="submit" class="btn btn-default submit-btn" name="submit" value="Send"/>
			</div>
		</form>
	</div>
</div>