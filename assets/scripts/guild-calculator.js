// variables initial values per example:
var lm = 2; // mission level L_m
var lp = 2.25;  // average party level L_p
var nm = 3;  // suggested number of agents N_m
var na = 4;  // number of agents sent
var s = 2;  // team suitability
var r = -3;  // guild reputation
var b = 0;  // situational bonus

// formulae:
// additional paramters initial values:
var a = 2; // overall strength
var al = 1; // strength for party level
var as = 1; // strength for suitability
var an = 0.8; // strength for number of party memebers
var ar = 0.8; // strength for guild reputation
var ab = 1.1; // strength for situational bonus

// main factor for outcome - hardcoded initial value per example
var m = 0.193820026016;

// calculations for the boundaries:
// critical success
var ma = -1.1;
var ka = 0.5;
var fa = Math.round(50*(1-Math.tanh(ka*m + ma)));
// console.log("fa="+fa);

// success
var mb = 0.1;
var kb = 1;
var fb = Math.round(50*(1-Math.tanh(kb*m + mb)));
// console.log("fb="+fb);

// mixed outcome
var mc = 0.35;
var kc = 1;
var fc = Math.round(50*(1-Math.tanh(kc*m + mc)));
// console.log("fc="+fc);

// 0 - (fd-1):  mixed
var md = 1;
var kd = 1;
var fd = Math.round(50*(1-Math.tanh(kd*m + md)));
// console.log("fd="+fd);

// put all formulae in a function to be called with event listeners:
function recalcActions() {
    // main factor m:
    m =  a * Math.log10((5/4) * Math.pow((lp/lm), al) * Math.pow((s/nm), as) * Math.pow((na/nm), an) * Math.pow((1+(r/100)), ar) * Math.pow((1+(b/100)), ab));

    // boundaries of the areas:
    fa = Math.round(50*(1-Math.tanh(ka*m + ma)));
    fb = Math.round(50*(1-Math.tanh(kb*m + mb)));
    fc = Math.round(50*(1-Math.tanh(kc*m + mc)));
    fd = Math.round(50*(1-Math.tanh(kd*m + md)));
    // console.log("new m="+m+"; fa="+fa+"; fb="+fb+"; fc="+fc+"; fd="+fd); // sanity check

    // PLOTTING: for each outcome set size value, set style="height: X%" on divs, set td of table
    /* 
    Critical success size: (100-fa+1)
    Success size: (fa-fb)
    Mixed outcome size: (fb-fc)
    Failure size: (fc-fd)
    Failure req int size: (fd-1)
    */
   var crit_success_size = 100 - fa + 1;
   document.getElementById("critical-success-bar").setAttribute("style", "height: "+crit_success_size+"%");
   document.getElementById("critical-success-values").innerHTML = fa+"-100";
   var success_size = fa - fb;
   document.getElementById("success-bar").setAttribute("style", "height: "+success_size+"%");
   document.getElementById("success-values").innerHTML = fb+"-"+(fa-1);
   var mixed_size = fb - fc;
   document.getElementById("mixed-outcome-bar").setAttribute("style", "height: "+mixed_size+"%");
   document.getElementById("mixed-outcome-values").innerHTML = fc+"-"+(fb-1);
   var failure_size = fc - fd;
   document.getElementById("failure-bar").setAttribute("style", "height: "+failure_size+"%");
   document.getElementById("failure-values").innerHTML = fd+"-"+(fc-1);
   var crit_failure_size = fd - 1;
   document.getElementById("critical-failure-bar").setAttribute("style", "height: "+crit_failure_size+"%");
   document.getElementById("critical-failure-values").innerHTML = "0-"+(fd-1);

//    console.log(crit_success_size+success_size+mixed_size+failure_size+crit_failure_size+"%"); // sanity check if they add up to 100%
};

// add event listeners for all sliders:
document.getElementById("L_M").addEventListener("change", function() {
    lm = document.getElementById("L_M").value;
    recalcActions();
});

document.getElementById("L_P").addEventListener("change", function() {
    lp = document.getElementById("L_M").value;
    recalcActions();
});

document.getElementById("N_M").addEventListener("change", function() {
    nm = document.getElementById("N_M").value;
    // set max of agents sent N_A to suggested number of agents N_M + 1
    document.getElementById("N_A").max = nm + 1;
    // set max of suitability S to suggested number of agents N_M
    document.getElementById("S").max = nm;
    recalcActions();
});

document.getElementById("N_A").addEventListener("change", function() {
    na = document.getElementById("N_A").value;
    // set step of L_P to be 1/N_A
    document.getElementById("L_P").step = (1/na);
    recalcActions();
});

document.getElementById("S").addEventListener("change", function() {
    s = document.getElementById("S").value;
    recalcActions();
});

document.getElementById("R").addEventListener("change", function() {
    r = document.getElementById("R").value;
    recalcActions();
});

document.getElementById("B").addEventListener("change", function() {
    b = document.getElementById("B").value;
    recalcActions();
});