<?php
require_once('../../lib/initialize.php');
?>
<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Project Activity Management</title>


<link rel="stylesheet" href="../css/bootstrap.css">
<link rel="stylesheet" href="../css/styles-ui2.css">
<!--
<link rel="stylesheet" href="css/main-ui.css">
<link rel="stylesheet" href="css/styles-ui.css">
-->


</head>
<body id="app-body" class="state-nav">
    <!-- Fixed navbar -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
    	<div class="container">
    		<div class="navbar-header">
    			<a class="navbar-brand" href="http://pam.mfi.com/sales">MFI PMS</a>
                <a class="navbar-brand" href="http://pam.mfi.com/sales/#projects">Projects</a>
    		</div>
    	</div>
    </div>
    
    <!-- begin container -->
    <div class="container">
    	<ol class="breadcrumb">
    		<li class="active">Home</li>
    	</ol>
        
    	<div id="stage" class="row">
        	<section id="nav-container" class="col-sm-3 col-md-3">
 			</section>
            <section id="stage-container" class="col-sm-9 col-md-9">
            	
 			</section>
    	</div>
	</div> 
    <!-- end container -->
    
    
<!--
		All Javascript
-->




<script src="../js/vendors/jquery-1.10.1.min.js"></script>
<script src="../js/vendors/jquery-ui-1.10.3.js"></script>
<!--
<script src="../js/vendors/jquery-ui-1.10.3.js"></script>
<script src="../js/vendors/jquery-1.9.1.js"></script>
<script src="js/vendors/underscore-min.js"></script>
<script src="js/vendors/backbone-min.js"></script>
-->
<script src="../js/vendors/underscore-min.js"></script>
<script src="../js/vendors/backbone-min.js"></script>
<script src="../js/vendors/bootstrap.min.js"></script>
<script src="../js/vendors/backbone-validation-min.js"></script>
<script src="../js/vendors/moment.2.1.0-min.js"></script>
<script src="../js/vendors/accounting.js"></script>
<script src="../js/vendors/jquery.filedrop.js"></script>
<script src="../js/common.js"></script>
<script src="../js/mfi.js"></script>
<script src="../js/sales.models.js"></script>
<script src="../js/sales.collections.js"></script>
<script src="../js/sales.views.js"></script>
<script src="../js/sales.app-ui.js"></script>


<script>


$(document).ready(function(e) {
	
	
	
	
	
	
	
	$(".table-model").on('click', '#icon-date', function(){
		var el =  $(".table-model #date");	
		el.datepicker({"dateFormat": "yy-mm-dd",
			onClose: function(event, ui){
				el.datepicker("destroy");
			}
   		});
		el.datepicker('show');
	});
	
	
	
	

	
	
});
</script>




<div class="modal fade" id="activityModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
		<!-- template here --->
      </div>
      <div class="modal-footer">
        	<button type="button" id="mdl-btn-save" class="btn btn-primary model-btn-save" data-dismiss="modal" disabled>Save</button>
          <button type="button" is="mdl-btn-save-blank" class="btn btn-primary model-btn-save-blank" disabled>Save &amp; Blank</button>
          <button type="button" id="mdl-btn-save" class="btn btn-default model-btn-cancel" data-dismiss="modal">Cancel</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script type="text/template" id="modal-activity-tpl">
	<form id="frm-mdl-activity" name="frm-mdl-activity" class="table-model form-horizontal" data-table="activity" action="" method="post" role="form">
		<div class="form-group">
			<label for="descriptor" class="col-sm-2 control-label">Activity:</label>
			<div class="input-group col-sm-10">
			  	<input type="text" class="form-control" id="descriptor" name="descriptor" placeholder="Activity" maxlength="50" required>
				<input type="hidden" name="action" id="action" value="file">
				<div class="input-group-btn">
					<button type="button" class="btn btn-default dropdown-toggle btn-action-selector" data-toggle="dropdown" tabindex="-1">
						<span id="icon-action" class="glyphicon glyphicon-folder-close"></span>
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu pull-right">
						<li>	
							<a href="#" data-action="file">
							<span class="glyphicon glyphicon-folder-close"></span>
							  File Activity
							</a>
						</li>
					  	<li>
							<a href="#" data-action="cad">
							<span class="glyphicon glyphicon-picture"></span>
							  Request CAD
							</a>
						</li>
						<li>
							<a href="#" data-action="quote">
							<span class="glyphicon glyphicon-list-alt"></span>
							  Request Quotation
							</a>
						</li>
					</ul>
				</div>
			</div>
			<span class="validation-error-block col-sm-10 col-md-offset-2"></span>
		</div>
		<div class="form-group">
			<label for="date" class="col-sm-2 control-label">Date:</label>
			<div class="input-group col-sm-10">
			  	<input type="text" class="form-control" id="date" name="date" placeholder="YYYY-MM-DD" required>
				<input type="hidden" id="stageid" name="stageid">
				<input type="hidden" id="projectid" name="projectid">
				<span class="input-group-btn">
        			<button id="icon-date" class="btn btn-default" type="button" tabindex="-1">
						<span class="glyphicon glyphicon-calendar"></span>
					</button>
      			</span>
			</div>
			<span class="validation-error-block col-sm-10 col-md-offset-2"></span>
		</div>
		<div class="form-group">
			<label for="filename" class="col-sm-2 control-label">File:</label>
			<div class="input-group col-sm-10">
			  <input type="text" class="form-control" id="filename" name="filename" placeholder="Filename" readonly  tabindex="-1">
			  <input type="file" id="file_upload" name="file_upload" style="display: none" />
			  	<span class="input-group-btn">
        			<label id="icon-filename" class="btn btn-default" type="button" for="file_upload">
						<span class="glyphicon glyphicon-paperclip"></span>
					</label>
      			</span>
			</div>
		</div>
		<div class="form-group">
			<label for="notes" class="col-sm-2 control-label">Notes:</label>
			<div class="col-sm-10">
			  <textarea class="form-control" id="notes" name="notes" placeholder="Notes"></textarea>
			</div>
		</div>
	</form>
</script>


</body>
</html>