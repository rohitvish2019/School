

document.getElementById('noti-button').addEventListener('click', notyPanelToggller);
function notyPanelToggller(){
    console.log('in function')
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
        item.innerText=data[i];
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


