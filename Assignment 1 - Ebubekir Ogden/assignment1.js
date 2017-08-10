function updateUI(){

    var newTemp;
    var newPressure;
    var newHumidity;

    setInterval(function(){

        var values = $('.cellText');

        newTemp = Math.floor(Math.random() * 100) + 1;
        newPressure = Math.floor(Math.random() * 100) + 1;
        newHumidity = Math.floor(Math.random() * 100) + 1;

        if(newTemp > values[3].innerHTML){
            $('#tempValue').addClass('success');

            setTimeout(function(){
                $('#tempValue').removeClass('success');
            }, 1000);

        }
        else{
            $('#tempValue').addClass('danger');
            setTimeout(function(){
                $('#tempValue').removeClass('danger');
            }, 1000);
        }

        if(newPressure > values[4].innerHTML){
            $('#presValue').addClass('success');

            setTimeout(function(){
                $('#presValue').removeClass('success');
            }, 1000);

        }
        else{
            $('#presValue').addClass('danger');
            setTimeout(function(){
                $('#presValue').removeClass('danger');
            }, 1000);
        }

        if(newHumidity > values[5].innerHTML){
            $('#humidValue').addClass('success');

            setTimeout(function(){
                $('#humidValue').removeClass('success');
            }, 1000);

        }
        else{
            $('#humidValue').addClass('danger');
            setTimeout(function(){
                $('#humidValue').removeClass('danger');
            }, 1000);
        }

        values[3].innerHTML = newTemp;
        values[4].innerHTML = newPressure;
        values[5].innerHTML = newHumidity;


    }, 2500);
}
