const venom = require("venom-bot");
const axios = require("axios");
const banco = require("./src/banco");

const treinamento = `

`

venom.create({
    session : "innovatech",
    multidevice: true
})
.then((client) => start(client))
.catch((error) => console.log(error));

const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $OPENAI_API_KEY"
}

const start = (client) => {
    client.onMessage((message) => {
        const userCadastrado = banco.db.find(numero => numero.num === message.from);
        if(!userCadastrado){
            console.log("Cadastrando usuário");
            banco.db.push({num: message.from, historico : [ ]});
        }
        else{
            console.log("Usuário já cadastrado");
        }

        const historico = banco.db.find(num => num.num === message.from);
        historico.historico.push("user: " + message.body)

        axios.post("https://api.openai.com/v1/chat/completions",{
            "model":"gpt-3.5-turbo",
            "messages":[
                {"role":"system", "content":treinamento},
                {"role":"system", "content":"historico de conversas " + historico.historico},
                {"role":"user","content":message.body}]
        },{
            headers: header
        })
        .then((response)=>{
            console.log(response.data.choices[0].message.content);
            historico.historico.push("assistent: " +  response.data.choices[0].content);
            client.sendText(message.from, response.data.choices[0].content)
        })
        .catch((error)=>{
            console.log(error)
        })
    })
}