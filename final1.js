acqdata();


function acqdata(){
	var cleanData = [];
    var data2 = [];
	var acqSelectors = {
		"Software" : "bar",
		"Mobile" : "bar-silver",    //define the color of each selector
		"Hardware" : "bar-green",
		"Advertising" : "bar-purple",
		"Media" : "bar-violet",
        "Search" : "bar-yellow",
        "eCommerce" : "bar-turquoise",
        "Other" : "bar-pink"
	};
  /* Define selectors of companies been acquired  */

	d3.csv("tenormore.csv", function(error, root){
		if(error) throw error;
    var bigCompanyNames = [];
    var acquisitions = [];
 //   console.log(root);

 for (var i = 0; i<root.length; i++){
    for(var j= i+1; j<root.length; j++){
        if((root[i].name == root[j].name) && (root[i].startDate==root[j].startDate)){
            acquisitions.push(root[j].acquisition);
        }else { break;}                
    } //filter acquisitions in the same year into an array
    acquisitions.push(root[i].acquisition);
    data2.push({
                "name":root[i].name,
                "year":root[i].startDate,
                "acquisitions":acquisitions
        });
            acquisitions=[];
 }
//data in data2  grouped together by big companies and the time, but some are duplicated 
// console.log(data2);

for(var i = 0; i<root.length; i++){
    for(var j=0; j<data2.length;j++){
        if((data2[j].name == root[i].name) &&(data2[j].year == root[i].startDate)){
          cleanData.push({
        "startDate" : new Date(root[i].startDate),
        "endDate" : new Date(root[i].endDate),
        "taskName" : root[i].name,
        "status" : root[i].sectors,
        "acquisitions":data2[j].acquisitions
         }); 
          break;
       }
    }     
}
// this for loop filtered out duplicated data in data2

//console.log(cleanData);

var sortedata = cleanData.sort(function(a, b) {
     return a.startDate - b.startDate;
 });// sort data chronologically

// console.log(sortedata);

for(var i = 0; i<sortedata.length; i++){
    if(bigCompanyNames.indexOf(sortedata[i].taskName)== -1){
        bigCompanyNames.push(sortedata[i].taskName);
     }}

var format = "%Y";
var gantt = d3.gantt().taskTypes(bigCompanyNames).taskStatus(acqSelectors).tickFormat(format);
gantt(sortedata);
		});
}