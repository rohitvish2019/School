function getAllUsers(){
    $.ajax({
        url:'/user/getAll',
        type:'Get',
        success: function(data){console.log(data)},
        error: function(err){console.log(err)}
    })
}

function showUsers(){
    
}
getAllUsers();