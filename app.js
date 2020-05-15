//jshint esversion:6

//-----------------------------------------------------------------------------
//GLOBAL SETUP
//-----------------------------------------------------------------------------

let acc1 = 0;
let acc2 = 0;
let acc3 = 0;
let inputNumber = "";
let operator = "";
let lastOperator = "";
let decimalInserted = false;
let toggleSign = 1;
let operationState = 1;
let divideByZero = false;

//-----------------------------------------------------------------------------
//BUTTON INPUT HANDLING
//-----------------------------------------------------------------------------
let buttonArray = document.querySelectorAll("button");
let buttonArrayLength = document.querySelectorAll("button").length;

for (let i = 0; i < buttonArrayLength; i++) {

  buttonArray[i].addEventListener("click", function() {

    userInputFilter(buttonArray[i].innerText);

  });

}

//-----------------------------------------------------------------------------
//KEY INPUT HANDLING
//-----------------------------------------------------------------------------

document.addEventListener("keydown", function() {

  userInputFilter(event.key);

});

//-----------------------------------------------------------------------------
//USER INPUT FILTER
//-----------------------------------------------------------------------------

function userInputFilter(input) {

  let output = "";

  if (divideByZero == true) {

    if ((input == "CE") || (input == "c")) {

      initialiseHandler();

    }

  } else if (divideByZero == false) {

    if (isNaN(input) == true) {

      if ((input == "CE") || (input == "c")) {
        initialiseHandler();
      } else if ((input == "C") || (input == "Backspace")) {
        partialInitialiseHandler();
      } else if ((input == "=") || (input == "Enter")) {
        output = "=";
        operationHandler(output);
      } else if (input == "+-") {
        toggleSign *= -1;
        signChangeHandler(inputNumber);
      } else if (input == ".") {
        output = input;
        inputNumberHandler(output);
      } else if ((input == "+") || (input == "-") || (input == "/") || (input == "%")) {
        output = input;
        operator = input;
        operationHandler(output);
      } else if ((input == "*") || (input == "x")) {
        output = "*";
        operator = output;
        operationHandler(output);
      }

    } else if (isNaN(input) == false) {

      if (operationState == 4) {

        document.querySelector(".last").innerText = acc3.toString();
        operationState = 1;

      }

      output = input;
      inputNumberHandler(output);

    }

  }

}

//-----------------------------------------------------------------------------
//INITIALISE (CE)
//-----------------------------------------------------------------------------

function initialiseHandler() {
  acc1 = 0;
  acc2 = 0;
  acc3 = 0;
  inputNumber = "";
  operator = "";
  decimalInserted = false;
  toggleSign = 1;
  operationState = 1;
  divideByZero = false;
  document.querySelector(".current-op").classList.remove("broken-text");
  document.querySelector(".last-op").classList.remove("broken-text");
  document.querySelector(".container").classList.remove("broken-container");
  document.querySelector(".current").innerText = "";
  document.querySelector(".last").innerText = "";
}

//-----------------------------------------------------------------------------
//PARTIAL INITIALISE (C)
//-----------------------------------------------------------------------------

function partialInitialiseHandler() {

  inputNumber = "";
  decimalInserted = false;
  toggleSign = 1;
  document.querySelector(".current").innerText = "";

}

//-----------------------------------------------------------------------------
//INPUT NUMBER HANDLER - incuding decimal place placement logic.
//-----------------------------------------------------------------------------

function inputNumberHandler(input) {

  if ((input == ".") && (decimalInserted == false)) {

    if (inputNumber == "") {

      inputNumber = "0.";
      decimalInserted = true;

    } else {

      inputNumber += ".";
      decimalInserted = true;

    }

  } else if (input !== ".") {

    inputNumber += input;

  }

  acc1 = Number(inputNumber);
  signChangeHandler(inputNumber);

}

//-----------------------------------------------------------------------------
//SIGN CHANGE HANDLER
//-----------------------------------------------------------------------------

function signChangeHandler(input) {

  if ((toggleSign == -1) && (Math.sign(acc1) == 1)) {

    toggleSign = 1;
    acc1 *= -1;
    inputNumber = "-" + inputNumber;

  } else if (((toggleSign == -1) && (Math.sign(acc1) == -1))) {

    toggleSign = 1;
    acc1 *= -1;
    inputNumber = inputNumber.replace("-", "");

  } else if ((toggleSign == 1) && (Math.sign(acc1) == 1)) {

    inputNumber = inputNumber.replace("-", "");

  }

  currentDisplayHandler(inputNumber);
}

//-----------------------------------------------------------------------------
//OPERATION SELECTION LOGIC
//-----------------------------------------------------------------------------

function operationHandler(input) {

  ///////////////STATE 1///////////////////////////////////////////////////////

  if (operationState == 1) {

    if (input == "=") {

      operationState = 1;
      acc2 = acc1;
      lastDisplayHandler(negativeNumberDisplay(acc2));
      inputNumber = "";
      currentDisplayHandler(inputNumber);
      decimalInserted = false;


    } else {

      operationState = 2;
      acc2 = acc1;
      lastDisplayHandler(negativeNumberDisplay(acc2) + " " + operator);
      inputNumber = "";
      currentDisplayHandler(inputNumber);
      lastOperator = operator;
      operator = "";
      decimalInserted = false;

    }

    /////////////////STATE 2////////////////////////////////////////////////////

  } else if (operationState == 2) {

    if (input == "=") {

      operationState = 4;
      mathsHandler(lastOperator);
      lastDisplayHandler(negativeNumberDisplay(acc2) + " " + lastOperator + " " + negativeNumberDisplay(acc1) + " = ");
      currentDisplayHandler(acc3.toString());
      inputNumber = "";
      lastOperator = "";
      decimalInserted = false;

    } else {

      operationState = 3;
      mathsHandler(lastOperator);
      lastDisplayHandler(negativeNumberDisplay(acc3) + " " + operator);
      acc2 = acc3;
      acc3 = 0;
      inputNumber = "";
      currentDisplayHandler(inputNumber);
      decimalInserted = false;

    }

    ///////////////STATE 3/////////////////////////////////////////////////////

  } else if (operationState == 3) {

    if (input == "=") {

      operationState = 4;
      mathsHandler(lastOperator);
      lastDisplayHandler(negativeNumberDisplay(acc2) + " " + lastOperator + " " + negativeNumberDisplay(acc1) + " = ");
      currentDisplayHandler(acc3.toString());
      acc1 = 0;
      inputNumber = "";
      lastOperator = "";
      decimalInserted = false;

    } else {

      operationState = 3;
      mathsHandler(lastOperator);
      lastOperator = operator;
      lastDisplayHandler(negativeNumberDisplay(acc3) + " " + operator);
      acc2 = acc3;
      acc3 = 0;
      inputNumber = "";
      currentDisplayHandler(inputNumber);
      decimalInserted = false;

    }

    ///////////////STATE 4/////////////////////////////////////////////////////

  } else if (operationState == 4) {

    if (input == "=") {

      operationState = 1;
      lastDisplayHandler(negativeNumberDisplay(acc3));
      acc1 = 0;
      inputNumber = "";
      currentDisplayHandler(inputNumber);
      decimalInserted = false;

    } else {

      operationState = 3;
      mathsHandler(lastOperator);
      lastOperator = operator;
      lastDisplayHandler(negativeNumberDisplay(acc3) + " " + operator);
      acc2 = acc3;
      acc3 = 0;
      inputNumber = "";
      currentDisplayHandler(inputNumber);
      decimalInserted = false;

    }

  }

}

//-----------------------------------------------------------------------------
//MATHEMATICAL OPERATION LOGIC
//-----------------------------------------------------------------------------

function mathsHandler(input) {

  let truncate = "";

  if (input == "+") {
    acc3 = acc2 + acc1;
  } else if (input == "-") {
    acc3 = acc2 - acc1;
  } else if (input == "*") {
    acc3 = acc2 * acc1;
    if ((acc2.toString().includes(".")) && (acc2.toString().includes("."))) {
      truncate = acc1.toString().split(".")[1].length + acc2.toString().split(".")[1].length;
      acc3 = Number(acc3.toString().split(".")[0] + "." + acc3.toString().split(".")[1].slice(0, truncate));
    } else {
      acc3 = acc3;
    }
  } else if (input == "/") {
    if (acc1 == 0) {
      divideByZero = true;
    } else {
      acc3 = acc2 / acc1;
    }
  } else if (input == "%") {
    acc3 = acc2 % acc1;
  }
}

//-----------------------------------------------------------------------------
//INSERT PARENTHESIS FOR NEGATIVE NUMBERS ON LAST OPERATION DISPLAY
//-----------------------------------------------------------------------------

function negativeNumberDisplay(input) {

  if (input < 0) {
    return "(" + input.toString() + ")";
  } else {
    return input.toString();
  }

}

//-----------------------------------------------------------------------------
//CURRENT OPERATION DISPLAY
//-----------------------------------------------------------------------------

function currentDisplayHandler(input) {

  if (divideByZero == true) {
    document.querySelector(".current").innerText = "Please press CE to reset.";
    document.querySelector(".current-op").classList.add("broken-text");
    document.querySelector(".container").classList.add("broken-container");
  } else {
    if (input.length < 33) {
      document.querySelector(".current").innerText = input;
    } else {
      input = input.slice(0, 30);
      input = "..." + input;
      document.querySelector(".current").innerText = input;
    }

  }
}

//-----------------------------------------------------------------------------
//LAST OPERATION DISPLAY
//-----------------------------------------------------------------------------

function lastDisplayHandler(input) {

  if (divideByZero == true) {

    document.querySelector(".last").innerText = "DIVIDE BY ZERO ERROR";
    document.querySelector(".last-op").classList.add("broken-text");

  } else {

    if (input.length < 33) {

      document.querySelector(".last").innerText = input;

    } else {

      input = input.slice(0, 30);
      input = "..." + input;
      document.querySelector(".last").innerText = input;

    }

  }

}
