function checkFees(){
    $.ajax({
        url: '/fee/getMyFee',
        type:'GET',
        data:{
            AdmissionNo:document.getElementById('AdmissionNoFees').value,
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
    document.getElementById('fees-details').innerHTML=``;
    let feeItem = document.createElement('div');
        feeItem.innerHTML=
        `
            <div style="min-width: 15%;">
                <h6>Class</h6>
                
            </div>
            <div style="min-width: 15%;">
                <h6>Total</h6>
                
            </div>
            <div style="min-width: 15%;">
                <h6>Paid</h6>
                
            </div>
            <div style="min-width: 15%;">
                <h6>Remaining</h6>
                
            </div>
            <div style="min-width: 15%;">
                <h6 >Concession</h6>
            </div>

        `
        feeItem.classList.add('container');
        feeItem.classList.add('d-flex')
        document.getElementById('fees-details').appendChild(feeItem);
    
    for(let i=0;i<fees.length;i++){
        let feeItem = document.createElement('div');
        feeItem.innerHTML=
        `
            <div style="min-width: 15%;">
               
                <h4>${fees[i].Class}</h5>
            </div>
            <div style="min-width: 15%;">
                
                <h4>${fees[i].Total}</h5>
            </div>
            <div style="min-width: 15%;">
                
                <h4>${fees[i].Paid}</h5>
            </div>
            <div style="min-width: 15%;">
                
                <h4>${fees[i].Remaining}</h5>
            </div>
            <div style="min-width: 15%;">
                <h4>${fees[i].Consession}</h5>
            </div>
            <div style="min-width: 15%;">
                <button class='btn btn-success' onclick='addConsession(${fees[i].Class}, ${fees[i].AdmissionNo})'>Add Concession</button>
            </div>

        `
        feeItem.classList.add('container');
        feeItem.classList.add('d-flex')
        feeItem.classList.add('my-4')
        document.getElementById('fees-details').appendChild(feeItem);
    }
    
}

function addConsession(Class, AdmissionNo){
    let Concession = prompt("You are giving fee consession in class "+Class+" Please enter the amount");
    let Amount = +Concession;
    console.log(AdmissionNo);
    if(Amount && Amount != 'NaN'){
        console.log("Calling AJAX");
        $.ajax({
            type:'POST',
            data:{
                AdmissionNo:AdmissionNo,
                Class:Class,
                Amount:Concession
            },
            url:'/fee/getConsession'
        })
    }else{
        console.log("Invalid amount");
    }
    
}

function updateSubmissionForm(fees){
    console.log(fees);
    document.getElementById('fee-submit-form').innerHTML=
    `
        <form action="/fee/submit" class="d-flex justify-content-around flex-column container my-4" method="POST">
            <div style="min-width: 15%;">
                <h4>Fee Submission</h4>
            </div>
            <input hidden name="AdmissionNo" id="AdmissionNoForFeeSubmit">
            <div style="min-width: 15%;" class="my-4">
                <h6>Amount</h6>
                <input name="feeAmount"  type="number" placeholder="Enter amount here">
            </div>
            <div style="min-width: 15%;">
            <h6>Class</h6>
            <select required name="Class" id="ClassForFeeSubmit" style="width: 17%;">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>kg-1</option>
                <option>kg-2</option>
            </select>
        </div>
            <div style="width: 15%;">
                <input class="btn btn-success" type="submit" value="Pay">
            </div>
        </form>
    `
    document.getElementById('ClassForFeeSubmit').setAttribute('value',fees.Class)
    document.getElementById('AdmissionNoForFeeSubmit').setAttribute('value', fees[0].AdmissionNo)
}

document.getElementById('check-fees').addEventListener('click', checkFees)