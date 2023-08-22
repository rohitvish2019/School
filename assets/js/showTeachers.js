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
        document.getElementById(itemId.slice(5)+'_name').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_education').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_education').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_salary').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_salary').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_address').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_address').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_aadhar').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_aadhar').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_mobile').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_mobile').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_dob').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_dob').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_samagra').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_samagra').style.border='1px solid black'

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
                Name:document.getElementById(recordId+'_name')?document.getElementById(recordId+'_name').value:"",
                Address:document.getElementById(recordId+'_address')?document.getElementById(recordId+'_address').value:"",
                Salary:document.getElementById(recordId+'_salary')?document.getElementById(recordId+'_salary').value:"",
                Education:document.getElementById(recordId+'_education')?document.getElementById(recordId+'_education').value:"",
                Aadhar:document.getElementById(recordId+'_aadhar')?document.getElementById(recordId+'_aadhar').value:"",
                Samagra:document.getElementById(recordId+'_samagra')?document.getElementById(recordId+'_samagra').value:"",
                Mobile:document.getElementById(recordId+'_mobile')?document.getElementById(recordId+'_mobile').value:"",
                DOB:document.getElementById(recordId+'_dob')?document.getElementById(recordId+'_dob').value:"",
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
                    window.location.href='/teachers/home'
                },800)
            },
            error: function(err){console.error.bind(err)}
        })
    }
}