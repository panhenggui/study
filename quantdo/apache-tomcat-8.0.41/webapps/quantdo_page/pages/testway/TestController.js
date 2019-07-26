
// window.onload = function() {
// 	alert('...');
// };

way.w.ready(function() {
	way.watchAll(function(s, v) {
		//
	});
});

function loadSnip1() {
	$('#snipholder').load('./snip1.html', function() {
		way.registerBindings();
		//way.dom('#snip1form').updateBindings('snip1data');
		way.updateBindings('snip1data.name');
		way.updateBindings('snip1data.gender');
	});
}

function loadSnip2() {
	$('#snipholder').load('./snip2.html', function() {
		way.registerBindings();
		//way.updateBindings('snip1data.comments');
	});
}
