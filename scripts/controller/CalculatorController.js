class CalculatorController {
    constructor() {
        this._operations = [];
        this._locale = 'pt-BR';
        this._displayElement = document.querySelector('#display');
        this._hourElement = document.querySelector('#hora');
        this._dateElement = document.querySelector('#data');
        this._lastOperationElement = document.querySelector('#lastOperation');
        this._currentDate;
        this.initialize();
    }

    initialize() {
        this.initializeButtonsEvents();
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    clearAll() {
        this.display = 0;
        this._operations = [];
    }

    clearEntry() {
        this._operations.pop();
    }

    addOperation(value) {
        if (this._operations.length === 0) {
            this._operations.push(value);
            this.display = value;
            return;
        }
        
        if (!isNaN(this.getLastOperation())) {
            let operation = this.getLastOperation() + value;
            if (operation.length > 10) {
                this.display = 'Error';
                return;
            }
            this.setLastOperation(operation);
            this.display = operation;
        } else {
            this.display = value;
            this._operations.push(value);
        }
    }

    addOperator(operator) {
        if (this._operations.length === 0) {
            this._operations.push(0);
        }

        if (this.isOperator(this.getLastOperation())) {
            this.setLastOperation(operator);
            return;
        }

        if (this._operations.length === 3) {
            this.doOperation(this._operations);
        }

        this._operations.push(operator);
    }

    doOperation(operators) {
        this.lastOperation = operators.join('');
        if (operators.length < 3) {
            return;
        }

        if (operators[1] === '%') {
            this.doPercentage(operators);
            return;
        }

        let result = eval(this.lastOperation);
        this.setFinalResult(result, operators[1]);
    }

    doPercentage(operators) {
        let result = (parseInt(operators[2]) * parseInt(operators[0])) / 100;
        this.setFinalResult(result, operators[1]);
    }

    setFinalResult(value, lastOperator) {
        this._operations = [];
        this._operations.push(value, lastOperator);
        this.display = parseFloat(value).toFixed(2).split('.')[1] == '00' ? parseInt(value) : parseFloat(value).toFixed(2);
    }

    isOperator(value) {
        return ['+', '-', '*', '/', '%'].includes(value);
    }

    getLastOperation() {
        return this._operations[this._operations.length - 1];
    }

    setLastOperation(value) {
        this._operations[this._operations.length -1] = value;
    }

    initializeButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons g, #parts g');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                let audio = new Audio('../click.mp3');
                audio.play();
                let btn = e.target.parentNode.className.baseVal.replace('btn-', '');
                this.execButton(btn);
            })
        })
    }

    execButton(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperator('+');
                break;
            case 'subtracao':
                this.addOperator('-');
                break;
            case 'divisao':
                this.addOperator('/');
                break;
            case 'multiplicacao':
                this.addOperator('*');
                break;
            case 'porcento':
                this.addOperator('%');
                break;
            case 'igual':
                this.doOperation(this._operations);
                break;
            case 'ponto':
                this.addOperation('.');
                break;
            default:
                this.addOperation(value);
        }
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get display() {
        return this._displayElement.innerHTML;
    }

    set display(value) {
        this._displayElement.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    get displayTime() {
        return this._hourElement.innerHTML;
    }

    set displayTime(value) {
        this._hourElement.innerHTML = value;
    }

    get displayDate() {
        return this._dateElement.innerHTML;
    }

    set displayDate(value) {
        this._dateElement.innerHTML = value;
    }

    get lastOperation() {
        return this._lastOperationElement.innerHTML;
    }

    set lastOperation(value) {
        this._lastOperationElement.innerHTML = value;
    }
}