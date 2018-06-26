<?php
?>
<!DOCTYPE html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="ltesearch.js"></script>
    <title>LTE Digest</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.16/datatables.min.css"/>
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.16/datatables.min.js"></script>

    <style type="text/css">
        body {
           background-color: rgba(30,30,120,1);
        }
        #container {
            width: 60%;
            max-width: 800px;
            margin: auto;
            background-color: #e8e8f0;
            padding: 20px;
        }
        #desc_area {
            background-color: #e8e8e8;
            padding: 10px;
            border-top: solid 1px #ddd;
        }
        #controls {
            background-color: #e8e8e8;
            padding: 20px;
            border-bottom: solid 1px #aaa;
            margin-bottom: 20px;
        }
        .spacer100 {
            display: inline-block;
            margin: 0 50px 0 50px;
        }
        #fetch {
            font-size: 13px;
        }
        #loading {
            background-color: white;
            height: 35px;
            margin-top: 10px;
            padding: 0 0 10px 10px;
        }
        #loading img {
            vertical-align: middle;
        }
        #digest_length {
            display: none;  /* don't show page length control */
        }
     </style>
</head>

<body>
    <div id="container">
        <div id="controls">
            <select id="region">
                <option>Massachusetts</option>
                <option>Oregon</option>
            </select>
            <div class="spacer100"></div>
            <button id="fetch">Search</button>
            <div class="spacer100">     </div>
            <div id = "loading">
                Fetching feeds . . .
                <img height="45px" src="loading_spinner.gif">
            </div>
         </div>
         <div id="table-parent">
			<table id="digest" class="hover stripe">
				<thead>
					<tr><th>Date</th><th>Source</th><th>Item</th><th>Summary</th></tr>
				</thead>
				<tbody>

				</tbody>
			</table>
		</div>
        <div id="desc_area"></div>
    </div>

</body>