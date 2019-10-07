//Performs logic for type ahead search of drug name
const search = document.getElementById("rxName");
const matchlist = document.getElementById("matchlist");

//async function that is run when input event is triggered
const searchMeds = async searchText => {
  //api fetch to search meds based on user input
  const res = await fetch(
    //"https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + searchText.toLowerCase()
    "https://rxnav.nlm.nih.gov/REST/drugs.json?name=" + searchText.toLowerCase()
  );
  const meds = await res.json();

  let matches = [];

  //if a rxNum is found, add value results
  if (meds.drugGroup.hasOwnProperty("conceptGroup")) {
    console.log(meds);
    meds.drugGroup.conceptGroup.forEach(cg => {
      if (cg.hasOwnProperty("conceptProperties")) {
        //if (meds.drugGroup.conceptGroup[1].conceptProperties[0].rxcui) {
        cg.conceptProperties.forEach(element => {
          matches.push(element);
        });
      }
    });
  }

  //if no rxNum is found empty array
  if (searchText.length === 0 || matches.length === 0) {
    matchlist.innerHTML = "";
    matches = [];
  }

  //Display matches to user
  outputHtml(matches);
};

//creates the HTML to display list of matching medications names
const outputHtml = matches => {
  if (matches.length > 0) {
    const html = matches
      .map(
        match => `
        <div class="card-group">
          <a style="width: 80%">
          <div data-rxNum="${match.rxcui}" data-rxName="${match.name}" class="card card-body p-1 mb-1 medResult">
              <h5>${match.name}</h4>
              <small>Rx: ${match.rxcui}</small>
          </div>
          </a>
        </div>
        `
      )
      .join("");

    matchlist.innerHTML = html;
  }
};

//Adds input listener to rxName text field
search.addEventListener("input", () => searchMeds(search.value));
