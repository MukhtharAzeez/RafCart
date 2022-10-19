$(document).ready(function () {
    // fetch states when selects a country
  $("select.country").change(function () {
    var selectedCountry = $(this).children("option:selected").val();

    var select = document.getElementById("state");
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
      select.options[i] = null;
    }
    optText = 'Select State';
    optValue = '';
    $("#state").append(
        `<option value="${optValue}">${optText}</option>`
      );
    function getAllStates() {
      $.ajax({
        url: `/getAllStates/${selectedCountry}`,
        method: "get",
        success: (response) => {
          $.each(response, function (i, value) {
            optText = `${value.name}`;
            optValue = `${value.name}`;
            $("#state").append(
              `<option value="${optValue}">${optText}</option>`
            );
            // $('#foo').append('<option id=' + JSON.stringify(value.name) + '>' + JSON.stringify(value.name) + '</option>');
          });
        },
      });
    }
    getAllStates();
  });

  
});
