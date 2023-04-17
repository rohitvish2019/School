let mybtn = document.getElementById('showStudentsList');
mybtn.addEventListener('click', getStudentsList)

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
    
    let listDiv = document.getElementById('classList')
    listDiv.innerHTML=
    
    `
    <a class="btn student-list">
        <li style="background-color: #479b7e;color: #03420b; width: 100%;">
            <label><b>Student ID</b></label>
            <label><b>Name</b></label>
            <label><b>Class</b></label>
            <label><b>Father's Name</b></label>
            <label><b>Mother's Name</b></label>
        </li>
    </a>
    `
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