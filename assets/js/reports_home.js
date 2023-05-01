function search_class(){
    let Admission_year = document.getElementById('Admission_year').value;
    let class_of_student = document.getElementById('class_of_student').value;
    $.ajax({
        type: 'Get',
        url: '/reports/classList/get?Class='+class_of_student+'&Admission_year='+Admission_year,
        success: function(data){
            showClassList(data.data)
        },
        error: function(err){
            console.error.bind(err);
        }
    })
}


function showClassList(data){
    if(data.length <= 0){
        showEmptyList();
        return;
    }
    let container = document.getElementById('list-container');
    container.innerHTML=``;
    let header = document.createElement('div');
    header.innerHTML=
    `
    <div class="list-header">
        <h6>Admission No</h6> 
        <h6>Student Name</h6>
        <h6>Father's Name</h6>
        <h6>Mother's Name</h6>
        <h6>Aadhar</h6>
        <h6 style="width: 9.8%;">Actions</h6>
    </div>
    `
    container.appendChild(header);
    for(let i=0;i<data.length;i++){
        let record = document.createElement('div');
        record.innerHTML=
        `
        <label class='record-item'>${data[i].AdmissionNo}</label>
        <label class='record-item'>${data[i].FirstName} ${data[i].LastName}</label>
        <label class='record-item'>${data[i].Fathersname}</label>
        <label class='record-item'>${data[i].MothersName}</label>
        <label class='record-item'>${data[i].Aadhar}</label>
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Actions
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/student/get/${data[i].AdmissionNo}?Class=${data[i].Class}&action=result">Marksheet</a></li>
            <li><a class="dropdown-item" href="#">TC</a></li>
            <li><a class="dropdown-item" href="/student/get/${data[i].AdmissionNo}?Class=${data[i].Class}&action=fee">Fees</a></li>
        </ul>
        </div>
        
        `;
        record.classList.add('list-header')
        container.appendChild(record);

    }
}


function showEmptyList(){

}

document.getElementById('search_report').addEventListener('click', search_class);