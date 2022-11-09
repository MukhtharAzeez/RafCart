// const { LastMonthList } = require("twilio/lib/rest/api/v2010/account/usage/record/lastMonth");

$(document).ready(function () {
   
    $("select.periodSelect").change(function () {
        var selectedPeriod = $(this).children("option:selected").val();

        $("#valuesByInput option").remove();
        let currentDate = new Date();

        if(selectedPeriod=='year'){
            for(var i=1;i<10;i++){
                year=currentDate.getFullYear()-i
                optText = `${year}`;
                optValue = `${year}`;
                $("#valuesByInput").append(
                    `<option value="${optValue}">${optText}</option>`
                );
            }
        }else if (selectedPeriod == 'month') {
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            currentDate = currentDate.getMonth();
            for (var i = 1; i <= currentDate; i++) {
                let date = new Date(new Date().getTime() - (i * 30 * 24 * 60 * 60 * 1000))
                date = month[date.getMonth()];
                optText = `${date}`;
                optValue = `${date}`;
                $("#valuesByInput").append(
                    `<option value="${optValue}">${optText}</option>`
                );
            }
        } else if (selectedPeriod == 'week') {
            currentDate = currentDate.getDate();
            currentDate=currentDate/7
            
            for(var i=0;i<currentDate;i+=7){
                    optText = `${i}-${i+7}`;
                    optValue = `${i}-${i+7}`;
                    $("#valuesByInput").append(
                        `<option value="${optValue}">${optText}</option>`
                    );
            }
        }else if (selectedPeriod=='day'){
            currentDate = currentDate.getDate();
            for(var i=0;i<currentDate;i++){
                optText = `Day${i+1}`;
                optValue = `Day${i+1}`;
                $("#valuesByInput").append(
                    `<option value="${optValue}">${optText}</option>`
                );
        }
        }



    })

    $("#downloadSalesReport").click(function () {
        // $('#invoice').removeClass('d-none')
        let selectedPeriods = $("#periodSelect").val()
        let selectedSecond = $("#valuesByInput").val()
        console.log(selectedPeriods,selectedSecond)
        if(selectedPeriods=='year'){
            $('#titleBySelection').html('Month')
            $.ajax({
                url : `/admin/get-salesReport-by-year?year=${selectedSecond}`,
                method : 'get',
                success : (response)=>{
                    $('#fromDate').html(selectedSecond);
                    $('#toDate').html(parseInt(selectedSecond)+1);
                    let div=$('#salesReport')
                    let html=''
                    let total=0
                    response.incomeStatistics.forEach(function(item){
                        
                        html+=`<tr > 
                        <td>${item.month}</td>
                        <td>${item.total}</td>
                    </tr>`
                    total+=item.total
                    })
                    $('#totalSpan').html(total)
                    div.html(html)
                }
            })
        }else if(selectedPeriods=='month'){
            $('#titleBySelection').html('Week')
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            selectedSeconds=month.indexOf(selectedSecond)+1
            toMonth=month[selectedSeconds]
            $.ajax({
                url : `/admin/get-salesReport-by-month?month=${selectedSeconds}`,
                method : 'get',
                success : (response)=>{
                    console.log(response)
                    $('#fromDate').html(selectedSecond);
                    $('#toDate').html(toMonth);
                    let div=$('#salesReport')
                    let html=''
                    let total=0
                    response.incomeStatistics.forEach(function(item){
                        item._id=(item._id-(selectedSeconds)*4)+1
                        html+=`<tr > 
                        <td>${item._id}</td>
                        <td>${item.total}</td>
                    </tr>`
                    total+=item.total
                    })
                    $('#totalSpan').html(total)
                    div.html(html)
                }
            })
        }else if(selectedPeriods=='week'){
            $('#titleBySelection').html('Day')
            selectedSecond= selectedSecond.split("-")
            selectedSecond=selectedSecond[1]
            from = selectedSecond-6
            $.ajax({
                url : `/admin/get-salesReport-by-week?week=${selectedSecond}`,
                method : 'get',
                success : (response)=>{
                    console.log(response)
                    $('#fromDate').html('Day '+from);
                    $('#toDate').html('Day '+selectedSecond);
                    let div=$('#salesReport')
                    let html=''
                    let total=0
                    response.weeklySalesReport.forEach(function(item){
                        
                        html+=`<tr > 
                        <td>${item._id}</td>
                        <td>${item.total}</td>
                    </tr>`
                    total+=item.total
                    })
                    $('#totalSpan').html(total)
                    div.html(html)
                }
            })
            
        }

        // $('#invoice').addClass('d-none')

        // For downloading the report
        setTimeout(function() {
            var element = document.getElementById('invoice'); 
			//easy
			//html2pdf().from(element).save();	
			var opt = 
			{
			  margin:       0.2,
			  filename:     'La Bonnz '+`${selectedSecond}`+'.pdf',
			  html2canvas:  { scale: 2 },
			  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
			};

			// New Promise-based usage:
			html2pdf().set(opt).from(element).save(); 
        },1000)
         
    })

})