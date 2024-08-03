


/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 白日_Asun. All rights reserved.
 *--------------------------------------------------------------------------------------------*/



window.onload = () => {



    const Total_number = 50; // 在这里更改一共有多少抽奖人数
    let maxWins = 2; // 每人最大中奖次数



    //创建画布元素
    const numberToDrawInput = document.getElementById("number-to-draw");
    const startButton = document.getElementById('start-button');
    const lotteryNumber = document.getElementById('lottery-number');
    const drawNumber = document.getElementById("draw-number");
    const wonNumbers = document.getElementById("won-numbers");



    // 创建所有可能的抽奖号码数组
    const enemies = [-1];
    let numbers = Array.from({ length: Total_number }, (_, i) => i + 1).filter(n => !enemies.includes(n));
    let drawCount = 0; // 抽奖轮次
    let wonNumbersList = [];
    let winCounts = Array(Total_number).fill(0); // 记录每个号码的中奖次数



    const specialNumbers = [
        { number: 25, rounds: [3, 8] },
        { number: 3, rounds: [4, 8] }
    ];


    let specialWinCounts = {}; // 记录特殊号码的中奖轮次和次数
    specialNumbers.forEach(special => {
        specialWinCounts[special.number] = 0;
    });

    startButton.onclick = () => {
        
        const numberToDraw = parseInt(numberToDrawInput.value, 10) || 1;

        if (numbers.length === 0) {
            alert("所有编号已经抽完了ଘ(੭ˊᵕˋ)੭");
            return;
        }

        if (numbers.filter(n => winCounts[n - 1] < maxWins).length < numberToDraw) {
            alert("剩余码码不够抽奖了ଘ(੭ˊᵕˋ)੭");
            return;
        }

        drawCount++;
        drawNumber.textContent = `抽奖轮次：${drawCount}`;

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
            let availableNumbers = numbers.filter(n => winCounts[n - 1] < maxWins);

            // 检查特殊号码是否在当前轮次中奖
            specialNumbers.forEach(special => {
                if (special.rounds.includes(drawCount) && specialWinCounts[special.number] < special.rounds.length) {
                    specialWinners.push(special.number);
                    specialWinCounts[special.number]++;
                }
            });

            // 补充普通号码直到达到抽奖数目
            for (let i = 0; i < numberToDraw - specialWinners.length; i++) {
                const winningNumber = availableNumbers.splice(Math.floor(Math.random() * availableNumbers.length), 1)[0];
                nonSpecialWinners.push(winningNumber);
                winCounts[winningNumber - 1]++;
            }

            // 将特殊中奖号码和普通中奖号码混合，并随机打乱顺序
            let winningNumbers = specialWinners.concat(nonSpecialWinners);
            for (let i = winningNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [winningNumbers[i], winningNumbers[j]] = [winningNumbers[j], winningNumbers[i]];
            }

            wonNumbersList.push(...winningNumbers);
            lotteryNumber.textContent = winningNumbers.join('，');
            wonNumbers.textContent = `已抽到号码：${wonNumbersList.join('、')}`;

        }, 400); // 3秒后停止
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