// ltesearch.js

var USE_TEST_DATA = false;
var DO_FILTER = true;

var bFirstQuery = true;
var gDataTable = null;

var DATA_TABLE_OPTIONS = {
    "lengthMenu": [10],
    "paging": false,
    "scrollY": 400,
    "order": [ [0, "desc"], [1, "asc"]],
    "columns": [
        {type: "date", width: "100px"},
        {type: "text"},
        {type: "html"},
        {type: "text"}
        ]
}

var urlFilters = [
    "/auto",
    "/job",
    "/entertainment",
    "/sports",
    "/make-",
    "/model-",
    "/horoscope",
    "/travel",
    "/car-review",
    "/arts/",
    "/realestate",
    "masslive.com/living",
    "for-sale",
    "for_sale",
    "for-rent",
    "for_rent",
    "/obitu",
    "/sitemap",
    "/real-estate",
    "/patriots"
    ];

var contentFilters = [
    "political <b>climate",
    "business <b>climate",
    "warming</b> center",
    "warming</b> station"
    ];

$(document).ready(function() {
    $("#digest").hide();
    $("#loading").hide();
    $("#fetch").click(getDigest);

    var urlVars = getUrlVars();

    var doFilter = urlVars['filter'];
    if (doFilter && (doFilter == '0') || (doFilter === 'false'))
        DO_FILTER = false;

    var testArg = urlVars['test'];
    if (testArg && (testArg != '0') && (testArg != 'false'))
        USE_TEST_DATA = true;

    DATA_TABLE_OPTIONS.scrollY = Math.round($(window).height()*0.6);
});

var _papers = [
	{domain: "bostonglobe.com", name: "Boston Globe", address: "letter@globe.com"},
	{domain: "bostonherald.com", name: "Boston Herald", address: "letterstoeditor@bostonherald.com"},
	{domain: "lowellsun.com", name: "Lowell Sun", address: "jcampanini@lowellsun.com"},
	{domain: "capecodtimes.com", name: "Cape Cod Times", address: "letters@capecodonline.com"},
	{domain: "berkshireeagle.com", name: "Berkshire Eagle", address: "letters@berkshireeagle.com"},
	{domain: "southcoasttoday.com", name: "South Coast Today", address: "http://services.southcoasttoday.com/reader-services/submissions/letter-to-editor/"},
	{domain: "csmonitor.com", name: "Christian Science Monitor", address: "letters@csmonitor.com"},
	{domain: "telegram.com", name: "Worcester Telegram", address: "letters@telegram.com"},
	{domain: "brookline.wickedlocal.com", name: "Brookline Tab", address: "brookline@wickedlocal.com"},
	{domain: "cambridge.wickedlocal.com", name: "Cambridge Tab", address: "cambridge@wickedlocal.com"},
	{domain: "arlington.wickedlocal.com", name: "Arlington Advocate", address: "arlington@wickedlocal.com"},
	{domain: "belmont.wickedlocal.com", name: "Belmont Citizen", address: "belmont@wickedlocal.com"},
	{domain: "patriotledger.com", name: "Patriot Ledger", address: "editpage@ledger.com"},
	{domain: "medford.wickedlocal.com", name: "Medford Transcript", address: "medford@wickedlocal.com"},
	{domain: "metro.us", name: "Metro", address: "letters@metro.us"},
	{domain: "www.thesunchronicle.com", name: "Attleboro Sun Chronicle", address: "mkirby@thesunchronicle.com"},
	{domain: "metrowestdailynews.com", name: "MWDN", address: "mdnletters@wickedlocal.com"},
	{domain: "watertown.wickedlocal.com", name: "Watertown Tab", address: "watertown@wickedlocal.com"},
	{domain: "thecrimson.com", name: "Harvard Crimson", address: "letters@thecrimson.com"},
	{domain: "gazettenet.com", name: "Hampshire Gazette", address: "opinion@gazettenet.com"},
	{domain: "sentinelandenterprise.com", name: "Fitchburg Sentinel & Enterprise", address: "letters@sentinelandenterprise.com "},
	{domain: "masslive.com", name: "Springfield Republican", address: "letters@repub.com"},
	{domain: "thesomervilletimes.com", name: "Somerville Times", address: "jclark@thesomervilletimes.com"},
	{domain: "providencejournal.com", name: "Providence Journal", address: "letters@providencejournal.com"},
	{domain: "somerville.wickedlocal.com", name: "Somerville Journal", address: "somerville@wickedlocal.com"},
	{domain: "salemnews.com", name: "Salem News", address: "https://www.salemnews.com/site/forms/online_services/letter/"},
	{domain: "eagletribune.com", name: "Haverhill Eagle-Tribune", address: "https://www.eagletribune.com/site/forms/online_services/letter/"},
	{domain: "recorder.com", name: "Greenfield Recorder", address: "http://www.recorder.com/Opinion/Submit-a-Letter"},
	{domain: "milforddailynews.com", name: "Milford Daily News", address: "mdnletters@wickedlocal.com"},
	{domain: "heraldnews.com", name: "Fall River Herald News", address: "letters@heraldnews.com"},
	{domain: "barnstablepatriot.com", name: "Barnstable Patriot", address: "letters@barnstablepatriot.com"},
	{domain: "washingtonpost.com", name: "Washington Post", address: "letters@washpost.com"},
	{domain: "unionleader.com", name: "Manchester Union Leader", address: "letters@unionleader.com"},
	{domain: "nytimes.com", name: "New York Times", address: "letters@nytimes.com"},
	{domain: "concordmonitor.com", name: "Concord Monitor", address: "http://www.concordmonitor.com/Opinion/Submit-a-Letter"},
	{domain: "timesunion.com", name: "Albany Times Union", address: "tuletters@timesunion.com"},
	{domain: "courant.com", name: "Hartford Courtant", address: "letters@courant.com"},
	{domain: "dotnews.com", name: "Dorchester Reporter", address: "letters@dotnews.com"},
	{domain: "gloucestertimes.com", name: "Gloucester Times", address: "https://www.gloucestertimes.com/site/forms/online_services/letter/"},
	{domain: "portlandtribune.com", name: "Portland Tribune", address: "tbd"},
	{domain: "oregonlive.com", name: "Oregon Live", address: "tbd"},
	{domain: "portlandobserver.com", name: "Portland Observer", address: "tbd"},
	{domain: "portlandmercury.com", name: "Portland Mercury", address: "tbd"}
];

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function lookupPaperObject(url) {
	var result = null;

	for (var i in _papers) {
		var p = _papers[i];
		if (url.indexOf(p.domain) >= 0)
			result = p;
	}

	if (!result) {

		var idx = url.indexOf("wickedlocal.com")
		if (idx > 1) {
			var town = url.substring(0, idx-1);
			if (town.indexOf("https://") === 0) {
				town = town.substring(8);
			}
			else if (town.indexOf("http://") === 0) {
				town = town.substring(7);
			}

			var firstChar = town.charAt(0).toUpperCase();
			var townCap = firstChar + town.substring(1) + " Wicked Local";

			result = {
				domain: town + ".wickedlocal.com",
				name: townCap,
				address: town + "@wickedlocal.com"
			};
		}
	}

	return result;
}


function applyUrlFilters(items) {
    return items.filter(function(value, index, self) {
        var s = value.url.toLowerCase();
        for (var i=0; i < urlFilters.length; ++i) {
           if (s.indexOf(urlFilters[i]) >= 0)
            return false;
        }
        return true;
    });
}

function applyContentFilters(items) {
    return items.filter(function(value, index, self) {
        var s = value.description;
        for (var i=0; i < contentFilters.length; ++i) {
           if (s.indexOf(contentFilters[i]) >= 0)
            return false;
        }
        return true;
    });
}

function applyFilters(items) {
    items = applyContentFilters(items);
    return applyUrlFilters(items);
}

function dedupItems(items) {
    items.sort(function(d1, d2) {
        if (d1.url == d2.url) return 0;
        if (d1.url > d2.url) return 1;
        return -1;
    });
    return items.filter(function(value, index, self) {
        if (index == 0) return true;
        return value.url != self[index-1].url;
    });
}

function buildResultTable(jsonArr) {
    jsonArr = dedupItems(jsonArr);
    if (DO_FILTER)
        jsonArr = applyFilters(jsonArr);

    var table = $('#digest');
    
    if (!bFirstQuery) {
    	var parent = $("#table-parent");
    	$(parent.children()[0]).remove();
    	var tblMarkup = "<table id='digest' class='hover stripe'><thead><tr><th>Date</th><th>Source</th><th>Item</th><th>Summary</th></tr></thead><tbody></tbody></table>";
    	parent.append(tblMarkup);
    	table = $('#digest');
    	if (gDataTable)
    		gDataTable.destroy();
    }
    else {
    	bFirstQuery = false;
    }
    
    for (i in jsonArr) {
        d = jsonArr[i];

        var paper = lookupPaperObject(d.url);
        var paperName;
        if (!paper)
            paperName = "&lt;Unrecognized domain&gt;"
        else
            paperName = paper.name
        date = (new Date(d.pubDate)).toLocaleDateString("en-US",{month: "short", day: "numeric"});
        row = "<tr>";
        row += "<td>" + date + "</td>";
        row += "<td>" + paperName + "</td>";
        row += "<td>" + "<a target='_blank' href='" + d.url + "'>" + d.title + "</a></td>";
        row += "<td>" + d.pubDate + " " + d.description + "</td>";
        table.append(row);
    }

    gDataTable = table.DataTable(DATA_TABLE_OPTIONS);
}

function walkUpToRow(e) {
    var elem = e;
    while (elem && (elem.tagName != 'TR')) {
        elem = elem.parentElement;
    }
    return elem ? elem : e;
}


function showDesc(ev) {
    var row = walkUpToRow(ev.target);
    $("#desc_area").html(row.tw_desc);
}

function getDigest() {
    $("#digest tbody tr").remove();
    $("#loading").show();
    var url;
    if (USE_TEST_DATA) {
        url = '../static/testdata/feedtest.json';
    }
    else {
        url = 'ltesearch.php';
    }
    var age = $("#max_age").val();
    if (age != "None") {
        url += "?max_age=" + age;
    }
    var area = $("#region").val();
    url += "&region=" + area;
    url += "&action=search";

    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) { $("#digest").show(); $("#loading").hide(); buildResultTable(JSON.parse(data)) },
        cache: false,
        contentType: false,
        processData: false
    });
}

