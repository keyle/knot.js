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
		if(_newModel)
			model = _newModel;

		setTimeout(function(){ doBind(dom); }, 50 );
		return model;
	}

	function doBind(domObject)
	{
		$(domObject).find('*[data-bind]').each(bindCollection);
	}

	function bindCollection()
	{
		var collection = model[$(this).attr('data-bind')];

		if(!collection)
			throw "ERROR: No Model Object Found " + $(this).attr('data-bind'); // no model object found

		if($(this).find('*[data-repeater]').length < 1)
		 	throw "ERROR: no data-repeater found"; // no repeater found


		// find out what css display style to apply to repeater object
		var displayStyle = getCSSDisplayStyle(this);

		// hide the template - we will need it again on refresh.
		$($(this).find('*[data-repeater]')[0]).css('display', displayStyle);
		var repeatHTML = $($(this).find('*[data-repeater]')[0]).outerHTML();
		$($(this).find('*[data-repeater]')[0]).css('display', 'none');

		var papa = $(this).find('*[data-repeater]').parent();

		// remove all except the first, it's our template
		$(this).find('*[data-repeater]').nextAll().remove();

		for (var i = 0; i < collection.length; i++)
		{
			// make a copy
			var newhtml = repeatHTML;

			for(var key in collection[i])
			{
				// using split join as a replace All
				newhtml = newhtml.split('{'+key+'}').join(collection[i][key]);
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

	$.fn.outerHTML = function()
	{
		return $('<div></div>').append(this.clone()).html();
	}

})(jQuery);