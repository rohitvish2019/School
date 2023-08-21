document.addEventListener('click', runListener);

function runListener(event){
    let actionClass= event.target.id
    console.log('ID is '+actionClass)
    if(actionClass.match(/updateFee.*/)){
        console.log(actionClass.slice(10))
        $.ajax({
            type: 'POST',
            url: '/fee/updateFee',
            data:{
                Class : actionClass.slice(10),
                Fees : document.getElementById('feesInput_'+actionClass.slice(10)).value
            },
            success: function(data){
                console.log('Fees updates')
                window.location.href='/fee/updateFeeForm'
            },
            error: function(err){
                console.error.bind(err);
            }
        })
    }
    else if(actionClass.match(/editFee.*/)){
        document.getElementById('updateFee_'+actionClass.slice(8)).removeAttribute('hidden');
        console.log('feesInput_'+actionClass.slice(8))
        document.getElementById('feesInput_'+actionClass.slice(8)).removeAttribute('readonly');
        document.getElementById('feesInput_'+actionClass.slice(8)).style.border='1px solid black';
        document.getElementById(actionClass).setAttribute('hidden','true')
    }
    else{
        console.log('wrong target')
    }
}