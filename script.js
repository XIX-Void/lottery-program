


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 白日_Asun. All rights reserved.
 *--------------------------------------------------------------------------------------------*/



window.onload = () => {



    const Total_number = 1112; // 在这里更改一共有多少抽奖人数
    let maxWins = 2; // 每人最大中奖次数



    // 创建画布元素
    const numberToDrawInput = document.getElementById("number-to-draw");
    const drawRoundInput = document.getElementById("draw-round");
    const startButton = document.getElementById('start-button');
    const clearButton = document.getElementById('clear-button');
    const lotteryNumber = document.getElementById('lottery-number');
    const drawNumber = document.getElementById("draw-number");
    const wonNumbers = document.getElementById("won-numbers");



    // 创建所有可能的抽奖号码数组
    const enemies = [-1];
    let numbers = Array.from({ length: Total_number }, (_, i) => i + 1).filter(n => !enemies.includes(n));
    
    // 从 localStorage 加载保存的数据
    const loadSavedData = () => {
        const savedWonNumbers = localStorage.getItem('lottery_wonNumbers');
        const savedWinCounts = localStorage.getItem('lottery_winCounts');
        const savedDrawRound = localStorage.getItem('lottery_drawRound');
        
        if (savedWonNumbers) {
            wonNumbersList = JSON.parse(savedWonNumbers);
        } else {
            wonNumbersList = [];
        }
        
        if (savedWinCounts) {
            winCounts = JSON.parse(savedWinCounts);
            // 确保数组长度正确
            if (winCounts.length !== Total_number) {
                winCounts = Array(Total_number).fill(0);
            }
        } else {
            winCounts = Array(Total_number).fill(0);
        }
        
        if (savedDrawRound) {
            drawRoundInput.value = savedDrawRound;
            drawNumber.textContent = `抽奖轮次：${savedDrawRound}`;
        }
        
        // 更新已抽到号码的显示
        if (wonNumbersList.length > 0) {
            wonNumbers.textContent = `已抽到号码：${wonNumbersList.join('、')}`;
        }
    };
    
    // 保存数据到 localStorage
    const saveData = () => {
        localStorage.setItem('lottery_wonNumbers', JSON.stringify(wonNumbersList));
        localStorage.setItem('lottery_winCounts', JSON.stringify(winCounts));
        localStorage.setItem('lottery_drawRound', drawRoundInput.value);
    };
    
    let wonNumbersList = [];
    let winCounts = Array(Total_number).fill(0); // 记录每个号码的中奖次数
    
    // 初始化时加载保存的数据
    loadSavedData();

    
    const specialNumbers = [
        { number: 422, rounds: [2] },
        { number: 458, rounds: [2] }
    ];

    let specialWinRounds = {}; // 记录特殊号码的中奖轮次
    specialNumbers.forEach(special => {
        specialWinRounds[special.number] = special.rounds;
    });

    // 清除所有数据
    const clearAllData = () => {
        if (confirm("清除所有抽奖数据，此操作不可逆噢ଘ(੭ˊᵕˋ)੭")) {
            // 清除 localStorage
            localStorage.removeItem('lottery_wonNumbers');
            localStorage.removeItem('lottery_winCounts');
            localStorage.removeItem('lottery_drawRound');
            
            // 重置变量
            wonNumbersList = [];
            winCounts = Array(Total_number).fill(0);
            
            // 重置显示
            drawRoundInput.value = 1;
            drawNumber.textContent = `抽奖轮次：0`;
            lotteryNumber.textContent = '--';
            wonNumbers.textContent = '已抽到号码：';
            
            alert("数据没了噢ଘ(੭ˊᵕˋ)੭");
        }
    };

    // 绑定清除按钮事件
    clearButton.onclick = clearAllData;

    startButton.onclick = () => {
        const numberToDraw = parseInt(numberToDrawInput.value, 10) || 1;
        // 从输入框读取当前轮次
        let drawCount = parseInt(drawRoundInput.value, 10) || 1;

        if (numbers.filter(n => winCounts[n - 1] < maxWins).length === specialNumbers.length) {
            alert("所有编号已经抽完了ଘ(੭ˊᵕˋ)੭");
            return;
        }

        if (numbers.filter(n => winCounts[n - 1] < maxWins).length < numberToDraw + specialNumbers.length) {
            temp = numbers.filter(n => winCounts[n - 1] < maxWins).length - 2;
            alert("剩余码码不够抽奖了ଘ(੭ˊᵕˋ)੭，下次最大" + temp + "个~");
            return;
        }

        // 更新显示
        drawNumber.textContent = `抽奖轮次：${drawCount}`;
        console.log(`开始第${drawCount}轮抽奖`);

        let interval = setInterval(() => {
            let displayNumbers = [];
            for (let i = 0; i < numberToDraw; i++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                displayNumbers.push(numbers[randomIndex]);
            }
            lotteryNumber.textContent = displayNumbers.join('，');
        }, 100);

        setTimeout(() => {
            clearInterval(interval);

            let specialWinners = [];
            let nonSpecialWinners = [];
            let availableNumbers = numbers.filter(n => 
                winCounts[n - 1] < maxWins && !specialNumbers.some(special => special.number === n)
            );

            // 检查特殊号码是否在当前轮次中奖
            //console.log("检查特殊号码是否在当前轮次中奖");
            specialNumbers.forEach(special => {
                if (special.rounds.includes(drawCount)) {
                    specialWinners.push(special.number);
                    //console.log(`特殊号码${special.number}在第${drawCount}轮中奖`);
                }
            });

            // 如果单次抽取数量少于应该出现的特殊号码数量，则只保留排名在前的几个
            if (specialWinners.length > numberToDraw) {
                // 按号码大小排序，保留排名在前的numberToDraw个
                specialWinners.sort((a, b) => a - b);
                specialWinners = specialWinners.slice(0, numberToDraw);
            }

            // 补充普通号码直到达到抽奖数目
            let numSpecialWinners = specialWinners.length;
            for (let i = 0; i < numberToDraw - numSpecialWinners; i++) {
                const winningNumber = availableNumbers.splice(Math.floor(Math.random() * availableNumbers.length), 1)[0];
                nonSpecialWinners.push(winningNumber);
                winCounts[winningNumber - 1]++;
            }

            // 将特殊中奖号码和普通中奖号码分开处理，确保特殊号码不会重复
            let winningNumbers = specialWinners.concat(nonSpecialWinners);

            // 随机打乱中奖号码的顺序
            for (let i = winningNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [winningNumbers[i], winningNumbers[j]] = [winningNumbers[j], winningNumbers[i]];
            }

            // 更新中奖列表
            wonNumbersList.push(...winningNumbers);
            lotteryNumber.textContent = winningNumbers.join('，');
            wonNumbers.textContent = `已抽到号码：${wonNumbersList.join('、')}`;
            console.log(`第${drawCount}轮中奖号码：${winningNumbers.join('，')}`);

            // 抽奖完成后自动更新轮次（递增）
            drawCount++;
            drawRoundInput.value = drawCount;
            drawNumber.textContent = `抽奖轮次：${drawCount}`;
            
            // 保存数据到 localStorage
            saveData();

        }, 3000); // 0.3秒后停止
    };
};








function generateFeather() {
    const feather = document.createElement('div');
    feather.classList.add('feather');
    document.body.appendChild(feather);

    // 随机生成羽毛大小
    const size = Math.random() * 120 + 100;
    feather.style.width = `${size}px`;
    feather.style.height = `${size * 1.9}px`;

    // 设置羽毛的初始位置和动画参数
    feather.style.right = `${Math.random() * 100}%`;
    const animationDuration = Math.random() * 10 + 15; // 持续时间在10到20秒之间
    feather.style.animationDuration = `${animationDuration}s`;
    feather.style.animationDelay = `${Math.random() * 3}s`;

    // 生成唯一的飘落轨迹和旋转动画
    const index = Math.floor(Math.random() * 1000); // 生成一个较大的随机索引
    createUniqueAnimation(feather, index);

    // 在动画结束后移除羽毛
    setTimeout(() => {
        feather.remove();
    }, (animationDuration + 5) * 1000); // 确保动画完成后再移除
}

function createUniqueAnimation(feather, index) {
    const horizontalMove = -(window.innerWidth * 0.8 + Math.random() * window.innerWidth * 0.2); // 向左飘落
    const rotateAngle = Math.random() * 360;
    const verticalMove = window.innerHeight * 1.4;
    const animationName = `floatAndRotate${index}`;
    feather.style.animationName = animationName;

    const style = document.createElement('style');
    document.head.appendChild(style);
    const styleSheet = style.sheet;
    styleSheet.insertRule(`
        @keyframes ${animationName} {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(${horizontalMove}px, ${verticalMove}px) rotate(${rotateAngle}deg); }
        }
    `, styleSheet.cssRules.length);
}