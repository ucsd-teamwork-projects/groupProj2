//Performs logic for type ahead search of drug name
const search = document.getElementById("rxName");
const matchlist = document.getElementById("matchlist");

//async function that is run when input event is triggered
const searchMeds = async searchText => {
  //api fetch to search meds based on user input
  const res = await fetch(
    "https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + searchText.toLowerCase()
  );
  const meds = await res.json();

  let matches = [];

  //if a rxNum is found, add value results
  if (meds.idGroup.rxnormId) {
    meds.idGroup.rxnormId.forEach(element => {
      matches.push(element);
    });
  }

  //if no rxNum is found empty array
  if (searchText.length === 0) {
    matches = [];
  }

  //Display matches to user
  outputHtml(meds.idGroup.name, matches);
};

//creates the HTML to display list of matching medications names
const outputHtml = (name, matches) => {
  if (matches.length > 0) {
    var upperName = name.toUpperCase();
    const html = matches
      .map(
        match => `
        <div data-rxNum="${match}" data-rxName="${upperName}" class="card card-body mb-4 medResult">
            <h4>${upperName}</h4>
            <small>Rx: ${match}</small>
        </div>
        `
      )
      .join("");

    matchlist.innerHTML = html;
  }
};

//Adds input listener to rxName text field
search.addEventListener("input", () => searchMeds(search.value));
