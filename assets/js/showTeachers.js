//const TeachersDetails = require("../../modals/TeachersDetails");

document.addEventListener('click', runListener);

function runListener(event){
    console.log(event.target.id.slice(4,));
    itemId = event.target.id;
    itemFirstClass = event.target.classList[0];
    if(itemId === 'AddNewTeacher'){
        document.getElementById('pop-up-box').removeAttribute('hidden');
        document.getElementById('teachersDetails').setAttribute('hidden','true');
    }
    else if(itemId === 'closeButton'){
        document.getElementById('pop-up-box').setAttribute('hidden','true');
        document.getElementById('teachersDetails').removeAttribute('hidden');
    }
    else if(itemFirstClass === 'editTeacher'){
        document.getElementById(itemId.slice(5)+'_name').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_education').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_salary').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_address').removeAttribute('readonly');
        //document.getElementById(itemId.slice(5)+'_subjects').removeAttribute('readonly');
        //document.getElementById(itemId.slice(5)+'_documents').removeAttribute('readonly');
        document.getElementById('update_'+itemId.slice(5)).removeAttribute('hidden');
        document.getElementById(itemId).setAttribute('hidden', 'true')
    }
    else if(itemId.match(/update.*/)){
        console.log('in update method')
        recordId = itemId.slice(7);
        console.log(recordId);
        $.ajax({
            type:'POST',
            url:'/teachers/update',
            data:{
                id:recordId,
                name:document.getElementById(recordId+'_name')?document.getElementById(recordId+'_name').value:"",
                address:document.getElementById(recordId+'_address')?document.getElementById(recordId+'_address').value:"",
                salary:document.getElementById(recordId+'_salary')?document.getElementById(recordId+'_salary').value:"",
                education:document.getElementById(recordId+'_education')?document.getElementById(recordId+'_education').value:""
            },
            success : function(data){
                console.log(data);
                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1000
                }).show();
                setTimeout(function(){
                    window.location.href='http://localhost:8000/teachers/home'
                },800)
            },
            error: function(err){console.error.bind(err)}
        })
    }
}