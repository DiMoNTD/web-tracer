var ids_fetcher = (function()
{
	var id_refresher = null;
	var interval = 10000;
	var self = this;

	var getXmlHttp = function () {
		var xmlhttp;
		try {
			xmlhttp = new ActiveXObject("MSXML2.XMLHTTP.6.0");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}
		if (!xmlhttp && typeof XMLHttpRequest !== 'undefined') {
			xmlhttp = new XMLHttpRequest();
		}
		return xmlhttp;
	}

	var onResponse = function(responseText)
	{
		var response_obj = JSON.parse(responseText);
		console.log(response_obj.ids);
		$('#debug_id').autocomplete({ source : response_obj.ids.map(String) });

		id_refresher = setTimeout(function(){load.call(self)}, interval);
	}

	var load = function ()
	{
		var req = getXmlHttp();
		req.open("GET", "http://" + $('#service_addr').val() + "/ids", true);
		req.onreadystatechange = function () {
			if (req.readyState === 4) {
				if (req.status === 0 || req.status === 200) {
					onResponse(req.responseText);
					req = null;
				}
			}
		};

		try {
			req.send(null);
		} catch (e) {}
	}

	var stop = function()
	{
		clearTimeout(id_refresher);
	}

	return function(isStop, user_interval)
	{
		if (isStop === true)
		{
			stop();
		}
		else
		{
			interval = user_interval || interval;
			load();
		}
	}
})()
