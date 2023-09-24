

document.getElementById('purpose').addEventListener('change', updateForm);
document.getElementById('getExcel').addEventListener('click', getCSV)
function updateForm(){
    if(document.getElementById('purpose').value === 'usersCollection'){
        document.getElementById('email').style.display = 'inline'
    }else{
        document.getElementById('email').style.display = 'none'
    }
}


function getCSV(){
    console.log()
    $.ajax({
        url:'/reports/getExcel',
        type:'GET',
        data:{
            purpose : document.getElementById('purpose').value,
            email:document.getElementById('email').value,
            start_date : document.getElementById('start_date').value,
            end_date : document.getElementById('end_date').value
        },
        success: function(data){}
    })
}