

var Apvhdrs = Backbone.Collection.extend({
	model: Apvhdr,
	initialize: function(){
		this.on('reset', function(){
			//console.log('reset apvhdrs');
			//console.log(this);
		}, this);
		this.on('reset', this.resetVars, this);
	},
	getFieldTotal: function(field){
		return this.reduce(function(memo,value){
			if(value.get('posted')==0){
				//console.log('unposted');
			} else {
				//console.log('posted');
			}
			
			return memo + parseFloat(value.get(field));
			memo = accounting.toFixed(memo,2);
			memo = parseFloat(memo);
		}, 0)
	},
	getPosted: function(){
		return this.where({posted: 1});
	},
	getUnposted: function(){
		x = cars.reduce(function(m, e) {
		    var brand = e.get('brand');
		    if(!m[brand])
		        m[brand] = 0;
		    m[brand] += parseFloat(e.get('amount'));
		    return m;
		}, { });
	},
	resetVars: function(){

	},
	getUnpostedTotal: function(field){
		return this.reduce(function(memo,value){
			return memo + parseFloat(value.get(field));
		}, 0)
	},
});

var apvhdrs = new Apvhdrs();

