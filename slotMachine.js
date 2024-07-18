document.addEventListener('DOMContentLoaded', (event) => {
    const ROWS = 3;
    const COLS = 3;
    const SYMBOLS_COUNT = {
        A: 4,
        B: 6,
        C: 8,
        D: 10
    };
    const SYMBOLS_VALUES = {
        A: 20,
        B: 10,
        C: 5,
        D: 0
    };

    let depositBtn = document.getElementById('setDesposit')
    let Adeposit = document.getElementById('Adeposit')
    let lineBtn = document.getElementById('setLines')
    let Aline = document.getElementById('Aline')
    let betBtn = document.getElementById('placeBet')
    let Abet = document.getElementById('Abet')
    let spinBtn = document.getElementById('spinBtn')

    let balance = 0;
    let numberOfLines = 0; 
    let betAmount = 0;



    depositBtn.onclick = function() {
        const depositAmount = parseFloat(document.getElementById("depositAmount").value);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            Adeposit.style.display = "block";
            setTimeout(() => {
                Adeposit.style.display = "none";   
            }, 3000);
        } else {
            balance = depositAmount;
            alert("Deposit successful. Your balance is $" + balance);
        }
    }


    
    lineBtn.onclick = function() {
        const lines = parseFloat(document.getElementById("numberOfLines").value);
        if (isNaN(lines) || lines <= 0 || lines > 3) {
            Aline.style.display = "block";
            setTimeout(() => {
                Aline.style.display = "none";   
            }, 3000);
        } else {
            numberOfLines = lines;
            alert("You have selected " + numberOfLines + " lines.");
        }
    }


    betBtn.onclick = function() {
        const bet = parseFloat(document.getElementById("betAmount").value);
        if (isNaN(bet) || bet <= 0 || bet > balance / numberOfLines) {
            Abet.style.display = "block";
            setTimeout(() => {
                Abet.style.display = "none";   
            }, 3000);
        } else {
            betAmount = bet;
            alert("Bet placed: $" + betAmount + " per line.");
        }
    }



    spinBtn.onclick = function() {
        if (balance <= 0) {
            alert("You ran out of money!");
            return;
        }

        balance -= betAmount * numberOfLines;
        const reels = generateReels();
        const rows = transpose(reels);
        displayReels(rows);

        const winnings = getWinnings(rows, betAmount, numberOfLines);
        balance += winnings;

        let resultMessage = "You won $" + winnings.toString() + "! Your new balance is $" + balance + ".";
        if (balance <= 0) {
            resultMessage += " You ran out of money!";
        }
        document.getElementById("gameResult").innerText = resultMessage;
    }

    function generateReels() {
        const symbols = [];
        for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
            for (let i = 0; i < count; i++) {
                symbols.push(symbol);
            }
        }

        const reels = [];
        for (let i = 0; i < COLS; i++) {
            reels.push([]);
            const reelSymbols = [...symbols];
            for (let j = 0; j < ROWS; j++) {
                const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                const selectedSymbol = reelSymbols[randomIndex];
                reels[i].push(selectedSymbol);
                reelSymbols.splice(randomIndex, 1);
            }
        }
        return reels;
    }

    

    function transpose(reels) {
        const rows = [];
        for (let i = 0; i < ROWS; i++) {
            rows.push([]);
            for (let j = 0; j < COLS; j++) {
                rows[i].push(reels[j][i]);
            }
        }
        return rows;
    }

    function displayReels(rows) {
        const slotReels = document.getElementById("slotReels");
        slotReels.innerHTML = "";
        for (const row of rows) {
            let rowString = "";
            for (const [i, symbol] of row.entries()) {
                rowString += symbol;
                if (i != row.length - 1) {
                    rowString += " | ";
                }
            }
            const rowDiv = document.createElement("div");
            rowDiv.innerText = rowString;
            slotReels.appendChild(rowDiv);
        }
    }

    function getWinnings(rows, bet, lines) {
        let winnings = 0;
        for (let row = 0; row < lines; row++) {
            const symbols = rows[row];
            let allSame = true;
            for (const symbol of symbols) {
                if (symbol != symbols[0]) {
                    allSame = false;
                    break;
                }
            }
            if (allSame) {
                winnings += bet * SYMBOLS_VALUES[symbols[0]];
            }
        }
        return winnings;
    }


})
