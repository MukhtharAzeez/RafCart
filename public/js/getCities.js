

document.getElementById('state').addEventListener('change', function(){
    var selectedState = $(this).children("option:selected").val();
    var select = document.getElementById("city");
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
      select.options[i] = null;
    }
    optText = 'Select City';
    optValue = '';
    $("#city").append(
        `<option value="${optValue}">${optText}</option>`
      );
    function getAllCities() {
        $.ajax({
          url: `/getAllCities/${selectedState}`,
          method: "get",
          success: (response) => {
            $.each(response, function (i, value) {
              optText = `${value.name}`;
              optValue = `${value.name}`;
              $("#city").append(
                `<option value="${optValue}">${optText}</option>`
              );
              // $('#foo').append('<option id=' + JSON.stringify(value.name) + '>' + JSON.stringify(value.name) + '</option>');
            });
          },
        });
      }
      getAllCities();
    
});
