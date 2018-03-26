// The game composed of 4 stages
// STAGE 1. click to start the game
// STAGE 2. Display question and choices
//          2.1 timer starts
//          2.2 users input (click) obtained
//          2.3 input evaluated
//          2.4 Correct/Wrong/time-up masseage displayed for a period of time with correct answer (if necessary)
//               2.4.1 if correct correct answer counter incereases 
// STAGE 3. Reset timer and repeart stage 2 for all questions until all questions depleted.
// STAGE 4. End of game statistics diplayed
$(document).ready(function () {
    $("#question").text("CLICK THE BUTTON TO START THE F1 TRIVIA GAME!")
    $("#multiChoice").toggle();
    $("#timediv").toggle();
    $("#statdiv").toggle();
    f1game.resetTimer();
    f1game.statUpdate();
    $("#start").click( function() {  
        $("#start").slideToggle();
        $("#timediv").slideToggle();
        $("#statdiv").slideToggle();                     
        $("#multiChoice").slideToggle();
        f1game.askquestion();  // Asks the first question and starts timer
    })
    $(".choice").click(f1game.evalAns);
    // the function below sets sound when choices are hovered over
    $(".choice").mouseenter(function () {
        var aud1 = $("#beep1")[0];
        aud1.play();
    })
})

var f1game = {
    questions:["What does F1 stand for?",
        "Brazilian driver Pedro Diniz and British world champion Damon Hill raced for which team during the 1997 F1 season?",
        "In 2005, the rules stated what part of the car that the teams were not allowed to change during a grand prix?",
        "What must F1 drivers do when they see a blue flag?",
        "At which circuit did Michael Schumacher attempted to take out the 97 championship leader Jacques Villeneuve?",
        "Name the only team to have competed in every championship of the 20th century?",
        "Who began the 2003 season as defending World Champion?",
        "How many Grand Prix did Ayrton Senna win while driving for Lotus?",
        "Who was the legendary driver who crashed and died in Imola 1994 during the Grand Prix?",
        "Which team and driver won the 1995 Constructor's and Driver's Championship?",
        "Which of these four drivers has the most career wins?"
        ],
    answers:[["Fuel 1","Fast 1","Future 1","Formula 1"],
            ["Minardi","Arrows","Renault","Ferrari"],
            ["Rear wing","Engine","Tyres","Nose Cone"],
            ["Allow the faster car behind them to pass","Be aware that there is a wreck on circuit","Be aware that they are in final lap","Return to pit box for penalty time"],
            ["Suzuka","Silverstone","Nurburgring","Jerez"],
            ["McLaren","Jordan","Williams","Ferrari"],
            ["Michael Schumacher","David Coulthard","Mika Hakkinen","Rubens Barrichello"],
            ["1","3","6","11"],
            ["Gilles Villeneuve","Denis Welch","Ayrton Senna","Mark Donohue"],
            ["Benetton-Renault and Michael Schumacher","Williams-Renault and Damon Hill","Williams-Renault and David Coulthard","McLaren-Mercedes and Mika Hakkinen"],
            ["Ayrton Senna","Nigel Mansell","Niki Lauda","Michael Schumacher"]
        ],
    correctIndx:[3,1,2,0,3,3,0,2,2,0,3],
    currentQIndx:0,
    nWins:0,
    nLoss:0,
    nNoAns:0,
    TimePerQ:15000,
    currentTimer:this.TimePerQ,
    tmr:0,
    tmrcolor:0,
    resptimes:[],
    askquestion: function() {
        $("#question").text(f1game.questions[f1game.currentQIndx]); // question
        $(".choice").each( function(i) {
            $(this).text(f1game.answers[f1game.currentQIndx][i])  // multiple choice
        })
        this.startTimer(); // timer
    },
    startTimer: function() {
        f1game.tmr=setInterval(function(){   //Update time interval and keep an eye on it     
            f1game.displayTimer();      
            if (f1game.currentTimer>0) {               
                f1game.currentTimer-=10;                
            } else {                         // Means time ran out               
                f1game.caseTimeup();
            }
        },10)        
    },
    evalAns: function() {
        var usrIndx=f1game.answers[f1game.currentQIndx].indexOf($(this).text());
        var corIndx=f1game.correctIndx[f1game.currentQIndx];
        if (usrIndx === corIndx) {            
            f1game.caseWin();    // You Win              
        } else {            
            f1game.caseLoss();   // You loose
        }                   
    },
    proceed: function() {
        if (this.currentQIndx < this.questions.length-1){
            this.currentQIndx++; // increment question index (next question)
            this.statUpdate();   // Update status box components
            this.resetTimer();   // Restart timer
            this.askquestion();  // Display the question  
        } else {                 // ** IF questions depleted display stats, reset and ask if player wnats another round
            this.statUpdate();
            $("#multiChoice").toggle();
            $("#timediv").toggle();
            // var stattxt=$("#statdiv").html();
            $("#statdiv").slideToggle(); 
            // $("#question").html(stattxt);
            $("#question").html(`<h1> Game Completed! </h1>
                <p> Number of Questions: ${this.questions.length} </p>
                <p> Average Response Time: ${(this.resptimes.reduce((p,c)=>p+c)/this.resptimes.length).toFixed(2)} seconds</p>
                <p> Number of Correct Answers: ${this.nWins} </p>
                <p> Number of Wrong Answers: ${this.nLoss} </p>
                <p> Number of Unanswered Questions: ${this.nNoAns}</p>                
                `).css({"font-size":"2.8rem","color":"blue","line-height":"5rem"})
            setTimeout(function() {
                $("#question").slideToggle();                
                $("#question").text("CLICK THE BUTTON TO RESTART THE F1 TRIVIA GAME!")
                              .css({"font-size":"2.0rem","color":"darkblue","line-height":"4rem"});
                f1game.resetAll();
                $("#question").slideToggle(function() {
                    $("#start").text("Restart").slideToggle()});    
            },10000);             
        }
    },
    statUpdate: function() {
        $("#nWin").text(this.nWins);
        $("#nLoss").text(this.nLoss);
        $("#nNot").text(this.nNoAns);
        $("#nQ").text([this.currentQIndx+1].toString() + "/" + this.questions.length.toString());
    },
    caseWin: function() {
        this.nWins++;  
        this.dispOutcome("Correct Answer!!");
    },
    caseLoss: function() {
        this.nLoss++;              
        this.dispOutcome("Wrong Answer!!");
    },
    caseTimeup: function() {
        this.nNoAns++;         
        this.dispOutcome("Time is up!!!");
    },
    resetTimer: function() {       
        this.currentTimer=this.TimePerQ;
        this.displayTimer();
        $("#timer").css("color","rgb(0,0,0)");
        this.tmrcolor=0;
    },
    displayTimer: function() {
        var tmr= [Math.floor(this.currentTimer/1000)].toString().padStart(2,"0") + ":" + [(this.currentTimer/10)%100].toString().padStart(2,"0");
        this.tmrcolor+=(255/(f1game.TimePerQ/10)); 
        var RRR= Math.round(this.tmrcolor)-1;
        $("#timer").text(tmr).css("color","rgb(" + RRR + ",0,0)"); 
     },
     dispOutcome: function(msg) {
        clearInterval(this.tmr);  // Timer needs to stop as soon as we answer ot time is up
        $("#multiChoice").toggle();
        $("#question").text(msg).css("font-size","4rem")
        if (msg !==  "Correct Answer!!" ) {
            var msg2 = "Correct Answer is: " + this.answers[this.currentQIndx][this.correctIndx[this.currentQIndx]]; 
            $("#question").append("<p id='msg2'>" + msg2 +"</p>");
            $("#msg2").css("font-size","2.3rem");
        };       
        $("#multiChoice").after("<img id='f1img'/>")
        $("#f1img").attr("src","assets/images/pic" + this.currentQIndx +".gif").css("border-radius","3rem").toggle();       
        $("#f1img").animate({width: 'toggle'},"slow");
        setTimeout(function(){
            $("#f1img").animate({width: 'toggle'},"slow",function(){
                $("#f1img").remove(); // We need to remove it to avoid inflation of the html eventhough it is hidden
                $("#multiChoice").toggle();
                $("#question").css("font-size","2rem")
                f1game.resptimes.push((f1game.TimePerQ-f1game.currentTimer)/1000);
                f1game.proceed();}) // This propagates the process
        },7000);
     },
     resetAll: function() {
        this.resetTimer();
        this.currentQIndx=0;
        this.nWins=0;
        this.nLoss=0;
        this.nNoAns=0;
        this.statUpdate();                
     }
}