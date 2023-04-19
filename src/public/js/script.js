$(function(){

    const socket = io();
    //obtain DOM elements from the interface
    const $messageForm = $('#message-form');
    const $chat = $('#chat');
    const $messageBox = $('#message');
    const $nickform = $('#nickForm');
    const $nickname = $('#nickname');
    const $nickError = $('#nickError');
    const $usernames = $('#usernames');



    //capturando los eventos del formulario

    /*$nickform.submit((e)=>{
        e.preventDefault();
        socket.emit('new user',$nickname.val(),(data)=>{
            if (data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(
                    
                   ` <div class="alert alert-danger">
                        That username already exists
                    </div>
                    `);
            }
            $nickname.val('');
        });
    });*/



    $messageForm.submit(e=>{
        e.preventDefault();
        socket.emit('send message',$messageBox.val());
        $messageBox.val('');
    });

  /*  socket.on('usernames',(data)=>{
        let html = '';
        console.log(data);
        for (let i = 0; i<data.length ;i++){
            console.log(data[i]);
            html+=`<p>${data[i]}</p>`;
        }
        $usernames.html(html);
    });*/

    socket.on('new message',(data)=>{
        $chat.append('<b>'+data.nick+'</b>: '+data.msg+'<br/>');
        $chat.animate({scrollTop:1000000},800);
        
    });

    socket.on('load old msgs' ,data =>{
        for (let i = 0; i < data.length; i++) {
        $chat.append('<b>'+data[i].nick+'</b>: '+data[i].msg+'<br/>');
        }
        $chat.animate({scrollTop:1000000},800);
    });


})
