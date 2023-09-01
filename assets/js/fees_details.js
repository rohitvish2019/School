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
    new Noty({
        theme: 'relax',
        text: 'No fees details found for the student in selected class',
        type: 'success',
        layout: 'topRight',
        timeout: 1500
    }).show(); 
    console.log('no records');
    document.getElementById('fees-details').innerHTML=
    `
    <h4>No details available</h4>
    `
    document.getElementById('fee-submit-form').innerHTML=``
}


function closePopup(){
    document.getElementById('popup').style.display='none';
    classes = document.getElementsByClassName('class_option');
    for(let i=0;i<classes.length;i++){
        classes[i].removeAttribute('selected');
    }
    console.log(classes[0]);
    
}

function openPopup(data){
    console.log(data)
    document.getElementById('popup').style.display='block';
    let details = data.split('_');
    console.log(details);
    document.getElementById(details[0]).setAttribute('selected','true')
    //document.getElementById('fee-form').setAttribute('action','/fee/'+details[2])
    let action = '';
    if(details[2] === 'submit'){
        action = 'Fee'
    }else{
        action = 'Concession'
    }
    document.getElementById('purpose').setAttribute('value',action)
    
}

function getSelected(){

}

function submitFeeOrConcession(){
    let AdmissionNo = document.getElementById('AdmissionNo_fee').value;
    let Class = document.getElementById('Class_fee').value;
    let Date = document.getElementById('date_fee').value;
    let Amount = document.getElementById('Amount_fee').value;
    let purpose = document.getElementById('purpose').value
    let Comment = document.getElementById('comment_fee').value;
    $.ajax({
        url:'/fee/'+purpose,
        type:'post',
        data:{
            AdmissionNo,
            Class,
            Date,
            Amount,
            Comment
        },
        success:function(data){
            closePopup();
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            setTimeout(function(){
                window.location.href='/student/get/'+AdmissionNo+'?Class='+Class+'&action=fee'
            },1000)
            
        },
        error: function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            setTimeout(function(){
                window.location.href='/student/get/'+AdmissionNo+'?Class='+Class+'&action=fee'
            },1000)
        }
    })
}

function toggeller(){
    
}

function getConcessionHistory(){
    let AdmissionNo = document.getElementById('AdmissionNo_fee').value;
    $.ajax({
        type:'get',
        url:'/fee/getConcessionHistory/'+AdmissionNo,
        success: function(data){
            showConcessionHistory(data.data)
        }
    })
}


function showConcessionHistory(data){
    console.log(data);
    if(data.length <= 0){
        return;
    }
    let container = document.getElementById('concession-history-dynamic-container');
    console.log(container);
    container.innerHTML=``;

    let headerItem = document.createElement('tr');
    headerItem.innerHTML=
    `
        <th>AdmissionNo</th>
        <th>Class</th>
        <th>Amount</th>
        <th>Concession Date</th>
        <th>Comment</th>
    `
    headerItem.style.width='100%'
    container.appendChild(headerItem);
         
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>${data[i].Class}</td>
            <td>${data[i].Amount}</td>
            <td>${data[i].Payment_Date}</td>
            <td>${data[i].Comment}</td>
        `
        container.appendChild(item);
    }
}


function getFeesHistory(){
    let AdmissionNo = document.getElementById('AdmissionNo_fee').value;
    $.ajax({
        type:'get',
        url:'/fee/getHistory/'+AdmissionNo,
        success: function(data){
            showFeesHistory(data.data)
        }
    })
}

function showFeesHistory(data){
    if(data.length <= 0){
        return;
    }
    let container = document.getElementById('fee-history-dynamic-container');
    container.innerHTML=``;
    let headerItem = document.createElement('tr');
    headerItem.innerHTML=
    `
        <th>AdmissionNo</th>
        <th>Class</th>
        <th>Amount</th>
        <th>Payment Date</th>
        <th>Comment</th>
        <th>Receipt</th>
        <th>Cancel</th>
    `
    headerItem.style.width='100%'
    container.appendChild(headerItem);
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>${data[i].Class}</td>
            <td>${data[i].Amount}</td>
            <td>${data[i].Payment_Date}</td>
            <td>${data[i].Comment}</td>
            <td><a href='/fee/receipt/${data[i]._id}'>Receipt</a></td>
            <td><a href='/fee/cancel/${data[i]._id}'>Cancel</a></td>
        `
        container.appendChild(item);
    }
}


function openPaymentHistory(){
    let feeHistory = document.getElementById('fee-history');
    let feeDetails = document.getElementById('fee-details');
    let concessionHistory = document.getElementById('concession-history');

    document.getElementById('details-button').style.backgroundColor='transparent';
    document.getElementById('history-button-pay').style.backgroundColor='#198754';
    document.getElementById('history-button-con').style.backgroundColor='transparent';

    feeDetails.style.display='none';
    concessionHistory.style.display='none';
    feeHistory.style.display='block'

    getFeesHistory();

}

function openConcessionHistory(){
    let feeHistory = document.getElementById('fee-history');
    let feeDetails = document.getElementById('fee-details');
    let concessionHistory = document.getElementById('concession-history');

    document.getElementById('details-button').style.backgroundColor='transparent';
    document.getElementById('history-button-pay').style.backgroundColor='transparent';
    document.getElementById('history-button-con').style.backgroundColor='#198754';

    feeDetails.style.display='none';
    concessionHistory.style.display='block';
    feeHistory.style.display='none'
    getConcessionHistory();
}

function openFeeDetails(){
    let feeHistory = document.getElementById('fee-history');
    let feeDetails = document.getElementById('fee-details');
    let concessionHistory = document.getElementById('concession-history');

    document.getElementById('details-button').style.backgroundColor='#198754';
    document.getElementById('history-button-pay').style.backgroundColor='transparent';
    document.getElementById('history-button-con').style.backgroundColor='transparent';

    feeDetails.style.display='block';
    concessionHistory.style.display='none';
    feeHistory.style.display='none'
}

document.getElementById('details-button').addEventListener('click', openFeeDetails);
document.getElementById('history-button-pay').addEventListener('click', openPaymentHistory);
document.getElementById('history-button-con').addEventListener('click', openConcessionHistory);


//Check fees button listener
let check_fees_button = document.getElementById('check-fees');
let cross = document.getElementById('cross');
if(check_fees_button){
    check_fees_button.addEventListener('click', checkFees);
}
if(cross){
    cross.addEventListener('click', closePopup)
}


