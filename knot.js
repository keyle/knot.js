(function($) {

	var dom = {};
	var model = {};

    $.fn.knot = function(_model)
	{
		if(!_model)
			throw "ERROR: please provide a valid json object";

		dom = this;
		model = _model;

		doBind(dom);
	}

	$.fn.model = function(_newModel)
	{
		// cheapest getter/setter on the planet
		if(_newModel)
			model = _newModel;

		setTimeout(function(){ doBind(dom); }, 60 );
		return model;
	}

	function doBind(domObject)
	{
		$(domObject).find('*[data-bind]').each(tryBind);
	}

	function tryBind(index, that)
	{
		if(hasDataRepeaterTag(that))
			bindCollection(that);
		else
			bindSingle(that);
	}

	function bindSingle(that)
	{
		// replace the inside of whatever the data-bind tag has
		var element = $(that).outerHTML();
		var modelElement = $(that).attr('data-bind');

		// do we have a converter or string format?
		if(modelElement.indexOf('.') != -1)
		{
			var arr = modelElement.split('.');
			var content = model[arr[0]];
			var evil = eval( '"' + content +  '".'+arr[1] );
			$(that).html(evil.toString());
		}
		else
		{
			try {
				var content = model[modelElement];
				$(that).html(content.toString());
			}
			catch(e) {
				console.log( "ERROR: No Model Object found at " +$(that).outerHTML());
			}
		}
	}

	// looks at the UI data-bind's, and then tries to match it with the model
	function bindCollection(that)
	{
		var collection = model[$(that).attr('data-bind')];

		if(!collection)
			console.log( "ERROR: No Model Object Found " + $(that).attr('data-bind') ); // no model object found

		if($(that).find('*[data-repeater]').length < 1)
		 	console.log( "ERROR: no data-repeater found" ); // no repeater found


		// find out what css display style to apply to repeater object
		var displayStyle = getCSSDisplayStyle(that);

		// hide the template - we will need it again on refresh.
		$($(that).find('*[data-repeater]')[0]).css('display', displayStyle);
		var repeatHTML = $($(that).find('*[data-repeater]')[0]).outerHTML();
		$($(that).find('*[data-repeater]')[0]).css('display', 'none');

		var papa = $(that).find('*[data-repeater]').parent();

		// remove all except the first, it's our template
		$(that).find('*[data-repeater]').nextAll().remove();

		for (var i = 0; i < collection.length; i++)
		{
			// make a copy
			var newhtml = repeatHTML;

			for(var key in collection[i])
			{
				// using split join as a cheap replace All
				newhtml = newhtml.split('{'+key+'}').join(collection[i][key]);

				// checking if someone had a converter or string format
				arr = newhtml.match(/\{([^}]+)\.([^}]+)/);
				arr.shift();

				if(arr[0] == key)
				{
					var evil = eval('"'+collection[i][key]+ '".' + arr[1]);
					newhtml = newhtml.replace('{'+arr[0]+'.'+arr[1]+'}', evil);
				}
			}

			$(papa).append(newhtml);
		}
	}

	function getCSSDisplayStyle(that)
	{
		if($(that).find('*[data-repeater]')[0].nodeName == 'TR')
			return 'table-row';

		else if($(that).find('*[data-repeater]')[0].nodeName == 'TD')
			return 'table-cell';

		else
			return 'inherit';
	}

	function hasDataRepeaterTag(that)
	{
		return $(that).find('*[data-repeater]').length > 0;
	}

	String.prototype.contains = function(that)
	{
		(this.split('').join('').indexOf(that.toString()) != -1)
	}

	$.fn.outerHTML = function()
	{
		return $('<div></div>').append(this.clone()).html();
	}

})(jQuery);