const chatModel = require('./models/chat');
require('dotenv').config();
const { Configuration, OpenAIApi }= require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

module.exports = function(io){

    let nicknames = [];


io.on('connection',async (socket)=>{

    console.log('Nuevo usuario conectado');

    //enviar chats anteriores

    let messages = await chatModel.find({});
    //console.log('msg '+messages);
    socket.nickname = 'Usuario'
    socket.emit('load old msgs',messages);


    ///socket.on('cadena que se esta enviando por aqui' , funcion respuesta);
   /* socket.on('new user',(data)=>{

            socket.nickname = data;
            nicknames.push(socket.nickname);
            io.sockets.emit('usernames',nicknames);
        
    });*/
    
    socket.on('send message', async (data)=>{

        var newMsg= new chatModel({
            msg:data,
            nick:socket.nickname
        });
        await newMsg.save();

        io.sockets.emit('new message',{
            msg:data,
            nick:socket.nickname
        });
        //let prompt = String(data);
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt:data,
                max_tokens:128,
              });
              var resp= response.data.choices[0].text;
       //       response.data.choices.forEach(element => {
         //           resp+=element.text;
           //   });

              console.log(response.data);
              newMsg= new chatModel({
                msg:resp,
                nick:'IA'
              });
              await newMsg.save();

              io.sockets.emit('new message',{
                msg:resp,
                nick:'IA'
            });      
        } catch (error) {
            console.log(error.message);
        }

    });

    socket.on('disconnect',(data)=>{
      
    });
});

}