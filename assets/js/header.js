

document.getElementById('noti-button').addEventListener('click', notyPanelToggller);
document.getElementById('profile-toggle').addEventListener('click', profileToggeler);
document.getElementById('change-password').addEventListener('click', openChangePasswordForm);
document.getElementById('update-password-button').addEventListener('click', updatePassword)

/*
document.addEventListener('click', function(event){
    let notyContainer = document.getElementById('notifications');
    let profileContainer = document.getElementById('profile-details');
    if(profileContainer.style.display = 'block'){
        profileContainer.style.display='none';
    }
    if(notyContainer.style.display == 'block'){
        notyContainer.style.display='none'
    }
    
})
*/

function setLogo(){
    $.ajax({
        url:'get',
        type:'get'
    })
}
function notyPanelToggller(){
    console.log('in function')
    document.getElementById('profile-details').style.display='none'
    let container = document.getElementById('notifications')
    if(container.style.display === 'none'){
        container.style.display = 'block'
        getNotificationsfromserver();
    }else{
        container.style.display = 'none'
    }
}


function getNotificationsfromserver(){
    $.ajax({
        url:'/message/notifications',
        type:'GET',
        success: function(data){console.log(data)
            showNotifications(data.data)},
        error: function(err){console.log(err.responseText)}
    })
}


function showNotifications(data){
    let container = document.getElementById('notification-list');
    container.innerText='';
    for(let i=0;i<data.length;i++){
        let item = document.createElement('li');
        item.innerHTML=
        `
        <button class='noti-item'>${data[i]}</button>
        `
        //item.innerText=data[i];
        container.appendChild(item)
    }
}

document.getElementById('options').addEventListener('click', toggleHeader);

function toggleHeader(){
    console.log('Coreect')
    let header = document.getElementById('header-list');
    if(header && header.style.display === 'flex'){
        header.style.display = 'none'
    }else{
        header.style.display = 'flex'
    }
}

document.getElementById('search').addEventListener('click', searchButton)
function searchButton(){
    let listContainer = document.getElementById('studnets-list');
    if(listContainer.style.display === 'block'){
        listContainer.style.display='none'
    }else{
        listContainer.style.display='block'
    }
}



function profileToggeler(){
    console.log('Caling...')
    document.getElementById('notifications').style.display='none'
    let element = document.getElementById('profile-details');
    if(element.style.display === 'block'){
        element.style.display = 'none'
    }else{
        element.style.display='block'
    }
}


function openChangePasswordForm(){
    
    document.getElementById('profile-data').style.display='none'
    document.getElementById('change-password-div').style.display='block'
}


function updatePassword(){
    let newPass1 = document.getElementById('newpass').value;
    let newPass2 = document.getElementById('confpass').value;
    if(newPass1 === '' || newPass2 === ''|| newPass1 != newPass2){
        new Noty({
            theme: 'relax',
            text: 'New password and confirm password does not match',
            type: 'error',
            layout: 'topRight',
            timeout: 1000
        }).show();
        return;
    }
    $.ajax({
        url:'/user/updatePassword',
        type:'POST',
        data:{
            oldPassword: document.getElementById('oldpass').value,
            newPassword : newPass1
        },
        success: function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            document.getElementById('profile-details').style.display='none'
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: err.responseText,
                type: 'error',
                layout: 'topRight',
                timeout: 1000
            }).show();
        }
    })
}


function cancelPasswordChange(){
    document.getElementById('profile-data').style.display='block'
    document.getElementById('change-password-div').style.display='none'
}

