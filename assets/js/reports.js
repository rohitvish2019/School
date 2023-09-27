let Email = document.getElementById('email')
let EmailLabel = document.getElementById('email-label')
if(Email){
    document.getElementById('email').style.display = 'none'
}

if(EmailLabel){
    document.getElementById('email-label').style.display = 'none'
}


document.getElementById('purpose').addEventListener('change', updateForm);
document.getElementById('getExcel').addEventListener('click', getCSV)
function updateForm(){
    if(document.getElementById('purpose').value === 'usersCollection'){
        document.getElementById('email').style.display = 'inline'
        document.getElementById('email-label').style.display = 'inline'
    }else{
        document.getElementById('email').style.display = 'none'
        document.getElementById('email-label').style.display = 'none'
    }
}


function getCSV(){
    const startDateSplitted = startDateInput.value.split('-');
    let startDate = startDateSplitted[1]+'-'+startDateSplitted[0]+'-'+startDateSplitted[2]
    const endDateSplitted = endDateInput.value.split('-');
    let endDate = endDateSplitted[1]+'-'+endDateSplitted[0]+'-'+endDateSplitted[2]
    console.log()
    $.ajax({
        url:'/reports/getExcel',
        type:'GET',
        data:{
            purpose : document.getElementById('purpose').value,
            email:document.getElementById('email').value,
            start_date : startDate,
            end_date : endDate
        },
        success: function(data){
            window.location.href = '/reports/'+data.filename+'.xlsx'
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}


const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
startDateInput.addEventListener('input', addHyphens);
endDateInput.addEventListener('input', addHyphens);

function addHyphens(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 0) {
        if (value.length > 4) {
            value = value.slice(0, 2) + '-' + value.slice(2, 4) + '-' + value.slice(4, 10); // Insert hyphens
        } else if (value.length > 2) {
            value = value.slice(0, 2) + '-' + value.slice(2, 4) + '-' + value.slice(4, 8); // Insert hyphens
        }
    }
    input.value = value;
}


function filterTransactions() {
    const startDateSplitted = startDateInput.value.split('-');
    let startDate = startDateSplitted[1]+'-'+startDateSplitted[0]+'-'+startDateSplitted[2]
    const endDateSplitted = endDateInput.value.split('-');
    let endDate = endDateSplitted[1]+'-'+endDateSplitted[0]+'-'+endDateSplitted[2]
    $.ajax({
        url:'/reports/allReports',
        type:'GET',
        data:{
            start_date: startDate,
            end_date: endDate,
            purpose:  document.getElementById('purpose').value
        },
        success:function(data){

            if(data.purpose === 'feesReport'){
                showFessTransactions(data.response)
            }else if(data.purpose === 'admittedStudents'){
                showAdmittedStudents(data.response);
            }else if(data.purpose === 'usersCollection'){

            }else if(data.purpose === 'currentActiveStudents'){
                showActiveStudents(data.response)
            }
        },
        error:function(err){console.log(err.responseText)}

    })
}

function showFessTransactions(data, purpose){
    
    let total = 0;
    
    let tbody = document.getElementById('table-body');
    let thead = document.createElement('tr');
    thead.innerHTML=
    `
        <th>Admission No</th>
        <th>Class</th>
        <th>Amount</th>
        <th>Payment Date</th>
        <th>Paid to</th>
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    for(let i=0;i<data.length;i++){
        let row = document.createElement('tr');
        row.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>Class ${data[i].Class}</td>
            <td>₹${data[i].Amount}</td>
            <td>${data[i].Payment_Date}</td>
            <td>${data[i].PaidTo}</td>
        `
        tbody.appendChild(row);
        total += data[i].Amount
    }
    document.getElementById('total').innerText= '₹'+total
}



function showAdmittedStudents(data){
    
    let tbody = document.getElementById('table-body');
    tbody.style.fontSize='0.8rem';
    let thead = document.createElement('tr');
    thead.innerHTML=
    `
        <th>Admission No</th>
        <th>Class</th>
        <th>Admission Date</th>
        <th>Name</th>
        <th>Father's Name</th>
        <th>Mother's Name</th>
        <th>SSSM ID</th>
        <th>AadharNumber</th>
        <th>DOB</th>
        <th>Caste</th>
        <th>Category</th>
        <th>Religion</th>
        <th>Gender</th>
        
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    for(let i=0;i<data.length;i++){
        let row = document.createElement('tr');
        row.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>Class ${data[i].Class}</td>
            <td>${data[i].FirstName} ${data.LastName}</td>
            <td>${data[i].FathersName}</td>
            <td>${data[i].MothersName}</td>
            <td>${data[i].SSSM}</td>
            <td>${data[i].AadharNumber}</td>
            <td>${data[i].DOB}</td>
            <td>${data[i].Caste}</td>
            <td>${data[i].Category}</td>
            <td>${data[i].Religion}</td>
            <td>${data[i].Gender}</td>
        `
        tbody.appendChild(row);
        total += data[i].Amount
    }
}
function showFeesByUser(){}
function showActiveStudents(data){
    let tbody = document.getElementById('table-body');
    tbody.style.fontSize='0.8rem';
    let thead = document.createElement('tr');
    thead.innerHTML=
    `
        <th>Admission No</th>
        <th>Class</th>
        <th>Admission Date</th>
        <th>Name</th>
        <th>Father's Name</th>
        <th>Mother's Name</th>
        <th>SSSM ID</th>
        <th>AadharNumber</th>
        <th>DOB</th>
        <th>Caste</th>
        <th>Category</th>
        <th>Religion</th>
        <th>Gender</th>
        
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    for(let i=0;i<data.length;i++){
        let row = document.createElement('tr');
        row.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>Class ${data[i].Class}</td>
            <td>${data[i].FirstName} ${data.LastName}</td>
            <td>${data[i].FathersName}</td>
            <td>${data[i].MothersName}</td>
            <td>${data[i].SSSM}</td>
            <td>${data[i].AadharNumber}</td>
            <td>${data[i].DOB}</td>
            <td>${data[i].Caste}</td>
            <td>${data[i].Category}</td>
            <td>${data[i].Religion}</td>
            <td>${data[i].Gender}</td>
        `
        tbody.appendChild(row);
        total += data[i].Amount
    }
}
function isDateInRange(dateString, startDate, endDate) {
    const dateParts = dateString.split('-');
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    return date >= new Date(startDate) && date <= new Date(endDate);
}