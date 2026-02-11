// //

let homePage = document.querySelector(".home-page");
let teamOneNameIn = document.querySelector(".team-one input");
let teamTwoNameIn = document.querySelector(".team-two input");
let homeNextBtn = document.querySelector(".home-page > button");
let QTargetIn = document.getElementById("q-target");

let teamOneName;
let teamTwoName;
let QTarget;

// // // // // // // // // // // //

let QPage = document.querySelector(".environment-page .q-page");
let QPageQuestion = document.querySelector(
  ".environment-page .q-page .question p",
);
let QPageOptions = document.querySelector(".environment-page .q-page .options");

let teamOnePoints = document.querySelector(
  ".environment-page aside .team-one span",
);
teamOnePoints.textContent = 0;
let teamTwoPoints = document.querySelector(
  ".environment-page aside .team-two span",
);
teamTwoPoints.textContent = 0;

let teamOneQCounter = document.querySelector(
  ".environment-page aside .team-one h2",
);
let TeamOneAnswerd = 0;

let teamTwoQCounter = document.querySelector(
  ".environment-page aside .team-two h2",
);
let TeamTwoAnswerd = 0;

let chooseLevelBtns = document.querySelectorAll(
  ".environment-page .play-home .choose-q button",
);

let teamOneContainer = document.querySelector(
  ".environment-page aside .team-one",
);
let teamTwoContainer = document.querySelector(
  ".environment-page aside .team-two",
);

let timer = document.querySelector(".environment-page .q-page .timer");
let timerAlert = document.querySelector(".end-time");
let timerCounter = 360;

let timerSound = document.getElementById("timer-sound");
timerSound.currentTime = 0;
let correctSound = document.getElementById("correct-sound");
correctSound.currentTime = 1.7;
let falseSound = document.getElementById("false-sound");
falseSound.currentTime = 1.5;

let winPage = document.querySelector(".container .winning-page");
let winPageWinner = document.querySelector(".container .winning-page h1");
let winPageH2 = document.querySelector(".container .winning-page h2");
let winPageP = document.querySelector(".container .winning-page p");

//

homeNextBtn.addEventListener("click", function () {
  if (teamOneNameIn.value === "") {
    teamOneName = "الفريق الأول";
  } else {
    teamOneName = teamOneNameIn.value;
  }

  if (teamTwoNameIn.value === "") {
    teamTwoName = "الفريق الثاني";
  } else {
    teamTwoName = teamTwoNameIn.value;
  }

  if (QTargetIn.value === "") {
    QTarget = 20;
  } else {
    QTarget = parseInt(QTargetIn.value);
  }

  teamOneQCounter.textContent = `1 / ${QTarget}`;
  teamTwoQCounter.textContent = `0 / ${QTarget}`;

  let taemOnePlayingName = document.querySelector(
    ".environment-page aside .team-one h1",
  );
  let taemTwoPlayingName = document.querySelector(
    ".environment-page aside .team-two h1",
  );

  taemOnePlayingName.textContent = teamOneName;
  taemTwoPlayingName.textContent = teamTwoName;
  homePage.classList.add("close");
});

// // // // //

let choosingPage = document.querySelector(".choose-category-page");
let chooseCategory = document.querySelector(".categories");
let error = document.querySelector(".erorr");
let startBtn = document.querySelector(".choose-category-page footer button");
categoriesSelected = 0;

let Q = [];

let easyQ = [];
let normalQ = [];
let hardQ = [];
let veryHardQ = [];

for (let i = 0; i < categoriesData.length; i++) {
  let category = document.createElement("div");
  category.classList.add("category");
  category.setAttribute("id", categoriesData[i].id);
  category.innerHTML = `
    <img src="${categoriesData[i].logo}" alt>
    <span>${categoriesData[i].category}</span>`;
  category.addEventListener("click", function () {
    if (categoriesSelected < 6) {
      categoriesSelected++;
      category.classList.add("selected");
    } else return;
  });
  chooseCategory.appendChild(category);
}

let categories = chooseCategory.querySelectorAll(".category");

startBtn.addEventListener("click", function () {
  updateTurnUI();
  // تصفير المصفوفة في كل مرة نضغط فيها "ابدأ" لتجنب التكرار
  Q = [];

  categories.forEach((c) => {
    if (c.classList.contains("selected")) {
      // نبحث في البيانات الأصلية عن العنصر الذي يطابق الـ id الخاص بالبطاقة المختارة
      let foundCategory = categoriesData.find((item) => item.id === c.id);

      if (foundCategory) {
        // إضافة الأسئلة (q) الخاصة بهذا القسم إلى مصفوفة الأسئلة الكلية
        // استخدمت spread operator (...) عشان تنزل الأسئلة كعناصر منفردة مو مصفوفة داخل مصفوفة
        Q.push(...foundCategory.q);
      }
    }
  });

  if (Q.length === 0) {
    error.classList.add("active");
    setTimeout(() => {
      error.classList.remove("active");
    }, 2000);
  } else {
    choosingPage.classList.add("close");
  }

  for (let i = 0; i < Q.length; i++) {
    if (Q[i].difficulty === "سهل") {
      easyQ.push(Q[i]);
    } else if (Q[i].difficulty === "متوسط") {
      normalQ.push(Q[i]);
    } else if (Q[i].difficulty === "صعب") {
      hardQ.push(Q[i]);
    } else if (Q[i].difficulty === "صعب جداً") {
      veryHardQ.push(Q[i]);
    }
  }
});

// المتغيرات المطلوبة (تأكد أنها خارج الـ loop)
let turn = 1;

function updateTurnUI() {
  // تحديث العدادات فوراً
  if (turn === 1) {
    TeamOneAnswerd++;
    teamOneQCounter.textContent = `${TeamOneAnswerd} / ${QTarget}`;
    teamOneContainer.classList.add("active");
    teamTwoContainer.classList.remove("active");
  } else {
    TeamTwoAnswerd++;
    teamTwoQCounter.textContent = `${TeamTwoAnswerd} / ${QTarget}`;
    teamOneContainer.classList.remove("active");
    teamTwoContainer.classList.add("active");
  }
}

chooseLevelBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    timerSound.play();
    let QData;
    let targetArray;

    if (btn.id === "easy") targetArray = easyQ;
    else if (btn.id === "normal") targetArray = normalQ;
    else if (btn.id === "hard") targetArray = hardQ;
    else if (btn.id === "very-hard") targetArray = veryHardQ;

    if (!targetArray || targetArray.length === 0) {
      alert("انتهت الأسئلة في هذا المستوى!");
      return;
    }

    let qNum = Math.floor(Math.random() * targetArray.length);
    QData = targetArray.splice(qNum, 1)[0];

    QPageQuestion.textContent = QData.question;
    QPageOptions.innerHTML = "";

    QData.options.forEach((optionText) => {
      let op = document.createElement("button");
      op.textContent = optionText;

      op.addEventListener("click", function () {
        // --- إيقاف كل شيء متعلق بالوقت فوراً ---
        clearInterval(timing);
        timerSound.pause();
        timerSound.currentTime = 0;
        QPageOptions.style.pointerEvents = "none";

        // 1. فحص الإجابة
        if (op.textContent === QData.answer) {
          op.classList.add("true");
          correctSound.play();
          setTimeout(() => {
            correctSound.pause();
            correctSound.currentTime = 1.7;
          }, 3000);
          if (turn === 1) {
            teamOnePoints.textContent =
              Number(teamOnePoints.textContent) + QData.points;
          } else {
            teamTwoPoints.textContent =
              Number(teamTwoPoints.textContent) + QData.points;
          }
        } else {
          op.classList.add("false");
          falseSound.play();
          setTimeout(() => {
            falseSound.pause();
            falseSound.currentTime = 1.5;
          }, 3000);
        }

        // 2. تبديل الدور (Turn)
        turn = turn === 1 ? 2 : 1;

        // 3. الانتظار لمشاهدة النتيجة ثم التقرير (فوز أو استمرار)
        setTimeout(() => {
          QPage.classList.remove("opened");
          QPageOptions.style.pointerEvents = "auto";

          // فحص الفوز: إذا خلصت أسئلة الفريقين
          if (TeamOneAnswerd >= QTarget && TeamTwoAnswerd >= QTarget) {
            showWinningPage();
          } else {
            updateTurnUI();
          }
        }, 4000);
      });
      QPageOptions.appendChild(op);
    });

    QPage.classList.add("opened");
    startTimer();
  });
});
// دالة الفوز (خارج الـ loop)
function showWinningPage() {
  clearInterval(timing); // إيقاف التايمر نهائياً

  let p1 = Number(teamOnePoints.textContent);
  let p2 = Number(teamTwoPoints.textContent);

  let winnerTeam, winnerBg, resultText;

  if (p1 > p2) {
    // فوز الفريق الأول
    winPageP.textContent = "مبروك الفوز لفريق !";
    winnerTeam = teamOneName;
    winnerBg = "var(--team1-light)";
    resultText = `بنتيجة ${p1} مقابل ${p2} لفريق ${teamTwoName}`;
  } else if (p2 > p1) {
    // فوز الفريق الثاني
    winPageP.textContent = "مبروك الفوز لفريق !";
    winnerTeam = teamTwoName;
    winnerBg = "var(--team2-light)";
    resultText = `بنتيجة ${p2} مقابل ${p1} لفريق ${teamOneName}`;
  } else {
    // حالة التعادل - هذا طلبك
    winPageP.textContent = "";
    winnerTeam = "تعادل";
    winnerBg = "#646464"; // لون محايد للتعادل
    resultText = `تساوى الفريقان بنتيجة ${p1} لكل منهما`;
  }

  // تحديث محتوى الصفحة
  winPageWinner.textContent = winnerTeam; // سيعرض "تعادل" في الـ h1
  winPageH2.textContent = resultText;
  winPage.style.background = winnerBg;

  // إظهار صفحة الفوز وتثبيتها
  winPage.classList.add("open");
  winPage.style.display = "flex";
  winPage.style.zIndex = "9999";
}

let timing; // تعريف المتغير في النطاق العام

function startTimer() {
  clearInterval(timing);
  let timeLeft = 20;
  timer.textContent = timeLeft;
  timerCounter = 360;

  timing = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    timerCounter -= 18;

    timer.style.background = `conic-gradient(var(--accent-gold-light) 0deg ${timerCounter}deg, transparent ${timerCounter}deg 360deg)`;

    if (timeLeft <= 0) {
      clearInterval(timing);
      timerAlert.classList.add("open");
      timerSound.pause();
      timerSound.currentTime = 0;

      turn = turn === 1 ? 2 : 1;

      setTimeout(() => {
        timerAlert.classList.remove("open");
        QPage.classList.remove("opened");

        if (TeamOneAnswerd >= QTarget && TeamTwoAnswerd >= QTarget) {
          showWinningPage();
        } else {
          updateTurnUI();
        }
      }, 3000);
    }
  }, 1000);
}
