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