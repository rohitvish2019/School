function getClassList(){
    $.ajax({
        url:'/student/getStudentList',
        type:'GET',
        data:{
            Class: ClassForSearch.value
        },
        success: function(data){showStudentsList(data.data.studentList)},
        error: function(err){showNoRecord(err)}
    })
}

function upgradeClassList(){
    $.ajax({
        url:'/student/upgradeClassBulk',
        type:'POST',
        data:{
            studentList:studentListToUpgrade,
            Class:classToUpgrade
        },
        success: function(data){
            console.log(data);
            new Noty({
                theme: 'relax',
                text: 'Marked students will be upgraded to next class',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(err){console.error.bind(err)}
    })
    //console.log(class_of_students);
}
let studentListToUpgrade=[];
let classToUpgrade='';
function toggleCheck(id){
    
    for(let i=0;i<studentListToUpgrade.length;i++){
        if(studentListToUpgrade[i] == id){
            studentListToUpgrade.pop(id);
            return;
        }
    }
    studentListToUpgrade.push(id);
    
}

function showStudentsList(data){
    console.log(data);
    if(data.length <= 0){
        showNoRecord('No record found')
        return;
    }
    new Noty({
        theme: 'relax',
        text: 'Class details fetched',
        type: 'success',
        layout: 'topRight',
        timeout: 1500
    }).show();
    if(data[0]){
        classToUpgrade=data[0].Class;
    }
    
    let listDiv = document.getElementById('classList')
    listDiv.innerHTML=
    
    `
    <a class="btn student-list">
        <li style="background-color: #479b7e;color: #03420b; width: 100%;">
            <label style="margin-left: 3%;"><b>Student ID</b></label>
            <label><b>Name</b></label>
            <label><b>Class</b></label>
            <label><b>Father's Name</b></label>
            <label><b>Mother's Name</b></label>
            <label><b>Last Result</b></label>
            <label><b>Action</b></label>
        </li>
    </a>
    `
    for(let i=0;i<data.length;i++){
        let student = data[i];
        let item = document.createElement('a');
        item.innerHTML = 
        `
        <li class="container">
            <input type=checkbox id=${student.AdmissionNo}_checkbox onchange='toggleCheck(${student.AdmissionNo})'>
            <label for="">${student.AdmissionNo}</label>
            <label for="">${student.FirstName} ${student.LastName}</label>
            <label for="">${student.Class}</label>
            <label for="">${student.FathersName}</label>
            <label for="">${student.MothersName}</label>
            <label for="">${student.LastClassGrade}</label>
            <a href='upgrade/${student.AdmissionNo}?Class=${student.Class}' class='btn btn-success'>Upgrade</a>
        </li>        
        `
        
        item.classList.add('btn');
        item.classList.add('btn-light');
        item.classList.add('student-list');
         
        listDiv.appendChild(item);
    }
    let controls = document.createElement('div');
    controls.innerHTML=
    `
        <button class='btn btn-success' id='upgradeClassList' onclick=upgradeClassList() >Upgrade selected</button>
        <button class='btn btn-success'>De-select</button>
    `
    listDiv.appendChild(controls);
    console.log(data);
}

// Invoke when no/error response received from getStudentsList

function showNoRecord(err){
    let listDiv = document.getElementById('classList')
    listDiv.innerHTML=``;
    new Noty({
        theme: 'relax',
        text: err,
        type: 'Warning',
        layout: 'topRight',
        timeout: 1500
    }).show();
    console.log(err);
}
document.getElementById('getClassBtn').addEventListener('click', getClassList);
//document.getElementById('upgradeClassList').addEventListener();