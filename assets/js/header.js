document.getElementById('noti-button').addEventListener('click', notyPanelToggller);
function notyPanelToggller(){
    console.log('in function')
    let container = document.getElementById('notifications')
    if(container.style.display === 'none'){
        container.style.display = 'block'
    }else{
        container.style.display = 'none'
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