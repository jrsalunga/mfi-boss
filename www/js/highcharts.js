

var vPie = Backbone.View.extend({
	
	initialize: function(){
		this.collection.on('reset', this.render, this);	
	},
	render: function(){
		this.hData = [];
		//this.loadData();
		this.loadData2();


		this.$el.find('.c-pie-img')
		.highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            height: 250,
	        },
	        title: {
	            text: ''
	        },
	        tooltip: {
	    	    pointFormat: '{series.name}: <b> {point.amount} </b> ({point.percentage:.2f}%)'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#000000',
	                    connectorColor: '#ccc',
	                    format: '<b>{point.code}</b>: {point.percentage:.2f} %'
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: 'Total Amount',
	            data: this.hData2
	        }]
	    });


	},
	loadOne: function(apvhdr){
		var pct = (apvhdr.get('totamount')/this.collection.getFieldTotal('totamount'))*100;
		//console.log(this.collection.getFieldTotal('totamount'));
		this.hData.push(
			{
				name: apvhdr.get('supplier'),
				y: pct,
				code: apvhdr.get('suppliercode')
			}
		);
	},
	loadData: function(){
		this.collection.forEach(this.loadOne, this);                 
	},
	loadData2: function(){
		var that = this;
		var supplierByDue = this.collection.groupBy(function(m){
		     return m.get('suppliercode');
		});
		//console.log(supplierByDue);

		var sumAmount = function(total, supplier){
		    return total += parseFloat(supplier.get('totamount'));; 
		}

		var sums = _.map( supplierByDue, function(suppliers, supplier){
			var amt = suppliers.reduce(sumAmount, 0);
		    var pct = (amt/that.collection.getFieldTotal('totamount'))*100;
		    var x = {
		        name: supplier,
		        amount: accounting.formatMoney(amt,"", 2,","),
		        y: parseFloat(accounting.toFixed(pct,2)),
		        code: supplier
		    }
		    return x;
		});
		this.hData2 = sums; 
		//console.log(this.hData2);
	}
});  


var hDate = Backbone.Model.extend({});
var hDates = Backbone.Collection.extend({
	model: hDate
});

Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

var vApvLine = Backbone.View.extend({
	
	initialize: function(){

		this.collection.on('reset', this.render, this);

		this.dates = new hDates();

		this.posted = new Apvhdrs();
		this.unposted = new Apvhdrs();
		
	},
	render: function(){


		this.TotalData = [];
		this.allData = [];
		this.postedData = [];
		this.unpostedData = [];
		this.getDateRange();
		this.generateDateRange();
		this.loadAll();
		//console.log(this.dates);


		this.$el.find('.c-line-img')
		.highcharts({
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
                maxZoom: this.dates.length * 6 * 3600000, // fourteen days
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: 'Amount'
                },
                min: -10,
                startOnTick: false
            },
            tooltip: {
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                   fillOpacity: 0.4,
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                line: {
                	lineWidth: 1,
                	marker: {
	                    enabled: false,
	                    states: {
	                        hover: {
	                            enabled: true,
	                            lineWidth: 1
	                        }
	                    }
	                }
                }
            },
    
            series: [
            {
                type: 'area',
                name: 'Total',
                pointInterval:  24 * 3600 * 1000,
                pointStart: Date.UTC(this.dateStartYear, this.dateStartMonth, this.dateStartDay),
                data: this.allData
            },
            
            {
                type: 'line',
                name: 'Posted',
                pointInterval:  24 * 3600 * 1000,
                pointStart: Date.UTC(this.dateStartYear, this.dateStartMonth, this.dateStartDay),
                data: this.postedData
            },
            {
                type: 'line',
                name: 'Unposted',
                pointInterval:  24 * 3600 * 1000,
                pointStart: Date.UTC(this.dateStartYear, this.dateStartMonth, this.dateStartDay),
                data: this.unpostedData
            }
            ]
        });

	},
	getDateRange: function(){
		
		var y = this.collection.reduce(function(m, e) {
		    var d = e.get('due');
		    var s = d.split("-");
		    var due = new Date(s[0], s[1]-1, s[2]);
		    
		    if(!m['min']){
		    	m['min'] = new Date();
		    }

		    if(!m['max']){
		    	m['max'] = new Date();
		    }
		       
		    
		   // console.log(due +' < '+ m['due'])
		    if(due < m['min']){
		        m['min'] = due;
		    }

		    if(due > m['max']){
		        m['max'] = due;
		    }

   			
		    return m;
		}, { });

		//console.log(y);

		var sday = y.min.getDate();
	    var smonth = y.min.getMonth() + 1;
	    var syear = y.min.getFullYear();

	    var eday = y.max.getDate();
	    var emonth = y.max.getMonth() + 1;
	    var eyear = y.max.getFullYear();

		this.dateStart = y.min;
		this.dateStartYear = y.min.getFullYear();
		this.dateStartMonth = y.min.getMonth() ;
		this.dateStartDay = y.min.getDate();

		this.dateEnd = y.max;
		this.dateEndYear = y.max.getFullYear();
		this.dateEndMonth = y.max.getMonth() ;
		this.dateEndDay = y.max.getDate();


	},
	loadOne: function(hdate){
		var dts = {};

		var x = this.collection.where({due: hdate.attributes.date});
		
		//console.log(x);
		var sum = 0;
		_.each(x, function(model, index, list){
			sum += parseFloat(model.get('totamount'));
		});

		sum = accounting.toFixed(sum,2);
		sum = parseFloat(sum);
		//console.log(sum);
         
         if(_.isEmpty(x)){
         	dts = {
				name: '',
				y: 0
         	}
         } else {
         	dts = {
				name: '',
				y: sum
         	}
         }

		
		this.allData.push(dts);
	},
	loadPosted: function(hdate){
		var dts = {};

		var x = this.collection.where({due: hdate.attributes.date, posted: "1"});
		
		//console.log(x);
		var sum = 0;
		_.each(x, function(model, index, list){
			sum += parseFloat(model.get('totamount'));
		});

		sum = accounting.toFixed(sum,2);
		sum = parseFloat(sum);
		//console.log(sum);
         
         if(_.isEmpty(x)){
         	dts = {
				name: '',
				y: 0
         	}
         } else {
         	dts = {
				name: '',
				y: sum
         	}
         }

		
		this.postedData.push(dts);
	},
	loadUnposted: function(hdate){
		var dts = {};

		var x = this.collection.where({due: hdate.attributes.date, posted: "0"});
		
		//console.log(x);
		var sum = 0;
		_.each(x, function(model, index, list){
			sum += parseFloat(model.get('totamount'));
		});

		sum = accounting.toFixed(sum,2);
		sum = parseFloat(sum);
		//console.log(sum);
         
         if(_.isEmpty(x)){
         	dts = {
				name: '',
				y: 0
         	}
         } else {
         	dts = {
				name: '',
				y: sum
         	}
         }

		
		this.unpostedData.push(dts);
	},
	loadAll: function(){
		this.dates.forEach(this.loadOne, this);  
		this.dates.forEach(this.loadPosted, this);
		this.dates.forEach(this.loadUnposted, this);                 
	},
	generateDateRange: function(){
		this.dates.reset();
		var currentDate = this.dateStart;

	
		while (currentDate <= this.dateEnd) {
        	

        	var m, d;

        	switch (currentDate.getMonth()) {
				case 0:
					m = '01';
				    break;
				case 1:
				    m = '02';
				    break;
				case 2:
				    m = '03';
				    break;
				case 3:
				    m = '04';
				    break;
				case 4:
				    m = '05';
				    break;
				case 5:
				    m = '06';
				    break;
				case 6:
				    m = '07';
				    break;
				case 7:
				    m = '08';
				    break;
				case 8:
				    m = '09';
				    break;
				case 9:
				    m = '10';
				    break;
				default:
				   	m = currentDate.getMonth() + 1;
				    break;
			}

			switch (currentDate.getDate()) {
				case 1:
					d = '01';
				    break;
				case 2:
				    d = '02';
				    break;
				case 3:
				    d = '03';
				    break;
				case 4:
				    d = '04';
				    break;
				case 5:
				    d = '05';
				    break;
				case 6:
				    d = '06';
				    break;
				case 7:
				    d = '07';
				    break;
				case 8:
				    d = '08';
				    break;
				case 9:
				    d = '09';
				    break;
				default:
				   	d = currentDate.getDate();
				    break;
			}

        	this.dates.add({
        		date: currentDate.getFullYear()+'-'+ m  +'-'+ d
        	});

        	currentDate = currentDate.addDays(1);
      	}
	}
});


var vColumn =  Backbone.View.extend({
	initialize: function(){
		this.collection.on('reset', this.render, this);
	},
	render: function(){
		this.categories = [];
		this.posted = [];
		this.unposted = [];

		this.loadData();


		this.$el.find('.c-column-img')
		.highcharts({
            chart: {
                type: 'column',
                height: 250,
            },
            title: {
                text: ''
            },
            xAxis: {
            	categories: this.categories
                //categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -70,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +'<br/>'+
                        'Total: '+ this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            },
            series: [{
                name: 'Posted',
                data: this.posted
            }, {
                name: 'Unposted',
                data: this.unposted
            }]
        });
	},
	loadData: function(){
		var that = this;
		var supplierByCode = this.collection.groupBy(function(m){
		     return m.get('suppliercode');
		});
		console.log(supplierByCode);

		var sumAmount = function(total, supplier){
		    return total += parseFloat(supplier.get('totamount'));; 
		}

		var sumPosted = function(total, supplier){
			if (supplier.get('posted')=="1") {
				return total += parseFloat(supplier.get('totamount'));	
			} else {
				return total;
			}
		    
		}

		var sumUnposted = function(total, supplier){
		    if (supplier.get('posted')=="0") {
				return total += parseFloat(supplier.get('totamount'));	
			} else {
				return total;
			}
		}

		var getObj = function(total, supplier){

			var x = {
				code: supplier.get('suppliercode'),
				supplier: supplier.get('supplier'),
				supplierid: supplier.get('supplierid'),
				posted: supplier.get('posted'),
				id: supplier.get('id'),

			}

			return x;
		}
		
		var sums = _.map( supplierByCode, function(suppliers, supplier){
			//console.log(suppliers);
			var amt = suppliers.reduce(sumAmount, 0);
			var p = suppliers.reduce(sumPosted, 0);
			var u = suppliers.reduce(sumUnposted, 0);
			var o = suppliers.reduce(getObj, 0);
		    var pct = (amt/that.collection.getFieldTotal('totamount'))*100;
		    var x = {
		        name: o.supplier,
		        amount: accounting.formatMoney(amt,"", 2,","),
		        percent: parseFloat(accounting.toFixed(pct,2)),
		        code: supplier,
		        posted: p,
		        unposted: u
		    }
		    return x;
		});
		
		//console.log(sums);
		var that = this;
		_.each(sums, function(model, index, list){
			//console.log(model);
			that.categories.push(model.code);
			that.posted.push(model.posted);
			that.unposted.push(model.unposted);
		});
		
	}

});