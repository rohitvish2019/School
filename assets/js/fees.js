// To get fees data from sever of a student
function checkFees(){
    let adm = document.getElementById('AdmissionNoFees').value;
    $.ajax({
        url: '/fee/getMyFee',
        type:'GET',
        data:{
            AdmissionNo:adm,
        },
        success: function(data){showFees(data.data)},
        error: function(err){showNoFees()}
    });
    getFeeHistory(adm)
}

// Invoke this function in case of no/error response received from checkFees to show no fees found

function showNoFees(){
    console.log('no records');
    document.getElementById('fees-details').innerHTML=
    `
    <h4>No details available</h4>
    `
    document.getElementById('fee-submit-form').innerHTML=``
}

// Add fees details on UI

function showFees(fees){
    updateSubmissionForm(fees);
    // Adding heading for fee details
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
    // Addng classwise list of fees details

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
                <h4>${fees[i].Concession}</h5>
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

// Add the concession provided for the student

function addConsession(Class, AdmissionNo){
    let Concession = prompt("You are giving fee consession in class "+Class+" Please enter the amount");
    let Amount = +Concession;
    console.log(AdmissionNo);
    if(Amount && Amount != 'NaN'){
        $.ajax({
            type:'POST',
            data:{
                AdmissionNo:AdmissionNo,
                Class:Class,
                Amount:Concession
            },
            url:'/fee/getConsession',
            success: function(data){
                window.location.href='/fee/getFee/'+data.data
                
            }
        })
    }else{
        console.log("Invalid amount");
    }
    
}

// To render the UI of pay fees form

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
            <div style="min-width: 15%;" class="my-4">
                <h6>Paid on</h6>
                <input name="date" type="date" >
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

// Get the paid fees histor of a student from server

function getFeeHistory(AdmissionNo){
    $.ajax({
        url:'/fee/history/'+AdmissionNo,
        type:'GET',
        success: function(data){showFeeHistory(data.data)},
        error: function(err){console.error.bind(err)}
    })
}

// Show fees history of student on UI

function showFeeHistory(data){
    
    document.getElementById('header').innerHTML=
    `
    <b>Fee History</b>
    `
    let container = document.getElementById('fee-history-container');
    container.innerHTML=``;
    let element = document.createElement('div');
    element.innerHTML=
    `
        <label><b>Class</b></label>
        <label><b>Amount</b></label>
        <label><b>Payment Date</b></label>
    `
    element.classList.add('d-flex');
    element.classList.add('justify-content-between');
    container.appendChild(element);
    for(let i=0;i<data.length;i++){
        let element = document.createElement('div');
        element.innerHTML=
        `
            <label><b>${data[i].Class}</b></label>
            <label><b>${data[i].Amount}</b></label>
            <label><b>${data[i].Payment_Date}</b></label>
        `
        element.classList.add('d-flex');
        element.classList.add('justify-content-between');
        container.appendChild(element);
    }
    console.log(data);
}

//Check fees button listener

document.getElementById('check-fees').addEventListener('click', checkFees)