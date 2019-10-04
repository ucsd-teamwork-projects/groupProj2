var axios = require('axios');

var userSearch = "lipitor";
rxNorm(userSearch);

function rxNorm(userSearch) {

console.log("Initiate rxNorm API call with the userSearch: " + userSearch );
 var queryURL = "https://rxnav.nlm.nih.gov/REST/rxcui?name=" + userSearch;


axios.get(queryURL)
.then(function (response) {
  var rxnormId = response.data.idGroup.rxnormId[0];
})
.catch(function (error) {
  console.log("rxnorm.js has halted this process!");
})
.finally(function () {
  console.log("Call done.  Returning rxnormId: #" + userSearch);
  return userSearch;
});
}