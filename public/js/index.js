// Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// // The API object contains methods for each kind of request we'll make
// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);

// const search = document.getElementById("rxName");
// const matchlist = document.getElementById("matchlist");

// const searchMeds = async searchText => {
//   const res = await fetch("https://rxnav.nlm.nih.gov/REST/rxcui.json?name="+searchText.toLowerCase());
//   const meds = await res.json();

//   let matches = [];

//   if (meds.idGroup.rxnormId) {
//     meds.idGroup.rxnormId.forEach(element => {
//       matches.push(element);
//     });
//   }

//   if (searchText.length ===0) {
//     matches = [];
//   }

//   outputHtml(meds.idGroup.name, matches);  
// };

// const outputHtml = (name, matches) => {
//   if(matches.length > 0) {
//     var upperName = name.toUpperCase();
//     const html = matches.map(match => `
//       <div data-rxNum="${match}" class="card card-body mb-4 medResult">
//         <h4>${upperName}</h4>
//         <small>Rx: ${match}</small>
//       </div>
//     `).join("");
    
//     matchlist.innerHTML = html;
//   }
// }

// search.addEventListener("input", () => searchMeds(search.value));

$(function() {
  $(document).on("click", ".medResult", function() {
    $("#rxNum").val($(this).attr("data-rxNum"));
    $("#matchlist").empty();
  });

  $(document).on("click", ".delete-med", function() {
    var id = $(this).attr("data-id");
    $.ajax({
      url: "api/del-med/" + id,
      type: "DELETE"
    }).then(function() {
      $("medrow-" + id).remove();
      location.reload();
    });
  });
});
