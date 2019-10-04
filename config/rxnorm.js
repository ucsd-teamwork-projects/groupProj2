//https://rxnav.nlm.nih.gov/REST/rxcui/153165/allrelated 


var axios = require("axios");

var userSearch;
var rxObject = {};


rxSearch("lipitor");

function rxSearch(userSearch) {

  console.log("Initiate rxNorm API call with the userSearch: " + userSearch);
  var queryURL = "https://rxnav.nlm.nih.gov/REST/approximateTerm?term=" +
    userSearch + "&maxEntries=1";

  axios
    .get(queryURL)
    .then(function (response) {
      var rxId = response.data.approximateGroup.candidate[0].rxcui;

      getRxObject(rxId);

      //take rxcui, axios get object with drug names
    })
    .catch(function (error) {
      console.log("\n\n\nrxnorm.js has halted this host process! RXCUI search failed to generate due to invalid query.\n\n\n");
      console.log(error);
    })
    .finally(function () {});
}

function getRxObject( rxcui ) {
  var queryURL = "https://rxnav.nlm.nih.gov/REST/rxcui/" + rxcui + "/allrelated"

axios
  .get(queryURL)
  .then(function (response) {
    console.log("generating rx object ", response.data.allRelatedGroup.conceptGroup);

    //take rxcui, axios get object with drug names
  })
  .catch(function (error) {
    console.log("\n\n\nrxnorm.js has halted this process! RXCUI to name list conversion failed to generate due to invalid id.\n\n\n");
    console.log(error);
  })
  .finally(function () {});
}
