let mybtn = document.getElementById('showStudentsList');
mybtn.addEventListener('click', getStudentsList)

// To get the students list classwise from server

function getStudentsList(){
    $.ajax({
        url:'/student/getStudentList',
        type:'GET',
        data:{
            Class: ClassForSearch.value
        },
        success: function(data){showStudentsList(data.data)},
        error: function(err){showNoRecord(err)}
    })
}

 // Show students list on UI 

function showStudentsList(data){
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
        let result = data[i];
        let item = document.createElement('a');
        item.innerHTML = 
        `
        <li class="container">
            <label for="">${result.AdmissionNo}</label>
            <label for="">${result.FirstName} ${result.LastName}</label>
            <label for="">${result.Class}</label>
            <label for="">${result.FathersName}</label>
            <label for="">${result.MothersName}</label>
        </li>
        `
        let href= '/student/get/'+result.AdmissionNo
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
    console.log(err);
}