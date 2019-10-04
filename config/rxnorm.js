var axios = require('axios');

var rxcui;
var userSearch;
rxNorm(userSearch);

function rxNorm(userSearch) {

console.log("Initiate rxNorm API call with the userSearch: " + userSearch );
 var queryURL = "https://rxnav.nlm.nih.gov/REST/rxcui?name=" + userSearch;


axios.get(queryURL)
.then(function (response) {
  rxcui = response.data.idGroup.rxnormId[0];
})
.catch(function (error) {
  console.log("\n\n\nrxnorm.js has halted this process!\n\n\n");
  console.log(error);
})
.finally(function () {
  console.log("Call done.  Returning rxnormId: #" + rxcui);
  return rxcui;
});
}