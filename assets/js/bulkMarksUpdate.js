let selectedSubjects = [];
let maxMarks = 0;
function displayStudentsList(data){
    maxMarks = data[0]['Total']
    document.getElementById('maxMarks').innerText='Maximum Marks : '+ maxMarks;
    selectedSubjects = [];
    document.getElementById("marksTable").innerHTML = "";
    let studentsData = data
    var subjects = document.getElementsByName("subject");
    subjects.forEach(function(subject) {
        if (subject.checked) {
            selectedSubjects.push(subject.value);
        }
    });
    // Add table headers
    var headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>S.no</th><th>ID</th><th>Name</th>";
    
    selectedSubjects.forEach(function(subject) {
        headerRow.innerHTML += "<th>" + subject + "</th>";
    });
    headerRow.innerHTML += "<th>Action</th><th>Marksheet</th>";
    document.getElementById("marksTable").appendChild(headerRow);

    // Add student rows
    let count = 1;
    studentsData.forEach(function(student) {
        var row = document.createElement("tr");
        row.id=student.AdmissionNo
        row.innerHTML = "<td>" + count + "</td><td>" + student.AdmissionNo + "</td><td id='" +student.AdmissionNo+ "_name" + "'>" + "student.name" + "</td>";
        selectedSubjects.forEach(function(subject) {
            row.innerHTML += "<td><input type='number' id='" +student.AdmissionNo + "_" + subject + "' value='" + student[subject] + "'></td>";
        });
        row.innerHTML += "<td><button onclick='updateMarks(" + student.AdmissionNo + ")'>Update</button></td><td><a href='/student/getMarksheet/"+student.AdmissionNo+"/?Class="+document.getElementById('classSelect').value+"'>Marksheet</a></td>";
        document.getElementById("marksTable").appendChild(row);
        count++;
    });
}


function updateMarks(AdmissionNo) {
    let row = document.getElementById(AdmissionNo);
    console.log(row);
    let Term = document.getElementById('termSelect').value
    let Class = document.getElementById('classSelect').value
    let Allmarks={}
    console.log(selectedSubjects.length);
    for(let i=0;i<selectedSubjects.length;i++){
        let subjectName = selectedSubjects[i];
        let marks = document.getElementById(AdmissionNo+'_'+selectedSubjects[i]).value;
        document.getElementById(AdmissionNo+'_'+selectedSubjects[i]).style.border = '1px solid black'
        if(marks > maxMarks || marks < 0){
            new Noty({
                theme: 'relax',
                text: 'Invalid Marks Found',
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById(AdmissionNo+'_'+selectedSubjects[i]).style.border = '2px solid red'
            return;
        }
        Allmarks[subjectName]=marks
    }
    //console.log(selectedSubjects);
    $.ajax({
        url:'/result/updateSingleResult',
        type:'Post',
        data:{
            Term,
            Class,
            AdmissionNo,
            Allmarks,
            selectedSubjects
        },
        success: function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById(AdmissionNo).style.backgroundColor='#c7fbd7b5';
            return
        },
    })
}


function getClassList(){
    $.ajax({
        url:'/user/getClassList',
        type:'Get',
        success:function(data){
            classes= data.classes;
            console.log(classes[0]);
            let selectContainer = document.getElementById('classSelect');
            selectContainer.innerHTML=
            `
            <option disabled selected>Select Class</option>
            `;
            for(let i=0;i<classes.length;i++){
                let item = document.createElement('option');
                item.innerText=classes[i];
                item.value=classes[i];
                selectContainer.appendChild(item);
            }
        }
    })
}
function getTerms(){
    $.ajax({
        url:'/result/terms',
        type:'GET',
        success:function(data){
            let container = document.getElementById('termSelect');
            container.innerHTML=
            `
            <option selected disabled>Select Term</option>
            `
            let terms = data.terms;
            for(let i=0;i<terms.length;i++){
                let item = document.createElement('option');
                item.innerText=terms[i]
                item.value = terms[i]
                container.appendChild(item)
            }
        },
        error:function(err){console.log(err.responseText)}
    })
}
function getSubjects(){

    $.ajax({
        url:'/result/subjectsList',
        data:{
            classValue:document.getElementById('classSelect').value,
            Term: document.getElementById('termSelect').value
        },
        success:function(data){
            document.getElementById('selectButton').style.display='block';
            console.log(data);
            document.getElementById('classSelect').setAttribute('disabled', 'true')
            document.getElementById('termSelect').setAttribute('disabled', 'true')
            let container = document.getElementById('subjects');
            container.innerHTML=`<label style="display:block">Subjects:</label>`;
            for(let i=0;i<data.subjects.length;i++){
                let item = document.createElement('div');
                item.classList.add('subjectItem')
                item.innerHTML=
                `
                <input class='subjectItems' type="checkbox" id="${data.subjects[i]}" name="subject" value="${data.subjects[i]}">
                <label for="${data.subjects[i]}">${data.subjects[i]}</label>
                `
                container.appendChild(item)
            }
            
        },
        error:function(err){console.log(err.responseText)}
    })
}


function getCurrentResult(){
    let Term = document.getElementById('termSelect').value
    let Class = document.getElementById('classSelect').value
    let subjectsList = document.getElementsByClassName('subjectItems');
    let Subjects = ""
    for(let i=0;i<subjectsList.length;i++){
        if(subjectsList[i].checked){
            Subjects = Subjects + subjectsList[i].value+" "
        }
    }
    //Subjects = selectedSubjects.join(" ");
    console.log(subjectsList);
    console.log(Subjects)
    $.ajax({
        type:'get',
        url:'/result/getClassResult',
        data:{
            Term,
            Class,
            Subjects
        },
        success:function(data){
            displayStudentsList(data.resultSet);
            getNamesByClass(Class);
        }
    })
}


function getNamesByClass(Class){
    $.ajax({
        url:'/result/getStudentName',
        type:'GET',
        data:{
            Class,
        },
        success: function(data){
            for(let i=0;i<data.students.length;i++){
                document.getElementById(data.students[i].AdmissionNo+"_name").innerText=data.students[i].FirstName+" "+data.students[i].LastName
            }
        }
    });
}
document.getElementById('getSubject').addEventListener('click', getSubjects);
getTerms()
document.getElementById("selectButton").addEventListener("click", getCurrentResult);
getClassList()
