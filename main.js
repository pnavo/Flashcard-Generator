var inquirer = require("inquirer");
var library = require("./library.json");
var BasicCard = require("./basic.js")
var ClozeCard = require("./cloze.js")
var colors = require('colors');
var fs = require("fs");

var libCard;
var playedCard;
var count = 0;


function openMenu() {
  inquirer.prompt([                                                         
      {
          type: "list", 
          message: "\nPlease choose a menu option from the list below?",
          choices: ["Create New Card", "Use Existing Cards", "Exit"],   
          name: "menuOptions"                                               
      }

  ]).then(function (answer) {                                                   
    switch (answer.menuOptions) {
        case 'Create New Card':
            console.log("Make a new flashcards");
                createCard();
            break;
        case 'Use Existing Cards':
            console.log("Use flashcards on file");
                askQuestions();
            break;
        case 'Exit':
            console.log("Thank you for using the Disney Flashcard-Generator")
            return;
            break;
        default:
            console.log("");
            console.log("Sorry I don't understand yoour request");
            console.log("");
    }

  });

}
openMenu();

function createCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "What type of flashcard do you want to make?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }

    ]).then(function (appData) {
        var cardType = appData.cardType;            
        console.log(cardType);                      

        if (cardType === "Basic Card") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Front of your card (Your Question).",
                    name: "front"
                },
                {
                    type: "input",
                    message: "Back of your card (Your Answer).",
                    name: "back"
                }

            ]).then(function (cardData) {
                var cardObject = {                     
                    type: "BasicCard",
                    front: cardData.front,
                    back: cardData.back
                };             
                library.push(cardObject);                             
                fs.writeFile("library.json", JSON.stringify(library, null, 2)); 

                inquirer.prompt([                   
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }
                ]).then(function (appData) {                
                    if (appData.anotherCard === "Yes") {    
                        createCard();                       
                    } else {                                
                        openMenu();         
                    }
                });
            });
        } else {                        
            inquirer.prompt([
                {
                    type: "input",
                    message: "Write full text of your statement.",
                    name: "text"
                },
                {
                    type: "input",
                    message: "Remove part of sentence you want to cloze out, (replacing with '...'.)",
                    name: "cloze"
                }
            ]).then(function (cardData) {            

                var cardObject = {                     
                    type: "ClozeCard",
                    text: cardData.text,
                    cloze: cardData.cloze
                };
                if (cardObject.text.indexOf(cardObject.cloze) !== -1) {   
                    library.push(cardObject);                          
                    fs.writeFile("library.json", JSON.stringify(library, null, 2)); 
                } else {                                            
                    console.log("The cloze must match word or words in the sentence.");
                }
                inquirer.prompt([                   
                    {
                        type: "list",
                        message: "Do you want to make another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function(appData) {                
                    if (appData.anotherCard === "Yes") {    
                        createCard();                       
                    } else {                                
                        openMenu();     
                    }
                });
            });
        }

    });
};

function getQuestion(card) {
    if (card.type === "BasicCard") {                        
        libCard = new BasicCard(card.front, card.back);   
        return libCard.front; 
    } else if (card.type === "ClozeCard") { 

        libCard = new ClozeCard(card.text, card.cloze)         
        return libCard.clozeRemoved();                    
    }
};

function askQuestions() {
    if (count < library.length) {                    
        playedCard = getQuestion(library[count]);   
        inquirer.prompt([                           
            {
                type: "input",
                message: playedCard,
                name: "question"
            }           
        ]).then(function(answer) {                 
            if (answer.question === library[count].back || answer.question === library[count].cloze) {
                console.log(colors.blue("You are correct!!"));
            } else {
                if (libCard.front !== undefined) { 
                    console.log(colors.magenta("Sorry, the correct answer is ") + library[count].back + "."); 
                } else {                   
                    console.log(colors.magenta("Sorry, the correct answer is ") + library[count].cloze + ".");
                }
            }          
            count++; 
            askQuestions(); 
        });
    } else {
        count=0;
        openMenu();        
    }
};