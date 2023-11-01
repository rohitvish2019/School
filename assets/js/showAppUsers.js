function getAllUsers(){
    $.ajax({
        url:'/user/getAll',
        type:'Get',
        success: function(data){showUsers(data.users)},
        error: function(err){console.log(err)}
    })
}

function showUsers(data){
    console.log(data);
    let container = document.getElementById('usersDetails');
    container.innerHTML =
    `
    <tr>
        <th>Name</th>
        <th>Username</th>
        <th>Role</th>
        <th>Address</th>
    </tr>
    `
    
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML=
        `
            <td>${data[i].full_name}</td>
            <td>${data[i].email}</td>
            <td>${data[i].role}</td>
            <td>${data[i].address}</td>
        `
        container.appendChild(item);
    }
}
getAllUsers();