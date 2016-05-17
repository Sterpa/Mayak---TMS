/*
http://www.sbmkpm.com/multigraph.html
Line Graph script-By Balamurugan S http://www.sbmkpm.com
Script featured/ available at Dynamic Drive code: http://www.dynamicdrive.com
*/
var g = new line_graph();
g.add(0, 0);
var g_name = "";
var g_Yres = 300;
var g_Ymax = 25;
var g_color = 1;

/*
Gauge from https://github.com/Mikhus/canv-gauge
*/

BUT_str = "";
var proc_state = "";
var eng_state = "";
var log_state = 0;
var time_val = 0;
var data_val = 0.00;

var oldTime = 0;
var newData = 0;


function GetArduinoInputs()
{
	//if (data_val > 22) data_val = 0; /* Только для тестовой отладки */
	nocache = "&nocache=" + Math.random() * 1000000;
	var request = new XMLHttpRequest();
	request.onreadystatechange = function()
	{
		if (this.readyState == 4) {
			if (this.status == 200) {
				if (this.responseXML != null) {
					proc_state = this.responseXML.getElementsByTagName('process')[0].childNodes[0].nodeValue;
					eng_state = this.responseXML.getElementsByTagName('engine')[0].childNodes[0].nodeValue;
					log_state = this.responseXML.getElementsByTagName('log')[0].childNodes[0].nodeValue;
					time_val = this.responseXML.getElementsByTagName('time')[0].childNodes[0].nodeValue;
					data_val = this.responseXML.getElementsByTagName('data')[0].childNodes[0].nodeValue;
					updateForm();
				}
			}
		}
	}
	request.open("GET", "ajax_inputs" + BUT_str + nocache, true);
	request.send(null);
	setTimeout('GetArduinoInputs()', 1000);
	BUT_str = "";
}

function intDiv(x, y){
    return x/y>>0;
}

function intDiv2(x, y){
    return (x-x%y)/y;
}

function updateForm() {
	var time_sec = intDiv(time_val, 1000);
	var time_min = intDiv(time_sec, 60);
	
	document.getElementById("procState").innerHTML = proc_state;
	document.getElementById("engState").innerHTML = eng_state;
	document.getElementById("inputTime").innerHTML = time_sec;
	document.getElementById("inputData").innerHTML = data_val;

	var el = document.getElementById("REC");	
	switch(log_state) {
		case 0:  // if (x === 'value1')
			el.className = el.className.replace('blink', 'fog');
			break;
		case 1:  // if (x === 'value2')
			el.className = el.className.replace('fog', 'blink');
			break;
		default:
			break;
	}
	
	if (time_min != oldTime) {
		if (time_val != 0) {
			if (time_sec%60 == 0) {
				g.add(time_min, data_val);
				initGraph();
				oldTime = time_min;
			}
		}
	}
}

function GetBUT0() // STOP
{
	var el = document.getElementById("BUT0");
	var st = document.getElementById("BUT0state");
	BUT_str = "$BUT=0";
}

function GetBUT1() // START
{
	var el = document.getElementById("BUT1");
	var st = document.getElementById("BUT1state");
	BUT_str = "$BUT=1";
}

function GetBUT2() // RESET
{
	var el = document.getElementById("BUT2");
	var st = document.getElementById("BUT2state");
	BUT_str = "$BUT=2";
	resetGraph();
}

function initGraph()
{
	document.getElementById("lineCanvas").innerHTML = "";
	// set the same max for all graphs. Set approproate colors
	g.setMax(g_Ymax); g.setColor(g_color);
	// render them all to the same canvas
	g.render("lineCanvas", g_name, g_Yres);
}

function resetGraph()
{
	g = null;
	g = new line_graph();
	g.add(0, 0);
	initGraph();
}

function init()
{
	initGraph();
	GetArduinoInputs();
}
