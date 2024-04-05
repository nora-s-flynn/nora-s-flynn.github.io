// variables
var lm = 2; // mission level L_m
var lp = 2.25;  // average party level L_p
var nm = 3;  // suggested number of agents N_m
var na = 4;  // number of agents sent
var s = 2;  // team suitability
var r = -3;  // guild reputation
var b = 0;  // situational bonus

// formulae:
// additional paramters:
var a = 2; // overall strength
var al = 1; // strength for party level
var as = 1; // strength for suitability
var an = 0.8; // strength for number of party memebers
var ar = 0.8; // strength for guild reputation
var ab = 1.1; // strength for situational bonus

// main factor for outcome
var m = a * Math.log10((5/4) * Math.pow((lp/lm), al) * Math.pow((s/nm), as) * Math.pow((na/nm), an) * Math.pow((1+(r/100)), ar) * Math.pow((1+(b/100)), ab));

// calculations for the boundaries:
// fa - 100: Critical success
var ma = -1.1;
var ka = 0.5;
var fa = Math.round(50*(1-Math.tanh(ka*m + ma)));
console.log("fa="+fa);

// fb - (fa-1):  success
var mb = 0.1;
var kb = 1;
var fb = Math.round(50*(1-Math.tanh(kb*m + mb)));
console.log("fb="+fb);

// fc - (fb-1):  mixed
var mc = 0.35;
var kc = 1;
var fc = Math.round(50*(1-Math.tanh(kc*m + mc)));
console.log("fc="+fc);

// 0 - (fd-1):  mixed
var md = 1;
var kd = 1;
var fd = Math.round(50*(1-Math.tanh(kd*m + md)));
console.log("fd="+fd);

// PLOTTING:
/* 
Critical success size: (100-fa+1)
Success size: (fa-fb)
Mixed outcome size: (fb-fc)
Failure size: (fc-fd)
Failure req int size: (fd-1)
*/