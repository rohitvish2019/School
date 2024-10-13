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
    let element = document.getElementById('purpose');
    if(element.value === 'usersCollection'){
        document.getElementById('email').style.display = 'inline'
        document.getElementById('email-label').style.display = 'inline'
    }else if(element.value === 'feesReport' || element.value === 'admittedStudents' || element.value === 'usersCollection'){
        document.getElementById('start-date').style.display = 'inline'
        document.getElementById('end-date').style.display = 'inline'
        document.getElementById('start-date-label').style.display = 'inline'
        document.getElementById('end-date-label').style.display = 'inline'
        document.getElementById('email').style.display = 'none'
        document.getElementById('email-label').style.display = 'none'
    }else if(element.value == 'currentActiveStudents' || element.value == 'feesDuesClass' || element.value == 'feesDuesTotal' || element.value === 'incompleteResult'|| element.value=='studentsListByClass'){
        document.getElementById('start-date').style.display = 'none'
        document.getElementById('end-date').style.display = 'none'
        document.getElementById('start-date-label').style.display = 'none'
        document.getElementById('end-date-label').style.display = 'none'
        document.getElementById('email').style.display = 'none'
        document.getElementById('email-label').style.display = 'none'
    }
    
    else{
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
            end_date : endDate,
            Class : document.getElementById('classForFilter').value
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
    document.getElementById('loader').style.display='block'
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
            purpose:  document.getElementById('purpose').value,
            Class : document.getElementById('classForFilter').value
        },
        success:function(data){

            if(data.purpose === 'feesReport'){
                showFessTransactions(data.response)
            }else if(data.purpose === 'admittedStudents'){
                showAdmittedStudents(data.response);
            }else if(data.purpose === 'usersCollection'){

            }else if(data.purpose === 'currentActiveStudents'){
                showActiveStudents(data.response)
            }else if(data.purpose=='studentsListByClass'){
                showStudentsByClass(data.response)
            }
            else if(data.purpose === 'feesDuesTotal'){
                showFeesDues(data.response);
            }
            else if(data.purpose === 'incompleteResult'){
                console.log(data.response);
                showIncompleteResult(data.response, data.classList);
            }
            else if(data.purpose === 'feesDuesClass'){
                showFeesDuesByClass(data.response, data.students);
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
            <td>${data[i].Payment_Date.slice(0,10)}</td>
            <td>${data[i].PaidTo}</td>
        `
        tbody.appendChild(row);
        total += data[i].Amount
    }
    document.getElementById('count').innerText='Total Fees Received :'
    document.getElementById('total').innerText= '₹'+total
    document.getElementById('loader').style.display='none'
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
            <td>${data[i].AdmissionDate}</td>
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
    }
    document.getElementById('count').innerText='Count :'
    document.getElementById('total').innerText= data.length
    document.getElementById('loader').style.display='none'
}
function showFeesByUser(){}
function showFeesDuesByClass(data, students){
    let counter = 0
    let total = 0
    let i,j
    let tbody = document.getElementById('table-body');
    tbody.style.fontSize='0.8rem';
    let thead = document.createElement('tr');
    thead.innerHTML=
    `   <th>S.no</th>
        <th>Admission No</th>
        <th>Name</th>
        <th>Class</th>
        <th>Total Fees</th>
        <th>Old Fees</th>
        <th>Current Fees</th>
        <th>Paid</th>
        <th>Concession</th>
        <th>Remaining</th>       
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    let lastAdmissionNo='0000000000000';
    let currentTotal=0;
    let currentPaid=0
    let currentRemaining=0
    let currentConcession=0;
    for(i=0;i<data.length;i++){
        for(j=0;j<students.length;j++){
            //console.log(data[i].AdmissionNo +"===="+ students[j].AdmissionNo)
            if(data[i].AdmissionNo == students[j].AdmissionNo){
                console.log(data[i].AdmissionNo + " "+ students[j].FirstName);
                if(i+1 == data.length){
                    if(data[i].AdmissionNo == data[i-1].AdmissionNo){
                        continue
                    }else{
                        let row = document.createElement('tr');
                        row.innerHTML=
                        `  
                            <td>${counter+1}</td>
                            <td>${data[i].AdmissionNo}</td>
                            <td>${students[j].FirstName} ${students[j].LastName}</td>
                            <td>${data[i].Class}</td>
                            <td>${data[i].Total}</td>
                            <td>0</td>
                            <td>${data[i].Total}</td>
                            <td>${data[i].Paid}</td>
                            <td>${data[i].Concession}</td>
                            <td>${data[i].Remaining}</td>
                        `
                        tbody.appendChild(row);
                        total = total + Number(data[i].Remaining) 
                        counter++
                        break
                    }                

                }else{
                    if(data[i].AdmissionNo == data[i+1].AdmissionNo){
                        currentTotal = currentTotal + data[i].Total,
                        currentConcession = currentConcession + data[i].Concession
                        currentRemaining = currentRemaining + data[i].Remaining,
                        currentPaid = currentPaid + data[i].Paid
                    
                    }else{
                        let row = document.createElement('tr');
                        let thisRowConcession = data[i].Concession + currentConcession;
                        row.innerHTML=
                        `  
                            <td>${counter+1}</td>
                            <td>${data[i].AdmissionNo}</td>
                            <td>${students[j].FirstName} ${students[j].LastName}</td>
                            <td>${data[i].Class}</td>
                            <td>${data[i].Total + currentTotal}</td>
                            <td>${currentTotal}</td>
                            <td>${data[i].Total}</td>
                            <td>${data[i].Paid + currentPaid}</td>
                            <td>${thisRowConcession}</td>
                            <td>${data[i].Remaining + currentRemaining}</td>
                        `
                        tbody.appendChild(row);
                        total = total + Number(data[i].Remaining) 
                        counter++
                        currentTotal=0
                        currentConcession=0
                        currentPaid=0
                        currentRemaining=0
                        break
                    }
                }
                
                
            }
            if(counter >= data.length){
                console.log("Breaking :" +i +"   "+j )
                break
            }
        }
        if(counter >= data.length){
            console.log("Breaking :" +i +"   "+j )
            break
        }
    }
    
    for(let i=0;i<data.length;i++){
        
    }
    document.getElementById('count').innerText='Total Dues :'
    document.getElementById('total').innerText= total
    document.getElementById('loader').style.display='none'
}
function showActiveStudents(data){
    let columnsData = document.getElementsByClassName('columns');
    let columns = new Array();
    columns.push('S.no')
    for(let i=0;i<columnsData.length;i++){
        if(columnsData[i].checked == true){
            columns.push(columnsData[i].value)
        }
    }
    let tbody = document.getElementById('table-body');
    tbody.style.fontSize='0.8rem';
    let thead = document.createElement('tr');
    
    for(let i=0;i<columns.length;i++){
        let tdata = document.createElement('th');
        tdata.innerHTML=columns[i]
        thead.appendChild(tdata)
    }
    /*
    thead.innerHTML=
    `   
        <th>S.No</th>
        <th>AdmissionNo</th>
        <th>Class</th>
        <th>AdmissionDate</th>
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
    */
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;
    for(let i=0;i<data.length;i++){
        let row = document.createElement('tr');
        for(let j=0;j<columns.length;j++){
            let rowData = document.createElement('td');
            if(j == 0){
                rowData.innerHTML=i+1
            }else{
                rowData.innerHTML=data[i][columns[j]];
            }
            
            row.appendChild(rowData)
        }
        if((data[i].Gender).toUpperCase() == 'MALE'){
            maleCount++
        }else if((data[i].Gender).toUpperCase() == 'FEMALE'){
            femaleCount++
        }else{
            otherCount++
        }
        
        tbody.appendChild(row);
        total += data[i].Amount
    }
    console.log("Count is "+maleCount+"    "+femaleCount);
    document.getElementById('maleCount').innerText='Male : '+maleCount
    document.getElementById('femaleCount').innerText='Female : '+femaleCount
    document.getElementById('othersCount').innerText='Others : '+otherCount
    document.getElementById('genderCount').style.display='block'
    document.getElementById('count').innerText='Count :'
    document.getElementById('total').innerText= data.length
    document.getElementById('loader').style.display='none'
}

function showFeesDues(data){
    let total = 0;
    
    let tbody = document.getElementById('table-body');
    let thead = document.createElement('tr');
    thead.innerHTML=
    `
        <th>Admission No</th>
        <th>Class</th>
        <th>Total</th>
        <th>Remaining</th>
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    for(let i=0;i<data.length;i++){
        let row = document.createElement('tr');
        row.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>Class ${data[i].Class}</td>
            <td>₹${data[i].Total}</td>
            <td>${data[i].Remaining}</td>
            
        `
        tbody.appendChild(row);
        total += data[i].Remaining
    }
    document.getElementById('count').innerText='Due Fees :'
    document.getElementById('total').innerText= '₹'+total
    document.getElementById('loader').style.display='none'
}


function showIncompleteResult(data, classList){
    let dict = {};
    let total = 0
    for(let i=0;i<data.length;i++){
        if(dict[data[i].Class] && dict[data[i].Class] >= 1){
            dict[data[i].Class] = dict[data[i].Class] + 1;
        }else{
            dict[data[i].Class] = 1;
        }
    }
    let tbody = document.getElementById('table-body');
    let thead = document.createElement('tr');
    thead.innerHTML=
    `
        <th>Class</th>
        <th>Pending</th>
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead);
    for(let key in dict) {
        console.log(key + " : " + dict[key]);
        let row = document.createElement('tr');
        row.innerHTML=
        `
            <td>Class ${key}</td>
            <td>${dict[key]}</td>
            
        `
        tbody.appendChild(row);
        total += dict[key]
     }
    document.getElementById('count').innerText='Pending Results :'
    document.getElementById('total').innerText=total
    document.getElementById('loader').style.display='none'
    
}
function isDateInRange(dateString, startDate, endDate) {
    const dateParts = dateString.split('-');
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    return date >= new Date(startDate) && date <= new Date(endDate);
}


function showStudentsByClass(data){
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;
    
    let tbody = document.getElementById('table-body');
    tbody.style.fontSize='0.8rem';
    let thead = document.createElement('tr');
    thead.innerHTML=
    `   <th>S.No</th>
        <th>Admission No</th>
        <th>Name</th>
        <th>Father's Name</th>
        <th>Mother's Name</th>
        <th>Date Of Birth</th>
        <th>Aadhar</th>
        <th>Samagra</th>
        <th>Contact No</th>
        <th>Account No</th>
        <th>IFSC</th>
        
    `
    tbody.innerHTML=``;
    tbody.appendChild(thead)
    for(let i=0;i<data.length;i++){
        if((data[i].Gender).toUpperCase() == 'MALE'){
            maleCount++
        }else if((data[i].Gender).toUpperCase() == 'FEMALE'){
            femaleCount++
        }else{
            otherCount++
        }
        let row = document.createElement('tr');
        let dob = data[i].DOB.split('-')
        row.innerHTML=
        `   <td style='width:2%'>${i+1}</td>
            <td style='width:3%'>${data[i].AdmissionNo}</td>
            <td style='width:10%'>${data[i].FirstName} ${data[i].LastName}</td>
            <td style='width:8%'>${data[i].FathersName}</td>
            <td style='width:8%'>${data[i].MothersName}</td>
            <td style='width:11% !important'>${dob[2]}-${dob[1]}-${dob[0]}</td>
            <td style='width:11%'>${data[i].AadharNumber}</td>
            <td style='width:8%'>${data[i].SSSM}</td>
            <td style='width:9%'>${data[i].Mob}</td>
            <td style='width:18%'>${data[i].AccountNo}</td>
            <td style='width:8%'>${data[i].IFSC}</td>
        `
        tbody.appendChild(row);
        total += data[i].Amount
    }
    console.log("Count is "+maleCount+"    "+femaleCount);
    document.getElementById('maleCount').innerText='Male : '+maleCount
    document.getElementById('femaleCount').innerText='Female : '+femaleCount
    document.getElementById('othersCount').innerText='Others : '+otherCount
    document.getElementById('genderCount').style.display='block'
    document.getElementById('count').innerText='Count :'
    document.getElementById('total').innerText= data.length
    document.getElementById('loader').style.display='none'
}