

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
getTerms()



function getClassList(){
    $.ajax({
        url:'/user/getClassList',
        type:'Get',
        success:function(data){
            classes= data.classes;
            console.log(classes[0]);
            let selectContainer = document.getElementById('classList');
            selectContainer.innerHTML=`
            <option selected disabled>Select Class</option>
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

getClassList()
let subjects = []
function getSubjects(){

    $.ajax({
        url:'/reports/getTimeTable',
        data:{
            classValue:document.getElementById('classList').value,
            Term: document.getElementById('termSelect').value,
            Session:document.getElementById('session').value,
        },
        success:function(data){
            document.getElementById('SubmitTimeTable').style.display='block'
            if(data.isRecordFound === false){
                subjects = data.subjects
                let container = document.getElementById('info-body');
                container.innerHTML=``;
                for(let i=0;i<data.subjects.length;i++){
                    let item = document.createElement('tr');
                    item.innerHTML=
                    `
                        <td>${data.subjects[i]}</td>
                        <td><input type="text" id="examDate_${data.subjects[i]}" required></td>
                        <td><input type="text" id="examDay_${data.subjects[i]}" required></td>
                        <td><input type="text" id="examTime_${data.subjects[i]}" required></td>
                    
                    `
                    container.appendChild(item)
                }
                new Noty({
                    theme: 'relax',
                    text: 'No saved data found',
                    type: 'warning',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            }else{
                subjects = data.subjects
                let container = document.getElementById('info-body');
                container.innerHTML=``;
                
                for(let i=0;i<data.subjects.length;i++){
                    let item = document.createElement('tr');
                    let info = (data.timeTable.Information[data.subjects[i]]).split('$')
                    item.innerHTML=
                    `
                        <td>${data.subjects[i]}</td>
                        <td><input type="text" id="examDate_${data.subjects[i]}" required value='${info[0]}'></td>
                        <td><input type="text" id="examDay_${data.subjects[i]}" required value = '${info[1]}'></td>
                        <td><input type="text" id="examTime_${data.subjects[i]}" required value = '${info[2]}'></td>
                    
                    `
                    container.appendChild(item)
                }

                new Noty({
                    theme: 'relax',
                    text: 'Data fetched',
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                
            }
            
        },
        error:function(err){console.log(err.responseText)}
    })
}
let Information= new Object;
function saveInfo(){
    for(let i=0;i<subjects.length;i++){
        let sub = subjects[i];
        let day = document.getElementById('examDay_'+sub).value
        let date = document.getElementById('examDate_'+sub).value
        let time = document.getElementById('examTime_'+sub).value
        Information[sub] = date+'$'+day+'$'+time
    }

    $.ajax({
        url:'/reports/savetimeTable',
        type:'POST',
        data:{
            Information,
            Class: document.getElementById('classList').value,
            Term: document.getElementById('termSelect').value,
            Session:document.getElementById('session').value
        },
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error:function(err){
            new Noty({
                theme: 'relax',
                text: 'Unable to save information',
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}