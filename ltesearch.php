<?php
define('ACTION', 'action');
define('REGION', 'region');
define('SEARCH', 'search');
define('MAXAGE', 'max_age');
define('MISSING_PARAM', "A required parameter is missing");
define('REGION_INVALID', "Specified region not configured");
define('MAX_RESULTS', 100);

include "CustomSearch.php";
include "data.php";

	$parts = parse_url($_SERVER['REQUEST_URI']);
	parse_str($parts['query'], $qstr_aa);

	$action = $qstr_aa[ACTION];
	if (empty($action)) {
		echo return_error(MISSING_PARAM, ACTION);
	}
	
	if ($action == SEARCH) {
		$region = $qstr_aa[REGION];
		if (empty($region)) {
			echo return_error(MISSING_PARAM, REGION);
		}
		$maxage = $qstr_aa[MAXAGE];
		if (empty($maxage)) {
			echo return_error(MISSING_PARAM, MAXAGE);
		}
		
		echo search($region, $maxage);
	}
	
	function return_error($error, $data) {
		return '{"error": "' . $error . ': ' . $data . '"}';
	}

	function search($region, $maxage) {
		global $engine_ids;
		global $search_terms;
		global $excludes;
		
		$engine = $engine_ids[$region];
		if (empty($engine)) {
			return return_error(REGION_INVALID, $region);
		}
	
		$cse = new CustomSearch($engine, $search_terms[$region], $excludes[$region]);
	
		return $cse->execute_search(MAX_RESULTS);
	}