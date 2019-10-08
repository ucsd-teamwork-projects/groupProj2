$(function() {
  $(document).on("click", ".medResult", function() {
    $("#rxName").val($(this).attr("data-rxName"));
    $("#rxNum").val($(this).attr("data-rxNum"));
    $("#matchlist").empty();
    $("html, body").animate({ scrollTop: 0 }, "fast");
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

  $(document).on("click", ".rxNum", function() {
    var rxNum = $(this).attr("data-rx");
    console.log(rxNum);
    var url = `https://rxnav.nlm.nih.gov/REST/RxTerms/rxcui/${rxNum}/allinfo.json`;
    $.get(url, function(data) {
      var medInfo = data.rxtermsProperties;

      if (medInfo === null) {
        $("#modalTitle").text(rxNum);
        $(".modal-body").append(
          $("<p>").html("No information available for this RxCUI!")
        );
      } else {
        $("#modalTitle").text(medInfo.fullName);
        $(".modal-body").append(
          $("<p>").html("<strong>Brand Name: </strong>" + medInfo.brandName)
        );
        $(".modal-body").append(
          $("<p>").html(
            "<strong>Generic RxCUI#: </strong>" + medInfo.genericRxcui
          )
        );
        $(".modal-body").append(
          $("<p>").html("<strong>Dose Route: </strong>" + medInfo.route)
        );
        $(".modal-body").append(
          $("<p>").html("<strong>Strength: </strong>" + medInfo.strength)
        );
      }
    });
  });

  $(document).on("click", ".close-modal", function() {
    $(".modal-body").empty();
  });
});
