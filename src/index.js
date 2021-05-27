const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());
const storeStudent = require('./InitialData')
let localStudentdata = [...storeStudent]
let lenghtOfStudent = localStudentdata.length

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get('/api/student',async(req,res)=>{
   await res.send(localStudentdata)

})

app.get("/api/student/:id",async(req,res)=>{
    const id = req.params.id;
    const match = localStudentdata.filter(
        (student)=> student.id === Number(id)
    )
    if(match.length === 0){
        await res.sendStatus(400)
    }else{
        await res.send(match[0])
    }
});

const isNullOrundefined = (val)=> val === null || val === undefined;

app.post("/api/student", async (req,res)=>{
    const newStudent = req.body;
    const {name,currentClass,division}=newStudent;
    if(
        isNullOrundefined(name)||
        isNullOrundefined(currentClass)||
        isNullOrundefined(division)
    ){
        await res.sendStatus(400)
    }else{
       let newId = lenghtOfStudent+1;
       lenghtOfStudent=newId;
       newStudent.id = newId;
       localStudentdata.push(newStudent);
       await res.send({id:newId})
    }

});

app.put('/api/student/:id',async (req,res)=>{
    const id = req.params.id;
    const body = req.body;
    const {name,currentClass,division} = body;
    const matched = localStudentdata.findIndex(
        (student)=> student.id === Number(id)
    )
    if(matched.length === -1){
       await res.sendStatus(400)

    }else{

        if(!isNullOrundefined(name)){
              //localStudentdata.name = body.name;
             localStudentdata[matched].name = name  
            await res.sendStatus(200)
        }
        else if (!isNullOrundefined(currentClass)){
            localStudentdata[matched].currentClass=currentClass
            await res.sendStatus(200)
        }
        else if (!isNullOrundefined(division)){
            localStudentdata[matched].division = division
            await res.sendStatus(200)
        }
        else{
            await res.sendStatus(400)
        }

    }

})

app.delete('/api/student/:id', (req,res)=>{
    const id = req.params.id;
    const matched = localStudentdata.findIndex(
        (student)=> student.id === Number(id)
    )
    if (matched.length === -1){
         res.sendStatus(404)
    }
    else{
         localStudentdata.splice(matched,1);
        res.sendStatus(200)
    }
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   