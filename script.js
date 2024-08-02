/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 白日_Asun. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

window.onload = () => {
    const Total_number = 200; // 在这里更改一共有多少抽奖人数
    const enemies = [-1]; // 填入你不希望中奖的序号，数组，-1为不启用
    const specialNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 特殊号码数组，指定哪些号码可以多次中奖
    const excludeRangeStart = -1; // 排除数字范围的开始，-1为不启用
    const excludeRangeEnd = -1; // 排除数字范围的结束，-1为不启用

    const startButton = document.getElementById('start-button');
    const lotteryNumber = document.getElementById('lottery-number');
    const drawNumber = document.getElementById("draw-number");
    const numberToDrawInput = document.getElementById("number-to-draw");
    const wonNumbers = document.getElementById("won-numbers");

    let numbers = Array.from({ length: Total_number }, (_, i) => i + 1)
        .filter(n => !enemies.includes(n) && !(n >= excludeRangeStart && n <= excludeRangeEnd)); // 创建数组

    let drawCount = 0; // 抽奖次数
    let wonNumbersList = [];
    let interval;

    startButton.onclick = () => {
        const numberToDraw = parseInt(numberToDrawInput.value, 10) || i;
        if (numbers.length === 0 && specialNumbers.length === 0) {
            alert("所有编号已经抽完了呦ଘ(੭ˊᵕˋ)੭");
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

            for (let i = 0; i < numberToDraw; i++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                let winningNumber = numbers[randomIndex];

                // 如果中奖号码是特殊号码，则不移除它
                if (!specialNumbers.includes(winningNumber)) {
                    numbers.splice(randomIndex, 1); // 移除已中奖的非特殊号码
                }

                winningNumbers.push(winningNumber);
            }

            wonNumbersList.push(...winningNumbers);
            lotteryNumber.textContent = winningNumbers.join('，'); // 在回调函数之前调用
            wonNumbers.textContent = `已抽到号码：${wonNumbersList.join('、')}`;
            // alert(`中奖编号是: ${winningNumbers.join(',')}`);
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