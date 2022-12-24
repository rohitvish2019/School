function checkFees(){
    $.ajax({
        url: '/fee/getMyFee',
        type:'GET',
        data:{
            AdmissionNo:document.getElementById('AdmissionNoFees').value,
            Class: document.getElementById('ClassFees').value
        },
        success: function(data){showFees(data.data)},
        error: function(err){showNoFees()}
    })
}
function showNoFees(){
    console.log('no records');
    document.getElementById('fees-details').innerHTML=
    `
    <h4>No details available</h4>
    `
    document.getElementById('fee-submit-form').innerHTML=``
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
    document.getElementById('fee-submit-form').innerHTML=
    `
        <form action="/fee/submit" class="d-flex justify-content-around flex-column container my-4" method="POST">
            <div style="min-width: 15%;">
                <h4>Fee Submission</h4>
            </div>
            <input name="AdmissionNo" hidden id="AdmissionNoForFeeSubmit">
            <input name="Class" hidden id="ClassForFeeSubmit">
            <div style="min-width: 15%;" class="my-4">
                <h6>Amount</h6>
                <input name="feeAmount"  type="number" placeholder="Enter amount here">
            </div>
            <div style="width: 15%;">
                <input class="btn btn-success" type="submit" value="Pay">
            </div>
        </form>
    `
    document.getElementById('ClassForFeeSubmit').setAttribute('value',fees.Class)
    document.getElementById('AdmissionNoForFeeSubmit').setAttribute('value', fees.AdmissionNo)
}

document.getElementById('check-fees').addEventListener('click', checkFees)