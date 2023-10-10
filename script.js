const dropArea=document.querySelector(".drag-area");
dragText=dropArea.querySelector("header");
button=dropArea.querySelector("button");
input=dropArea.querySelector("input");
const result=document.querySelector(".result");
const API_KEY="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";
let file;
const resms=document.createElement("p");

button.onclick=()=>{
    input.click()
}
input.addEventListener("change",function(){
    file=this.files[0];
    dropArea.classList.add("active");
    showFile();
});

dropArea.addEventListener("dragover",(event)=>{
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent="Release to Upload File";
})
dropArea.addEventListener("dragleave",()=>{
    dropArea.classList.remove("active");
    dragText.textContent="Drag & Drop to Upload File";
})
dropArea.addEventListener("drop",(event)=>{
    event.preventDefault();
    file=event.dataTransfer.files[0];
    showFile();
    
});
function showFile(){
    let fileType=file.type;
    let valid=["image/jpeg","image/jpg","image/png"];
    if(valid.includes(fileType)){
        let fileReader=new FileReader();
        fileReader.onload=()=>{
            let fileURL=fileReader.result;
            let imgTag=`<img style="object-fit: contain;"src="${fileURL}" alt="">`;
            dropArea.innerHTML=imgTag;
            resms.innerHTML+="Loading.........";
            result.appendChild(resms);

        }
        fileReader.readAsDataURL(file)

    }
    else{
        alert("This is not an Image File....!");
        dropArea.classList.remove("act ive");
        dragText.textContent="Drag & Drop to Upload File";
    }
    const formData = new FormData();
    formData.append('image', file);
    console.log(formData);

    const url="http://localhost:5000/process_resume";
    fetch(url, {
        method: 'POST',
        body: formData
      })
        .then(response => response.text())
        .then(data => {
          var base="Give 50 questions from the below list "
          //skill=["java","Nodejs","Python"];
        //   for(t in data)
        //   base+=data[t]+", ";
          base+=data+" in shuffled mannner"
          console.log(base);
          chatgpt(base);
        })
        .catch(error => {
          console.error('Error:', error);
        });
        // var base=" Generate interview questions for "
        // skill=["java","Nodejs","Python"];
        // for(t of data)
        // base+=t+", ";
        // base+=" in shuffled mannner"
        // chatgpt(base);
}
async function chatgpt(skill){

    const API_URL="https://api.openai.com/v1/chat/completions";

    
    const requestOptions={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body: JSON.stringify(
            {
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: skill}]
            })         
    }
    try{
        console.log(skill);
        const response= await fetch(API_URL,requestOptions);
        const data = await response.json();
        const heading=document.createElement("h1");
        resms.innerHTML="";
        result.appendChild(resms);
        heading.innerHTML="Interview Questions based on Skills";
        result.appendChild(heading);
        resms.remove();
        const resmsg=document.createElement("p");
        const text=data.choices[0].message.content;
        const ques= text.split(/\d+\./);
        const formattedQuestions = ques.filter(question => question.trim() !== '');
        console.log(formattedQuestions)
        await formattedQuestions.forEach((question, index) => {
            
            resmsg.innerHTML+=`${index + 1}. ${question.trim()}`+"<br><br><br>";
        });
       result.appendChild(resmsg);
    }catch(error){
        console.log(error);
    }
    
}