document.getElementById('edit-profile').addEventListener('click', makeFormEditable)

function makeFormEditable(){
    let inputs = document.getElementsByClassName("form-input");
    document.getElementById('submit-form').removeAttribute('hidden')
    document.getElementById('download-button').setAttribute('hidden','true')
    document.getElementById('edit-profile').setAttribute('hidden','true')
    for(let i=0;i<inputs.length;i++){
        inputs[i].removeAttribute('readonly');
        inputs[i].style.border='1px solid black'
    }

    document.getElementById('class').setAttribute('readonly','true')
    document.getElementById('admissionNo').setAttribute('readonly','true')
    document.getElementById('session').setAttribute('readonly','true')

}