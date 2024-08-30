function getAdmitCardsList(){
    let Term,Class,Session;
    Term = document.getElementById('selectedTerm').value;
    Class = document.getElementById('selectedClass').value;
    Session = document.getElementById('selectedSession').value;
    if(!Session || Session == ''){
        new Noty({
            theme: 'relax',
            text: 'Please input session',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    if(!Class || Class == ''){
        new Noty({
            theme: 'relax',
            text: 'Please select class',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    if(!Term || Term == ''){
        new Noty({
            theme: 'relax',
            text: 'Please select term',
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return;
    }
    
    $.ajax({
        type:'Get',
        url:'/teachers/getAdmitCards',
        data:{
            Term,
            Class,
            Session,
        },
        success:function(data){showAdmitCards(data.students, data.timeTable.Information,Class,data.SchoolName)},
        error:function(err){(console.log(err.responseText))}
    })
}

function showAdmitCards(students, timeTable, Class, SchoolName){
    let roleNoSuffix = Class;
    if(Class=='kg-1'){
        roleNoSuffix='KG1'
    }
    if(Class == 'kg-2'){
        roleNoSuffix='KG2'
    }
    let container = document.getElementById('container');
    container.innerHTML=``;
    
    
    console.log(students.length);
    for(let i=0;i<students.length;i++){
        let item = null
        let ttkeys = Object.keys(timeTable)
        item = document.createElement('div');
        item.classList.add('card-container');
        item.innerHTML=
        `
            <div style="text-align: center;width: 100%; margin-top: -1%;">
                <label class="heading"><b>${SchoolName}</b></label>
                <label style="font-size: 17px;display: block;" >E-Pravesh Patra 2024</label>
                <label style="font-size: 15px;" >Class ${Class}, Hindi Medium</label>
            </div>
            <div class="student-info">
                <div class="text-info">
                    <div class="lines">
                        <label style="margin-bottom: 2px; min-width: 40% !important; display: inline-block;">विद्यार्थी का नाम :  </label> 
                        <label for=""> ${students[i].FirstName} ${students[i].LastName}</label>   
                    </div>
                    <div class="lines">
                        <label style="margin-bottom: 2px; min-width: 40% !important; display: inline-block;">पिता का नाम : </label> 
                        <label for=""> ${students[i].FathersName}</label>   
                    </div>

                    <div class="lines">
                        <label style="margin-bottom: 2px; min-width: 40% !important; display: inline-block;">माता का नाम : </label> 
                        <label for=""> ${students[i].MothersName}</label>   
                    </div>

                    <div class="lines">
                        <label style="margin-bottom: 2px; min-width: 40% !important; display: inline-block;">जन्म तिथि : </label> 
                        <label for=""> ${students[i].DOB.split('-')[2]}-${students[i].DOB.split('-')[1]}-${students[i].DOB.split('-')[0]}</label>   
                    </div>

                    <div class="lines">
                        <label style="margin-bottom: 2px; min-width: 40% !important; display: inline-block;">अनुक्रमांक :  </label> 
                        <label for="">${roleNoSuffix}${(i+1).toString().padStart(2,'0')}</label>   
                    </div>
                    <div class="lines">
                        <label style="margin-bottom: 2px; min-width: 40% !important; display: inline-block;">समय :  </label> 
                        <label for="">${timeTable[ttkeys[0]].split('$')[2]}</label>   
                    </div>
                </div>
            </div>
            <div style="margin-top: 5px;">
                <table id="table_${i}" style="width: 100% !important;">
                    <thead>
                        <th style="width: 5%;">S.no</th>
                        <th style="width: 45%;">Subject</th>
                        <th style="width: 28%;">Date</th>
                        <th style="width: 23%;border-right: none;">Day</th>
                    </thead>
                </table>
            </div>
        `
        let timeTableElement = document.createElement('tbody');
        
        
        for(let j=0;j<ttkeys.length;j++){
            let tableRow = document.createElement('tr')
            tableRow.innerHTML=
            `   
                <td style="text-align: center;width: 5% !important">${j+1}</td>
                <td style="padding-left: 2px;width: 45%;">${ttkeys[j]}</td>
                <td style="width: 28% !important;">${timeTable[ttkeys[j]].split('$')[0]}</td>
                <td style="border-right: none;width: 23%;">${timeTable[ttkeys[j]].split('$')[1]}</td>
                
            `
            timeTableElement.appendChild(tableRow);
        }
        container.appendChild(item);
        document.getElementById('table_'+i).appendChild(timeTableElement)
        
    }
}

function makePrintable(){
    let items = ['classSelector','makePrintableButton','getAdmitCardsbutton','termSelector','seesionSelector']
    for(let i=0;i<items.length;i++){
        document.getElementById(items[i]).style.display='none'
    }
}





