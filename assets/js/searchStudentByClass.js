let mybtn = document.getElementById('ClassForSearch');
mybtn.addEventListener('change', getStudentsList)

// To get the students list classwise from server

function getStudentsList(){
    $.ajax({
        url:'/student/getStudentList',
        type:'GET',
        data:{
            Class: ClassForSearch.value,
            Action : action.value
        },
        success: function(data){showStudentsList(data.data.studentList, data.data.action)},
        error: function(err){showNoRecord(err)}
    })
}



function dischargeStudent(AdmissionNo){
    console.log(AdmissionNo);
    $.ajax({
        type:'POST',
        url:'/student/discharge/'+AdmissionNo,
        success:function(data){
            document.getElementById('terminated_'+AdmissionNo).remove();
            new Noty({
                theme: 'relax',
                text: 'Action Completed',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(err){
            console.log();
            console.error.bind(err);
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}

function admitStudent(registration){
    console.log('Admission approved for student at registration no '+registration);
    $.ajax({
        type:'post',
        url: '/registration/admit/'+registration,
        success: function(data){
            document.getElementById('item_'+registration).style.display='none';
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(data){
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}
function rejectStudent(registration){
    $.ajax({
        type:'delete',
        url:'/registration/delete/'+registration,
        success: function(data){
            document.getElementById('item_'+registration).style.display='none';
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
    console.log('student at registration no '+registration + 'is deleted')

}

function downloadForm(registration){
    $.ajax({
        type:'get',
        url:'/registration/download/'+registration,
        
    })
}

 // Show students list on UI 

function showStudentsList(data, action){
    if(data.length<=0){
        showNoRecord('No record found');
        return;
    }
    new Noty({
        theme: 'relax',
        text: 'Class details fetched',
        type: 'success',
        layout: 'topRight',
        timeout: 1500
    }).show(); 
    let id = action === 'admission'? 'Registration No' : 'Admission No'
    let listDiv = document.getElementById('classList')
    listDiv.innerHTML=``;
    listDiv.innerHTML=
    
    `
    <a class="btn student-list">
        <li style="background-color: #479b7e;color: #03420b; width: 100%;">
            <label><b>${id}</b></label>
            <label><b>Name</b></label>
            <label><b>Class</b></label>
            <label><b>Father's Name</b></label>
            <label><b>Mother's Name</b></label>
        </li>
    </a>
    `

    if(action ===  'admission'){
        listDiv.innerHTML=
    
        `
        <a class="student-list" >
            <li style="background-color: #479b7e;color: #03420b; width: 100%;">
                <label><b>${id}</b></label>
                <label><b>Name</b></label>
                <label><b>Class</b></label>
                <label><b>Father's Name</b></label>
                <label><b>Mother's Name</b></label>
                <label><b>Registered By</b></label>
                <label><b>Actions</b></label>
                
            </li>
        </a>
        `


        for(let i=0;i<data.length;i++){
            let student = data[i];
            let item = document.createElement('div');
            item.innerHTML=
            `
            <li class="container">
                <label for="">${student.RegistrationNo}</label>
                <label for="">${student.FirstName} ${student.LastName}</label>
                <label for="">${student.Class}</label>
                <label for="">${student.FathersName}</label>
                <label for="">${student.MothersName}</label>
                <label for="">${student.RegisteredBy}</label>
                <div class="dropdown" style='font-size:0.7rem'>
                    <a style='font-size:0.7rem' class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </a>
                    <ul style='font-size:0.7rem' class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a class="dropdown-item btn btn-success" id='approve_${student.RegistrationNo}' onclick='admitStudent(${student.RegistrationNo})'>Approve</a></li>
                        <li><a class="dropdown-item btn btn-danger" id='reject_${student.RegistrationNo}' onclick='rejectStudent(${student.RegistrationNo})'>Reject</a></li>
                        <li><a class="dropdown-item btn btn-primary" id='download_${student.RegistrationNo}' href='/registration/download/${student.RegistrationNo}'>Download</a></li>
                    </ul>
                    
                </div>
                <div >
                    
                </div>
                
            </li>
            `
            let id_1 = 'item_';
            item.classList.add('student-list');
            item.setAttribute('id','item_'+student.RegistrationNo)
            listDiv.appendChild(item);
        }
    }
    else if(action === 'none'){
        listDiv.innerHTML=
    
        `
        <a class="student-list" >
            <li style="background-color: #479b7e;color: #03420b; width: 100%;">
                <label><b>${id}</b></label>
                <label><b>Name</b></label>
                <label><b>Class</b></label>
                <label><b>Father's Name</b></label>
                <label><b>Mother's Name</b></label>
                <label><b>Actions</b></label>
                
            </li>
        </a>
        `


        for(let i=0;i<data.length;i++){
            let student = data[i];
            let item = document.createElement('div');
            item.innerHTML=
            `
            <li class="container" id='terminated_${student.AdmissionNo}'>
                <label for="">${student.AdmissionNo}</label>
                <label for="">${student.FirstName} ${student.LastName}</label>
                <label for="">${student.Class}</label>
                <label for="">${student.FathersName}</label>
                <label for="">${student.MothersName}</label>
                <a style="margin-bottom:1%" class="btn btn-danger" id='terminate_${student.AdmissionNo}' onclick='dischargeStudent(${student.AdmissionNo})'>Terminate</a>
                
                <div>
                    
                </div>
                
            </li>
            `
            let id_1 = 'item_';
            item.classList.add('student-list');
            item.setAttribute('id','item_'+student.AdmissionNo)
            listDiv.appendChild(item);
        }
    }
    else{
        for(let i=0;i<data.length;i++){
            let student = data[i];
            let item = document.createElement('a');
            item.innerHTML = 
            `
            <li class="container">
                <label for="">${student.AdmissionNo}</label>
                <label for="">${student.FirstName} ${student.LastName}</label>
                <label for="">${student.Class}</label>
                <label for="">${student.FathersName}</label>
                <label for="">${student.MothersName}</label>
            </li>
            `
            let href= '/student/get/'+student.AdmissionNo+'?Class='+student.Class+'&action='+action
            item.setAttribute('href', href);
            item.classList.add('btn');
            item.classList.add('btn-light');
            item.classList.add('student-list');
             
            listDiv.appendChild(item);
        }
    }
    
    console.log(data);
}

// Invoke when no/error response received from getStudentsList

function showNoRecord(err){
    let listDiv = document.getElementById('classList')
    listDiv.innerHTML=``
    new Noty({
        theme: 'relax',
        text: err,
        type: 'error',
        layout: 'topRight',
        timeout: 1500
    }).show(); 
    console.log(err);
}