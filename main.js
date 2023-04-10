//Select Elemnts
let countSpan = document.querySelector(".count span");
let allBullets = document.querySelector(".bullets ");
let bulletsContainer = document.querySelector(".bullets .spans");
let quiz_area = document.querySelector(".quiz-area");
let answers_area = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results")
let count_down = document.querySelector(".countdown");

//set options
let currentIndex = 0;
let righrAnswers = 1;
let countDownInterval;


function getQuestions (){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){

            let questionsObject  = JSON.parse(this.responseText)
            let qCount = questionsObject.length;
           //creat bullets + set question count
           creatBullets(qCount);
           //Add questions Data
           addQuestionsData(questionsObject[currentIndex],qCount);

           //start count down
           countDown(5, qCount);
           //when clicke
           submitButton.onclick = () => {
            //make audio
            document.querySelector(".audio").play();
           //get the rirht answer
           let theRightAnswer = questionsObject[currentIndex].right_answer;
           
          
           // increase index
           currentIndex++;
           // check the answer
           checkAnswer(theRightAnswer,qCount);

           //remove the previous questions
           quiz_area.innerHTML = "";
           answers_area.innerHTML = "";

           //add questions data
           addQuestionsData(questionsObject[currentIndex],qCount);

           // handel spans classes
           handelBullets();

           clearInterval(countDownInterval);
           countDown(5, qCount);
           
           //show results
           showResults(qCount);



          
           }
           
            

           
            
        }
        
    }
    myRequest.open("GET","questions.json", true);
    myRequest.send()
   
}
getQuestions();

function creatBullets (num){
    countSpan.innerHTML = num;
    //creat spans
    for(let i = 0 ; i < num ; i++){
        let theBullet = document.createElement("span");
        //Check if it is the first span
        if(i == 0){
            theBullet.className ="on";

        }
        //Append bullets to main bullet container
        bulletsContainer.appendChild(theBullet);
        


    }

}
function addQuestionsData(obj,count){

    if(currentIndex < count){
        //creat h2 question tittle
   let questionTittle = document.createElement("h2");
   //creat question text
   let questionText = document.createTextNode(obj.tittle);
   //Append text to H2
   questionTittle.appendChild(questionText);
   //Append question tittle to mainDive
   quiz_area.appendChild(questionTittle);
   //creat the answers

   for(let i = 1; i <= 4; i++){
    //creat main answer div
    let answerDiv = document.createElement("div");
    //add class to answer div
    answerDiv.className = 'answer';
    //creat input radio
    let radioInput = document.createElement("input");
    //Add type name id data-attribute
    radioInput.name = 'question';
    radioInput.type = 'radio';
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];
    // if(i === 1){
    //     radioInput.checked = true;

    // }
    //creat the label
    let theLabel = document.createElement("label");
    theLabel.htmlFor = `answer_${i}`;
    //creat label text
    let labelText = document.createTextNode( obj[`answer_${i}`]);
    //add the text to the label
    theLabel.appendChild(labelText);
    // add input + label to answer div
    answerDiv.appendChild(radioInput);
    answerDiv.appendChild(theLabel)
    // add answer div to answers-area
    answers_area.appendChild(answerDiv);




   }

    }
   



}
   function checkAnswer(rAnswer,Count){
   let answers = document.getElementsByName("question");
   
   let theChoosenAnswer;

   for(let i = 0; i < answers.length; i++){
    if(answers[i].checked){
       theChoosenAnswer =  answers[i].dataset.answer;
    
    }
   
   }
  
   if(rAnswer === theChoosenAnswer){
    righrAnswers++;
    

   }
   }
  
   function handelBullets(){
    let bulletSpans = document.querySelectorAll(".spans span");
    let arrayOfSpans = Array.from(bulletSpans).forEach((span,index)=>{
        if(currentIndex === index){
            span.className = "on";

        }
    });

   
   }
   
   function showResults(count){
    if(currentIndex === count){
        let theResults;
        quiz_area.remove();
        answers_area.remove();
        submitButton.remove();
        allBullets.remove();
        if(righrAnswers > (count / 2) && righrAnswers < count){
            theResults = `<span class ="good">Good</span>,${righrAnswers} From ${count}`

        }else if (righrAnswers === count){
            theResults = `<span class ="perfect">Perfect</span>,Your Answers are compeletly right.`
        }else{
            theResults = `<span class ="bad">Bad</span>,${righrAnswers} From ${count}.`
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px"
        resultsContainer.style.backgroundColor = "white"
        resultsContainer.style.marginTop = "10px"
        

        swal("Good job!", "You have finished!", "success");  
        
        

    }

   }

   function countDown(duration,count){
    if(currentIndex < count){
        let sec,min;
        countDownInterval = setInterval(function(){
            min = parseInt(duration / 60);
            sec = parseInt(duration % 60);
            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;

            count_down.innerHTML = `${min} : ${sec}`
            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();

            }
             

        },1000);
    }

   }