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


function upgradeStudent(AdmissionNo, Class){
    $.ajax({
        url:'/student/upgrade/'+AdmissionNo+'?Class='+Class,
        type:'get',
        success:function(){
            console.log('student upgraded');
            new Noty({
                theme: 'relax',
                text: 'Student upgraded successfully',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById('item_'+AdmissionNo).style.display='none'
        },
        error:function(err){
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
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
        setTimeout(function(){
            window.location.href='/student/upgradeClass'
        }, 1000)
        },
        error:function(err){
            console.error.bind(err)
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
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
    <tr>
        <th>Select</th>
        <th>Student ID</th>
        <th>Name</th>
        <th>Class</th>
        <th>Father's Name</th>
        <th>Mother's Name</th>
        <th>Last Result</th>
        <th>Actions</th>
    </tr>
    </a>
    `
    for(let i=0;i<data.length;i++){
        let student = data[i];
        let item = document.createElement('tr');
        item.innerHTML = 
        `
            <th><input type=checkbox id=${student.AdmissionNo}_checkbox onchange='toggleCheck(${student.AdmissionNo})'></th>
            <th>${student.AdmissionNo}</th>
            <th>${student.FirstName} ${student.LastName}</th>
            <th>${student.Class}</th>
            <th>${student.FathersName}</th>
            <th>${student.MothersName}</th>
            <th>${student.LastClassGrade}</th>
            <th><button onclick='upgradeStudent(${student.AdmissionNo},${student.Class})' href='upgrade/${student.AdmissionNo}?Class=${student.Class}' class='btn btn-success'>Upgrade</button></th>   
        `
        
        //item.classList.add('btn');
        //item.classList.add('btn-light');
        //item.classList.add('student-list');
        item.setAttribute('id','item_'+student.AdmissionNo);
        listDiv.appendChild(item);
    }
   
    
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
document.getElementById('selectClass').addEventListener('change', getClassList);
//document.getElementById('upgradeClassList').addEventListener();