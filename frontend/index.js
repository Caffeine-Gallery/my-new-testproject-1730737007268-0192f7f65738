import { backend } from 'declarations/backend';

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const display = document.getElementById('display');

function updateDisplay() {
    display.textContent = displayValue;
}

function clearCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        performCalculation(inputValue);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

async function performCalculation(secondOperand) {
    let result;

    try {
        switch (operator) {
            case '+':
                result = await backend.add(firstOperand, secondOperand);
                break;
            case '-':
                result = await backend.subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = await backend.multiply(firstOperand, secondOperand);
                break;
            case '/':
                result = await backend.divide(firstOperand, secondOperand);
                break;
            default:
                return;
        }

        displayValue = String(result);
        firstOperand = result;
    } catch (error) {
        displayValue = 'Error';
    }

    updateDisplay();
}

document.querySelector('.keypad').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.dataset.action === 'number') {
        inputDigit(target.textContent);
    }
    if (target.dataset.action === 'decimal') {
        inputDecimal();
    }
    if (target.dataset.action === 'operator') {
        handleOperator(target.textContent);
    }
    if (target.dataset.action === 'clear') {
        clearCalculator();
    }
    if (target.dataset.action === 'calculate') {
        if (operator && !waitingForSecondOperand) {
            performCalculation(parseFloat(displayValue));
            operator = null;
        }
    }
});

updateDisplay();
