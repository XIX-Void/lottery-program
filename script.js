/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 白日_Asun. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

window.onload = () => {
    const Total_number = 50; // 在这里更改一共有多少抽奖人数
    const enemies = [-1]; // 填入你不希望中奖的序号，数组，-1为不启用

    // 新增特殊号码和中奖轮次的定义
    const specialNumbers = [
        { number: 1, rounds: [1, 3] }, // 第一个特殊号码在第八轮和第十轮中奖
        { number: 2, rounds: [2, 5] }   // 第二个特殊号码在第二轮和第五轮中奖
    ];

    // 最大中奖次数接口，默认为2次
    let maxWins = 2;
    const numberToDrawInput = document.getElementById("number-to-draw");
    const startButton = document.getElementById('start-button');
    const lotteryNumber = document.getElementById('lottery-number');
    const drawNumber = document.getElementById("draw-number");
    const wonNumbers = document.getElementById("won-numbers");

    // 创建所有可能的抽奖号码数组
    let numbers = Array.from({ length: Total_number }, (_, i) => i + 1).filter(n => !enemies.includes(n));

    let drawCount = 0; // 抽奖轮次
    let wonNumbersList = [];
    let winCounts = Array(Total_number).fill(0); // 记录每个号码的中奖次数

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

            let winningNumbers = [];

            // 检查特殊号码是否在当前轮次中奖
            specialNumbers.forEach(special => {
                if (special.rounds.includes(drawCount) && winCounts[special.number - 1] < maxWins) {
                    winningNumbers.push(special.number);
                    winCounts[special.number - 1]++;
                }
            });

            // 补充普通号码
            for (let i = winningNumbers.length; i < numberToDraw; i++) {
                let availableNumbers = numbers.filter(n => winCounts[n - 1] < maxWins);
                const winningNumber = availableNumbers.splice(Math.floor(Math.random() * availableNumbers.length), 1)[0];
                winningNumbers.push(winningNumber);
                winCounts[winningNumber - 1]++;
            }

            // 将特殊号码放置在中奖组的随机位置
            specialNumbers.forEach(special => {
                if (special.rounds.includes(drawCount)) {
                    let index = winningNumbers.indexOf(special.number);
                    if (index !== -1) {
                        winningNumbers.splice(index, 1); // 移除原始位置
                        let randomIndex = Math.floor(Math.random() * winningNumbers.length);
                        winningNumbers.splice(randomIndex, 0, special.number); // 插入随机位置
                    }
                }
            });

            wonNumbersList.push(...winningNumbers);
            lotteryNumber.textContent = winningNumbers.join('，');
            wonNumbers.textContent = `已抽到号码：${wonNumbersList.join('、')}`;

        }, 3000); // 3秒后停止
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