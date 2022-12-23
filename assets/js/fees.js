function checkFees(){
    $.ajax({
        url: '/fee/getMyFee',
        type:'GET',
        data:{
            AdmissionNo:document.getElementById('AdmissionNoFees').value,
            Class: document.getElementById('ClassFees').value
        },
        success: function(data){showFees(data.data[0])}
    })
}

function showFees(fees){
    updateSubmissionForm(fees);
    document.getElementById('fees-details').innerHTML=
    `
    <div style="min-width: 15%;">
        <h6>Total</h6>
        <h4>${fees.Total}</h5>
    </div>
    <div style="min-width: 15%;">
        <h6>Paid</h6>
        <h4>${fees.Paid}</h5>
    </div>
    <div style="min-width: 15%;">
        <h6>Remaining</h6>
        <h4>${fees.Remaining}</h5>
    </div>
    `
}

function updateSubmissionForm(fees){
    document.getElementById('ClassForFeeSubmit').setAttribute('value',fees.Class)
    document.getElementById('AdmissionNoForFeeSubmit').setAttribute('value', fees.AdmissionNo)
}

document.getElementById('check-fees').addEventListener('click', checkFees)