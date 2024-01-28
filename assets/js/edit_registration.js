function admitStudent(registration){
    console.log('Admission approved for student at registration no '+registration);
    $.ajax({
        type:'post',
        url: '/registration/admit/'+registration,
        success: function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            setTimeout(function(){
                window.location.href='/student/showByClass/admission'
            }, 1500)
            
            
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}