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
		$(domObject).find('*[data-bind]').each(tryBind);
	}

	function tryBind(index, that)
	{
		if(hasDataRepeaterTag(that))
		{
			bindCollection(that);
		}
		else
		{
			bindSingle(that);
		}
	}

	// forget about this madness of hiding a copy, just store the whole dom object template and be done with it.
	// there won't be dynamic linking, so...

	function bindSingle(that)
	{
		var templateHTML = $(that).outerHTML();
		//var newhtml = templateHTML;
		var papa = $(that).parent();

		var obj = model[$(that).attr('data-bind')]

		for(var key in obj)
		{
			// using split join as a replace All
			templateHTML += obj[key];//.split('{'+key+'}').join(obj[key]);
		}

		$(that).replaceWith(templateHTML);

		//$(papa).append(newhtml);

	}

	// looks at the UI data-bind's, and then tries to match it with the model
	function bindCollection(that)
	{
		var collection = model[$(that).attr('data-bind')];

		if(!collection)
			throw "ERROR: No Model Object Found " + $(that).attr('data-bind'); // no model object found

		if($(that).find('*[data-repeater]').length < 1)
		 	throw "ERROR: no data-repeater found"; // no repeater found


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

	function hasDataRepeaterTag(that)
	{
		return $(that).find('*[data-repeater]').length > 0;
	}

	$.fn.outerHTML = function()
	{
		return $('<div></div>').append(this.clone()).html();
	}

})(jQuery);