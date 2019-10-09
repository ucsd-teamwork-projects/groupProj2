var axios = require("axios");

axios
  .get(
    "https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=207106+152923+656659+84815+371834+373737"
  )
  .then(function(response) {
    console.log(response.data.fullInteractionTypeGroup[1]);

    if ("fullInteractionTypeGroup" in response.data){
        console.log("yes")
    }
  })
  .catch(function(error) {
    // handle error
    console.log(error);


    
  })
  .finally(function() {
    // always executed
  });
