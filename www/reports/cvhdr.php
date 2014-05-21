<?php
require_once('../../lib/initialize.php');
!$session->is_logged_in() ? redirect_to("../login"): "";
$dr = new DateRange($_GET['fr'],$_GET['to']);
?>
<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>MFI - Check Voucher Schedule - Status</title>


<link rel="stylesheet" href="../css/bootstrap.css">
<link rel="stylesheet" href="../css/styles-ui2.css">
<!--
<link rel="stylesheet" href="css/main-ui.css">
<link rel="stylesheet" href="css/styles-ui.css">
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
<script src="../js/vendors/jquery.cookie-1.4.js"></script>
<script src="../js/vendors/moment.2.1.0-min.js"></script>
<script src="../js/vendors/accounting.js"></script>
<script src="../js/vendors/jquery.filedrop.js"></script>

<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/data.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>

<script src="../js/common.js"></script>

<script src="../js/app.js"></script>


<script>




$(document).ready(function(e) {
	
	
	$.get('../api/report/cv?fr=<?=$dr->fr?>&to=<?=$dr->to?>', function (csv) {
		//console.log(csv);
		$('#graph').highcharts({
            data: {
                csv: csv,
                // Parse the American date format used by Google
                parseDate: function (s) {  
					//console.log(s)   
					//var match = false;
                    //var match = s.match(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})$/);
					var match = s.match(/^([0-9]{1,4})\-([0-9]{1,2})\-([0-9]{1,2})$/);
                    if (match) {
                        console.log(Date.UTC(+('20' + match[3]), match[1] - 1, +match[2]));
                        return Date.UTC(+('20' + match[3]), match[1] - 1, +match[2]);
                    } else {
						//console.log(s);
					}
                }
            },
			chart: {
                zoomType: 'x',
                height: 250,
                spacingRight: 0
            },
            title: {
                text: ''
            },
           	subtitle: {
                text: document.ontouchstart === undefined ?
                    '' :
                    'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 7 * 24 * 3600 * 1000, // one week
                tickWidth: 0,
                gridLineWidth: 1,
                labels: {
                    align: 'left',
                    x: 3,
                    y: -3
                }
            },
            yAxis: [{ // left y axis
				min: 0,
                title: {
                    text: null
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    format: '{value:.,0f}'
                },
                showFirstLabel: false
            }, { // right y axis
                linkedTo: 0,
                gridLineWidth: 0,
                opposite: true,
                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    format: '{value:.,0f}'
                },
                showFirstLabel: false
            }],
            legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                borderWidth: 0
            },
            tooltip: {
                shared: true,
                crosshairs: true
            },
			tmp: 0,
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
								console.log(this.series);
								
								console.log(Highcharts.dateFormat('%Y-%m-%d', this.x));
								/*
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: e.pageX,
                                        y: e.pageY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                        this.y +' visits',
                                    width: 200
                                });
								*/
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },
            series: [
				{
					name: 'Unposted',
					lineWidth: 3,
					marker: {
						radius: 4
					}
				},
				{
					name: 'Posted',
					lineWidth: 3,
					marker: {
						radius: 4
					}
				},
				{
					type: 'area',
					name: 'Total',
					lineWidth: 0,
					marker: {
						radius: 0
					},
					index: -1,
					fillOpacity: 0.4
				}
			]
        });
		
	});

	
});
</script>
</head>
<body id="app-body" class="state-nav">


	   <!-- Fixed navbar -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div>
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="../">MFI BOSS</a>
        </div>
        
        <div class="navbar-collapse collapse">
        	<ul class="nav navbar-nav">
              <li><a href="index">Reports</a></li>
            </ul>
       		<ul class="nav navbar-nav navbar-right">
            <!--
                <li><a href="#home">Home</a></li>
                <li><a href="#location/jeff">About</a></li>
            -->    
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <span class="glyphicon glyphicon-cog"></span>
                    <b class="caret"></b>
                    </a>
                        <ul class="dropdown-menu">
                        	<li><a href="#settings">Settings</a></li>
                            <li><a href="../logout">Sign Out</a></li>

     
                      </ul>
                </li>
            </ul>  
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div>
    <div class="stage">
		<div class="col-sm-2 col-md-2 l-pane">
    	<ul class="nav nav-pills nav-stacked">
            <li>
                <a href="apvhdr">Accounts Payable</a>
            </li>
            <li>
				<a href="apvhdr-age">Accounts Payable (Aged)</a>
			</li>
            <li>
				<a href="ap-project">AP (Project)</a>
			</li>
            <li class="active">
            	<a href="cv-sched">CV Schedule (Bank)</a>
            <li>
		</ul>
    	</div>
    	<div class="col-sm-10 col-md-10 r-pane pull-right">
        	<section>
            	<div class="row">
                	<div class="col-md-12 title">
                		<h1>Check Voucher Schedule - Status</h1>
                	</div>
                </div>
                <div class="row">
                	<div class="col-md-12 datepick pull-right">
                		<div>
                        
                        	<form role="form" class="form-inline pull-right">
                           		<div class="form-group">
                                	<label class="sr-only" for="exampleInputEmail2">Email address</label>
                                    <input type="text" class="form-control" id="fr" name="fr" placeholder="YYYY-MM-DD" value="<?=$dr->fr?>">
                                </div>	
                               	<div class="form-group">
                                    <label class="sr-only" for="exampleInputPassword2">Password</label>
                                    <input type="text" class="form-control" id="to" name="to" placeholder="YYYY-MM-DD"  value="<?=$dr->to?>">
                              	</div>
              
  								<button type="submit" class="btn btn-success">Go</button>
                            </form>
                        </div>
                	</div>
                </div>
                <div class="row">
                	<div class="col-md-12 title">
                		<div class="col-md-12">
                        	<div id="graph">
                            </div>
                        </div>
                	</div>
                    <div class="col-md-6">
                    </div>
                    <div class="col-md-6">
                    	<a class="btn btn-primary pull-right" href="cv-sched">
                        <span class="glyphicon glyphicon-list-alt" style="color: #fff;"></span>
                        Back to Summary
                        </a>
                        <br>
                        <br>
                        <br>
                    </div>
                    <div class="col-md-12">
                    	<table class="table table-bordered">
                        	<thead>
                            	<tr>
                            	<?php
    								echo '<th>Days</th><th>Unposted</th><th>Posted</th><th>Total</th>';
    							?>
                                </tr>
                            </thead>
                            <tbody>
                            	<?php
    								foreach($dr->getDaysInterval() as $date){
    									$currdate = $date->format("Y-m-d");
    									echo '<tr>';
    									echo '<td>'.$date->format("M d").'</td>';
    									$tot = 0;
    									for($x = 0; $x <= 1; $x++){
    										$sql = "SELECT SUM(b.amount) as amount FROM cvhdr a, cvchkdtl b ";
    										$sql .= "WHERE a.id = b.cvhdrid AND b.checkdate = '".$currdate."' ";
    										$sql .= "AND a.posted = '".$x."'";
    										$cvchkdtl = Cvchkdtl::find_by_sql($sql); 
    										$cvchkdtl = array_shift($cvchkdtl);
    										$amt = empty($cvchkdtl->amount) ? '-': number_format($cvchkdtl->amount, 2);
											$tot = $tot + $cvchkdtl->amount;
    										echo '<td style="text-align: right;">'.$amt.'</td>';
											$tot = ($tot == 0) ? '-':$tot;
											echo $x==1 ?  '<td style="text-align: right;">'.number_format($tot,2).'</td>':'';
    										
    									}	
    									
    									echo '</tr>';
    								}
    							?>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
                            
            </section>
        </div>
  

    </div>
</div> <!-- /container -->
    
    
    


</body>
</html>