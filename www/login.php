<?php
require_once('../lib/initialize.php');
?>
<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Project Activity Management</title>


<link rel="stylesheet" href="css/bootstrap.css">
<link rel="stylesheet" href="css/styles-ui2.css">
<!--
<link rel="stylesheet" href="css/main-ui.css">
<link rel="stylesheet" href="css/styles-ui.css">
-->

<script src="js/vendors/jquery-1.10.1.min.js"></script>
<script src="js/vendors/jquery-ui-1.10.3.js"></script>
<!--
<script src="../js/vendors/jquery-ui-1.10.3.js"></script>
<script src="../js/vendors/jquery-1.9.1.js"></script>
<script src="js/vendors/underscore-min.js"></script>
<script src="js/vendors/backbone-min.js"></script>
-->
<script src="js/vendors/underscore-min.js"></script>
<script src="js/vendors/backbone-min.js"></script>
<script src="js/vendors/bootstrap.min.js"></script>
<script src="js/vendors/backbone-validation-min.js"></script>
<script src="js/vendors/moment.2.1.0-min.js"></script>
<script src="js/vendors/accounting.js"></script>
<script src="js/vendors/jquery.filedrop.js"></script>
<script src="js/common.js"></script>
<script src="js/models.js"></script>
<script src="js/collections.js"></script>
<script src="js/views.js"></script>
<script src="js/app-menu.js"></script>
<script src="js/main-ui.js"></script>
<script src="js/app-ui.js"></script>


<script>


function searchCustomer(){
	 $("#customer.search").autocomplete({
            source: function( request, response ) {
                $.ajax({
					type: 'GET',
					url: "../api/search/customer",
                    dataType: "json",
                    data: {
                        maxRows: 25,
                        q: request.term
                    },
                    success: function( data ) {
						response( $.map( data, function( item ) {
							//console.log(item);
							var l = item.descriptor != null ? ' - ' + item.descriptor : '';
							return {
								label: item.code + ''+ l,
								value: item.code,
								id: item.id
							}
						}));			
                    }
                });
            },
            minLength: 2,
            select: function( event, ui ) {
				//console.log(ui);
                //log( ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
	
				$("#customerid").val(ui.item.id); /* set the selected id */
				
            },
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				$("#customerid").val('');  /* remove the id when change item */
            },
            close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            },
			messages: {
				noResults: '',
				results: function() {}
			}
			
       });
}

function searchSalesman(){
	 $("#salesman.search").autocomplete({
            source: function( request, response ) {
                $.ajax({
					type: 'GET',
					url: "../api/search/salesman",
                    dataType: "json",
                    data: {
                        maxRows: 25,
                        q: request.term
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
							var l = item.descriptor != null ? ' - ' + item.descriptor : '';
                            return {
                                label: item.code + ''+ l,
                                value: item.code,
								id: item.id
                            }
                        }));
                    }
                });
            },
            minLength: 2,
            select: function( event, ui ) {
				//console.log(ui);
                //log( ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
	
				$("#salesmanid").val(ui.item.id); /* set the selected id */
				
            },
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				$("#salesmanid").val('');  /* remove the id when change item */
            },
            close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            },
			messages: {
				noResults: '',
				results: function() {}
			}
			
       });
}


var appRouter = new Router();
$(document).ready(function(e) {
	
	
	
	
	
	var activityModalView = new ActivityModalView({model: activity, settings: activityModal});
	activityModalView.render();
	
	var modalProjectView = new ProjectModalView({model: project, settings: projectModal});
	modalProjectView.render();
	
	//var projectInfo = new ProjectInfo({model: project, el: '.p-info'});
	//projectInfo.render();
	
	
	
	
	Backbone.history.start();
	//Backbone.history.start({pushState: true});
	
	searchCustomer();
	searchSalesman();
	
	$('#myProject').on('hidden.bs.modal', function () {
 		//appRouter.navigate("projects", {trigger: true})
		//window.history.back();
	})
	
	$('a[href=#]').on('click', function(e){
		//e.preventDefault();	
	});
	
	$(".table-model #date").datepicker({"dateFormat": "yy-mm-dd",
		select: function(event, ui){
		
		}
   	});
	
	$(".table-model #datestart").datepicker({"dateFormat": "yy-mm-dd",
		select: function(event, ui){ }
   	});
	
	$(".table-model #dateend").datepicker({"dateFormat": "yy-mm-dd",
		select: function(event, ui){ }
   	});
	
	$(".table-model #dateendx").datepicker({"dateFormat": "yy-mm-dd",
		select: function(event, ui){ }
   	});
	
});
</script>
</head>
<body id="app-body" class="state-nav">


	<!-- Fixed navbar -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="http://pam.mfi.com">MFI PMS</a>
        </div>
      </div>
    </div>

    <div class="container">

    	<ol class="breadcrumb">
        <!--
          <li><a href="#">Home</a></li>
          <li><a href="#">Library</a></li>
     	-->
          <li class="active">Home</li>
        </ol>

      <!-- Main component for a primary marketing message or call to action -->
      	<div class="stage">
			
      	
        
      	</div>
       
		
    </div> <!-- /container -->
    
    




</body>
</html>