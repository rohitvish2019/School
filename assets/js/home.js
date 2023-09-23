document.addEventListener('click', function(event){
    runListener(event.target.id);
});

function runListener(id){
    if(id.match(/delete.*/)){
        deleteMessage(id.slice(12));
    }
}

function deleteMessage(messageId){
    let response = window.confirm('Selected global notification will be deleted permanently, Please confirm !');
    
    if(response){
        $.ajax({
            url:'/message/delete/'+messageId,
            type:'delete',
            success: function(data){
                console.log(data.message);
                document.getElementById(data.id).style.display='none';
                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show(); 
            },
            error: function(err){
                new Noty({
                    theme: 'relax',
                    text: JSON.parse(err.responseText.message),
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show(); 
            }
        })
    }
}