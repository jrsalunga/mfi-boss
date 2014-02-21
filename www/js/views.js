_.extend(Backbone.View.prototype, {
	close: function () {
	    if (this.beforeClose) {
	        this.beforeClose();
	    }
	    console.log('this close');
	    console.log(this);

	    this.unbind();
	    this.remove();

	    this.$el.unbind();
	    this.$el.remove();

	   
	 
	    this.model.off('change', this.render, this);

	    delete this.$el; // Delete the jQuery wrapped object variable
	    delete this.el; // Delete the variable reference to this node
	    delete this;
	    //this = null;
	},
	showCurrentView: function(view, el) {
		//console.log('showView');
    	if (this.currentView){
    		console.log('showCurrentView this');
      		this.currentView.close();
    	}
    	
	 	this.currentView = view;
	 	
	    this.currentView.render();
	   	//console.log(this.currentView);
	    //console.log($(".r-pane .p-development"));
	 	$(el).html(this.currentView.el);
	 	return this;
 	}
});


//	apvRM
var ApvReportModel = Backbone.Model.extend({
	defaults: {
		code: '',
		supplier: '',
		percent: '',
		totline: 0,
		totamount: 0.00
	}
});
var ApvReportCollection = Backbone.Collection.extend({
	model: ApvReportModel
});


var ApvDtl = Backbone.View.extend({
	tagName: 'tr',
	initialize: function(){

		this.model.on('change', this.render, this);

		this.template = _.template('<td><%= refno %></td><td><%= due %></td>'
			+'<td><%= posted %></td>'
			+'<td style="text-align: right;"><%= accounting.formatMoney(totamount,"", 2,",") %></td>'
			+'<td style="text-align: right;"><%= accounting.formatMoney(balance,"", 2,",") %></td>');

	},
	render: function(){
		console.log(this);
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr("data-posted", this.model.get('posted'));
		return this;
	}
});

var ApvDtls = Backbone.View.extend({
	initialize: function(){

		//this.collection.on('reset', this.render, this);
		this.$el.html('<table class="table table-striped tb-data">'
			+'<thead>'
			+'<th>Ref No.</th>'
			+'<th>Due</th>'
			+'<th>Posted</th>'
			+'<th>Amount</th>'
			+'<th>Balance</th>'
			+'</thead>'
			+'<tbody class="apv-list"></tbody></table>');
	},
	render: function(){
		this.cleanUp();
		this.$el.find('.tb-data tbody').empty();
		this.addAll();
		return this;
	},
	addOne: function(apvhdr){
		this.apvReport = new ApvDtl({model: apvhdr});
		//console.log(apvReport);
		this.apvReport.listenTo(this, 'clean_up', this.apvReport.close);
		this.$el.find('.tb-data tbody').append(this.apvReport.render().el);
		
	},
	addAll: function(){
		this.collection.each(this.addOne, this);
	},
	cleanUp: function(){
		console.log('this trigger clean_up');
		this.trigger('clean_up');
	}
});


var ApvhdrDetail = Backbone.View.extend({
	className: 'panel panel-default',
	initialize: function(){
		this.model.on('change', this.render, this);
		this.apvDtls = new ApvDtls({collection: this.collection});
		this.template = _.template(' '
        	+'<div id="panel-<%-supplierid%>" class="panel-heading">'
          	+'<h4 class="panel-title">'
            +'<a data-toggle="collapse" data-parent="#apvhdr-details" href="#collapse-<%-guid%>">'
            +'<%-name%>'//' <span class="badge"><%-totline%></span>'
            +'</a>'
            +' <span class="badge a"><%-totline%></span>'
            +' <span class="badge p" style="display:none;"><%-postedlen%></span>'
            +' <span class="badge u" style="display:none;"><%-unpostedlen%></span>'
            +'<span class="pull-right tot a"><%-amount%></span>'
            +'<span class="pull-right tot u" style="display:none;"><%-unposted%></span>'
            +'<span class="pull-right tot p" style="display:none;"><%-posted%></span>'
          	+'</h4></div>'
        	+'<div id="collapse-<%-guid%>" class="panel-collapse collapse">'
          	+'<div class="panel-body">'
          	//+'Lorem Ipsum soloer'
          	+'</div></div>');
	},
	render: function(){
		console.log(this.apvDtls);
		this.model.set({guid: this.uid()}, {silent: true});

		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr("data-posted", this.model.get('status'));
		//var apvDtls = new ApvDtls({collection: this.collection});
		//this.$el.find('.panel-body').html(apvDtls.render().el);

		this.showCurrentView(this.apvDtls, this.$el.find('.panel-body'));
		return this;
	},
	uid: function(){

		var S4 = function() {
	   		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}

		var guid = function() {
	   		return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
		}

		return guid();
	}
});

var ApvhdrDetails = Backbone.View.extend({
	initialize: function(){

		this.c = new Apvhdrs();
		this.alltotal = new ApvReportCollection();

		//this.posted = new ApvReportCollection();
		//this.unposted = new ApvReportCollection();
		this.collection.on('reset', this.resetVars, this);
		
	},
	resetVars: function(){
		//console.log(this.loadData());
		//console.log(this.loadData('0'));
		//console.log(this.loadData('1'));

		this.alltotal.reset(this.loadData());
		//this.posted.reset(this.loadData("1"));
		//this.unposted.reset(this.loadData("0"));
		this.addAll();
	},
	loadData: function(p){
		var that = this, f, supplierByDue;

		if(p){
			f = this.collection.where({posted: p});
			supplierByDue = _.groupBy(f, function(m){
		    	return m.get('suppliercode');
			});

		} else {
			supplierByDue = this.collection.groupBy(function(m){
		    	return m.get('suppliercode');
			});
		}

		//console.log(supplierByDue);
		/*
		var sumAmount = function(total, supplier){
			if(p){
				if(supplier.get('posted')==p) {
					return total += parseFloat(supplier.get('totamount'));
				} else {
        			return total; 
   				 }				
			} else {
				return total += parseFloat(supplier.get('totamount'));
			}    
		}
		*/
		
		
		var sumAmount = function(total, supplier){
		    return total += parseFloat(supplier.get('totamount'));
		}
		
		var sumPosted = function(total, supplier){
			var d = 0;
			if (supplier.get('posted')=="1") {
				return total += parseFloat(supplier.get('totamount'));
			} else {
				return total;
			}
		    
		}

		var sumUnposted = function(total, supplier){
			var d = 0;
		    if (supplier.get('posted')=="0") {
				return total += parseFloat(supplier.get('totamount'));
			} else {
				return total;
			}
		}

		var getpostedlen = function(total, supplier){
		    if (supplier.get('posted')=="1") {
				return total += 1;
			} else {
				return total;
			}
		}

		var getunpostedlen = function(total, supplier){
		    if (supplier.get('posted')=="0") {
				return total += 1;
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

		var sums = _.map( supplierByDue, function(suppliers, supplier){
			//console.log(suppliers);
			var o = suppliers.reduce(getObj, 0);
			var amt = suppliers.reduce(sumAmount, 0);
		    var pct = (amt/that.collection.getFieldTotal('totamount'))*100;
		    var p = suppliers.reduce(sumPosted, 0);
			var u = suppliers.reduce(sumUnposted, 0);
			var pl = suppliers.reduce(getpostedlen, 0);
			var ul = suppliers.reduce(getunpostedlen, 0);
		    var x = {
		        name: o.supplier,
		        amount: accounting.formatMoney(amt,"", 2,","),
		        percent: parseFloat(accounting.toFixed(pct,2)),
		        code: o.code,
		        totline: suppliers.length,
		        supplierid: o.supplierid,
		        status: o.posted,
		        id: o.id,
		        posted: accounting.formatMoney(p,"", 2,","),
		        unposted: accounting.formatMoney(u,"", 2,","),
		        postedlen: pl,
		        unpostedlen: ul
		    }
		    return x;
		})
		//console.log(sums);

		var high = _.chain(sums)
			  .sortBy(function(sums){ return sums.name; })
			  .map(function(sums){ return sums.name + ' is ' + sums.amount; })
			  .first()
			  .value();
		console.log(high);

		sums.sort(function (a, b) {
		    if (a.name > b.name)
		      return 1;
		    if (a.name < b.name)
		      return -1;
		    // a must be equal to b
		    return 0;
		});


		return sums;
	},
	render: function(){
		
	},
	addAll: function(){
		this.removeApvhdrDetailViews();
		this.$el.find('.report-detail-all').empty();
		//this.$el.find('.report-detail-posted').html('');
		//this.$el.find('.report-detail-unposted').html('');
		this.alltotal.each(this.loadAll, this);
		//this.posted.each(this.loadPosted, this);
		//this.unposted.each(this.loadUnposted, this);
		
	},
	where: function(p){
		var arr = [];
		var x = this.collection.where(p);
		_.each(x, function(e,i,l){
			arr.push(e.toJSON());
		});
		return arr
	},
	loadAll: function(apvRM){
		//var curapv = this.collection.where({supplierid: apvRM.get('supplierid')});
		
		this.c.reset(this.where({supplierid: apvRM.get('supplierid')}));
		
		this.apvhdrDetail = new ApvhdrDetail({model: apvRM, collection: this.c});
		console.log('attach clean_up');
		// attach clean_up event to apvhdrDetail to listenTo for removal of this view for re render
		this.apvhdrDetail.listenTo(this, 'clean_up', this.apvhdrDetail.close);
		console.log(this.apvhdrDetail);
		this.$el.find('.report-detail-all').append(this.apvhdrDetail.render().el);
		
		return this;
	},
	removeApvhdrDetailViews: function(){
		console.log('this trigger clean_up');
		this.trigger('clean_up');
	},
	/*
	loadPosted: function(apvRM){
		this.c.reset(this.where({supplierid: apvRM.get('supplierid')}));
		
		var apvhdrDetail = new ApvhdrDetail({model: apvRM, collection: this.c});
		this.$el.find('.report-detail-posted').append(apvhdrDetail.render().el);
		
		return this;		
	},
	loadUnposted: function(apvRM){
		this.c.reset(this.where({supplierid: apvRM.get('supplierid')}));
		
		var apvhdrDetail = new ApvhdrDetail({model: apvRM, collection: this.c});
		this.$el.find('.report-detail-unposted').append(apvhdrDetail.render().el);
		
		return this;
	}
	*/
});

/*
var ApvReport = Backbone.View.extend({
	tagName: 'tr',
	initialize: function(){

		this.model.on('change', this.render, this);

		this.template = _.template('<td><%= refno %></td><td><%= due %></td><td><%= supplier %></td>'
			+'<td style="text-align: right;"><%= accounting.formatMoney(totamount,"", 2,",") %></td>'
			+'<td style="text-align: right;"><%= accounting.formatMoney(balance,"", 2,",") %></td>');

	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var ApvReports = Backbone.View.extend({
	initialize: function(){

		this.collection.on('reset', this.render, this);
		this.$el.html('<table class="table table-striped tb-data">'
			+'<thead>'
			+'<th>APV Ref No</th>'
			+'<th>Due</th>'
			+'<th>Posted</th>'
			+'<th>Amount</th>'
			+'<th>Balance</th>'
			+'</thead>'
			+'<tbody></tbody></table>');
	},
	render: function(){
		this.$el.find('.tb-data tbody').empty();
		return this;
	},
	addOne: function(apvhdr){
		var apvReport = new ApvReport({model: apvhdr});
		//console.log(apvReport);
		this.$el.find('.tb-data tbody').append(apvReport.render().el);		
	},
	addAll: function(){
		this.collection.each(this.addOne, this);
	}
});
*/

var ReportApvhdr = Backbone.View.extend({
	el: '#apvhdr-report',
	initialize: function(){

		this.apvhdrs = new Apvhdrs();
		/*
		this.collection.on('reset', function(){
			console.log('reset ReportApvhdr');
			//console.log(this.collection.toJSON());
			this.apvhdrs.reset(this.collection.toJSON());
		}, this);
		*/

		this.listenTo(this.collection, 'reset', function(){
			this.apvhdrs.reset(this.collection.toJSON());
		})

		
		this.pie = new vPie({el: "#c-pie",collection: this.apvhdrs});
		this.apvLine = new vApvLine({el: "#c-line", collection: this.collection});
		this.column = new vColumn({el: '#c-column' , collection: this.apvhdrs});
		//this.apvReports = new ApvReports({el: '#apvhdr-report-list' , collection: this.apvhdrs});
		this.apvhdrDetails = new ApvhdrDetails({el: '#apvhdr-details' , collection: this.collection});
		
		console.log(this.pie);
		console.log(this.apvLine);
		console.log(this.column);
		console.log(this.apvhdrDetails);

		this.$el.find('#range-to').val(moment().format("YYYY-MM-DD"));
		
	},
	events: {
		'click .btn-date-range': 'searchDue',
		'click #filter-all': 'setAll',
		'click #filter-posted': 'setPosted',
		'click #filter-unposted': 'setUnposted'
	},
	render: function(){

		return this;
	},
	searchDue: function(){
		_.isEmpty(this.$el.find('#range-to').val()) ? '' : app.navigate("apvdue/"+ this.$el.find('#range-to').val() , {trigger: true});
	},
	setAll: function(){

		$(".report-detail-all .panel").slideDown();	
		$('.report-detail-all .panel-title span.tot.a').show().siblings('span.tot').hide();
		$('.report-detail-all .panel-title span.badge.a').show().siblings('span.badge').hide();
		$('.report-detail-all .apv-list tr').show();


		this.apvhdrs.reset(this.collection.toJSON());
	},
	setPosted: function(){
		//$(".report-detail-all .panel").slideUp();
		//$('.report-detail-all .apv-list [data-posted="1"]').slideDown();
		
		$('.report-detail-all .apv-list [data-posted="0"]').hide().closest('.panel').slideUp();
		$('.report-detail-all .apv-list [data-posted="1"]').show().closest('.panel').slideDown();

		$('.report-detail-all .panel-title span.tot.p').show().siblings('span.tot').hide();
		$('.report-detail-all .panel-title span.badge.p').show().siblings('span.badge').hide();
		/*
		$('.report-detail-all .panel-title span.p').show();
		$('.report-detail-all .panel-title span.p').show();
		*/


		var arr = [];
		var x = this.collection.where({posted: "1"});
		_.each(x, function(e,i,l){
			//console.log(e.toJSON());
			arr.push(e.toJSON());
		});
		//console.log(arr);
		this.apvhdrs.reset(arr);

	},
	setUnposted: function(){
		//$(".report-detail-all .panel").slideUp();
		//$('.report-detail-all .apv-list [data-posted="0"]').slideDown();
		$('.report-detail-all .apv-list [data-posted="1"]').hide().closest('.panel').slideUp();
		$('.report-detail-all .apv-list [data-posted="0"]').show().closest('.panel').slideDown();

		$('.report-detail-all .panel-title span.tot.u').show().siblings('span.tot').hide();
		$('.report-detail-all .panel-title span.badge.u').show().siblings('span.badge').hide();
		

		var arr = [];
		var x = this.collection.where({posted: "0"});
		_.each(x, function(e,i,l){
			//console.log(e.toJSON());
			arr.push(e.toJSON());
		});
		//console.log(arr);
		this.apvhdrs.reset(arr);

	}
});

