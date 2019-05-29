import Question from './question';

import Fireworks from './animation/fireworks';

class Tests {
    constructor() {
        this.model = new Question();
        this.numberQuestions = [1, 2, 3, 4, 5, 6];
        this.countYes = 0;
        this.countNo = 0;
        this.questionNumber = 1;
        this.answeredQuestions = 0;
    }

    startTest() {
        if (this.numberQuestions.length === 0) {
            clearInterval(this.countdown);

            this.addUser();

            const body = document.body;

            body.innerHTML = `<div class='final'>
                 ${this.countYes >= 3 ? `<p>Вы победили!!!</p>
                                                      <p>Число правильных ответов: ${this.countYes}</p>
                                                      <p>Число неправильных ответов: ${this.countNo}</p>
                                                      <p>Число неотвеченных вопросов: ${this.answeredQuestions - this.countNo - this.countYes}</p>`
                : (this.countYes <= 3 || this.countNo >= 3) ? `<p>Увы, в этот раз не повезло</p>
                                                               <p>Число правильных ответов: ${this.countYes}</p>
                                                               <p>Число неправильных ответов: ${this.countNo}</p>
                                                               <p>Число неотвеченных вопросов: ${this.answeredQuestions - this.countNo - this.countYes}</p>` :
                    (this.countYes === 0 || this.countNo === 0) ? '<p>Так бывает</p>' : ''}                                                            
                              </div>
                              <canvas></canvas>`;

            let a = new Fireworks();
            a.run();
        } else {
            this.generateQuestion();
        }
    }


// Timer
    timer(seconds) {
        clearInterval(this.countdown);

        let now = Date.now(),
            then = now + seconds * 1000;

        this.displayTimeLeft(seconds);
        this.countdown = setInterval(() => {
            let secondsLeft = Math.round((then - Date.now()) / 1000);
            // check if we should stop it!
            if (secondsLeft < 0) {
                clearInterval(this.countdown);
                return;
            }
            // display it
            this.displayTimeLeft(secondsLeft);
        }, 1000);
    }

    displayTimeLeft(seconds) {
        let remainderSeconds = seconds % 60,
            display = `0:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`,
            timerDisplay = document.getElementsByClassName('timer__display')[0];
        document.title = display;
        timerDisplay.textContent = display;
    }

    startTimer() {
        this.timer(20);
    }

//


// Questions
    insertQuestions(rand) {
        this.model.giveQuestion().then(question => {
            this.question = question;
            const numb = rand - 1,
                info = this.question[numb][rand],
                text = this.question[numb][`text${rand}`],
                img = this.question[numb][`img${rand}`],
                answer = this.question[numb].answers,
                correctAnswer = this.question[numb].correctAnswer,
                questions = document.getElementsByClassName('questions')[0];

            questions.innerHTML = `<div class='question'>
                                               <h1>Вопрос №${this.questionNumber++}</h1>
                                               <h2>${text}</h2>
                           ${info === 'img' ? `<img src='${img}' alt=''>` : ''}
                           ${info === 'music' ? `<div class="sound">
                <p>Нажми чтобы услышать</p>               
            </div>
            <audio src="sound/guitar.mp3" id="audio"></audio>` : ''}
                                                                                              
                                               <div class='answers'>
                                               ${this.question[numb].answersImg ?
                `<img src='${this.question[numb].answersImg[0]}' alt='' data-img='1'>
                                                   <img src='${this.question[numb].answersImg[1]}' alt='' data-img='2'>
                                                   <img src='${this.question[numb].answersImg[2]}' alt='' data-img='3'>`
                :
                `<button value='1' >${answer[0]}</button>
                                                   <button value='2' >${answer[1]}</button>
                                                   <button value='3' >${answer[2]}</button>`}                                                   
                                               </div>
                                           </div>`;
            this.answeredQuestions++;

            if (info === 'music') {
                const sound = document.getElementsByClassName('sound')[0],
                    audio = document.getElementById('audio');

                sound.addEventListener('click', () => {
                    audio.currentTime = 0;
                    audio.play();
                    sound.classList.add('playing');
                });
            }

            const answers = document.body.getElementsByClassName('answers')[0],
                answersButton = answers.getElementsByTagName('button'),
                answersImg = answers.getElementsByTagName('img');

            if (answersButton) {
                for (let i = 0; i < answersButton.length; i++) {
                    let a = answersButton[i].getAttribute('value');
                    if (a === correctAnswer) {
                        answersButton[i].setAttribute('data-id', 'correctAnswer');
                    }
                }
            }
            if (answersImg) {
                for (let i = 0; i < answersImg.length; i++) {
                    let a = answersImg[i].getAttribute('data-img');
                    if (a === correctAnswer) {
                        answersImg[i].setAttribute('data-id', 'correctAnswer');
                    }
                }
            }

            this.delegation(answers, answersButton, info);
        });
    }

//


// Randomizer
    generateQuestion() {
        clearInterval(this.timerId);
        let i = Math.floor(Math.random() * this.numberQuestions.length);
        let rand = this.numberQuestions[i];
        this.numberQuestions.splice(i, 1);
        this.random(rand);
    }

    random(rand) {
        let animationTimer,
            duration = 5000,
            started = new Date().getTime();

        const timer = document.getElementsByClassName('timer')[0],
            random = document.getElementsByClassName('random')[0],
            loader = document.getElementsByClassName('loader')[0];

        this.model.giveQuestion().then(question => {
            this.question = question;
        });

        animationTimer = setInterval(() => {
            const numb = rand - 1,
                questions = document.getElementsByClassName('questions')[0];

            if (new Date().getTime() - started > duration) {
                random.innerHTML = this.question[numb][`QuestionOn${rand}`];
                clearInterval(animationTimer);

                setTimeout(() => {
                    loader.classList.add('none');
                    random.classList.add('none');
                    questions.classList.remove('none');
                    this.insertQuestions(rand);
                    timer.classList.remove('none');
                    this.startTimer();
                    this.startInterval();
                }, 1000);
            } else {
                loader.classList.remove('none');
                random.classList.remove('none');
                let index = Math.floor(1 + Math.random() * 6);

                try {
                    random.innerHTML = this.question[index - 1][`QuestionOn${index}`];
                    questions.classList.add('none');
                    timer.classList.add('none');
                } catch (error) {
                    loader.classList.add('none');
                    random.classList.add('none');
                    clearInterval(animationTimer);
                    this.showError();
                }

            }
        }, 150);
    }

//


// Delegation
    delegation(answers, answersButton, info) {
        answers.addEventListener('click', event => {
            let target = event.target; // where was the click?

            if (target.dataset.id === 'correctAnswer' && (target.tagName === 'BUTTON' || target.tagName === 'IMG')) {
                target.classList.add('correctAnswer');

                if (info === 'music') {
                    const audio = document.getElementById('audio');
                    audio.pause();
                }

                for (let i = 0; i < answersButton.length; i++) {
                    answersButton[i].disabled = true;
                    answersButton[i].classList.add('nothover');
                }

                this.countYes++;
                clearInterval(this.timerId);
                setTimeout(() => {
                    this.startTest(this.numberQuestions);
                }, 1000);

            } else if (target.dataset.id !== 'correctAnswer' && (target.tagName === 'BUTTON' || target.tagName === 'IMG')) {
                target.classList.add('incorrectAnswer');

                if (info === 'music') {
                    const audio = document.getElementById('audio');
                    audio.pause();
                }

                for (let i = 0; i < answersButton.length; i++) {
                    answersButton[i].disabled = true;
                    answersButton[i].classList.add('nothover');
                }

                this.countNo++;
                clearInterval(this.timerId);
                setTimeout(() => {
                    this.startTest(this.numberQuestions);
                }, 1000);
            }
        });
    }

//


    startInterval() {
        // start repeats at intervals of 20 seconds
        this.timerId = setInterval(() => {
            if (this.numberQuestions.length === 0) {
                clearInterval(this.timerId);
                clearInterval(this.countdown);

                this.addUser();

                const body = document.body;

                body.innerHTML = `<div class='final'>
                 ${this.countYes >= 3 ? `<p>Вы победили!!!</p>
                                                      <p>Число правильных ответов: ${this.countYes}</p>
                                                      <p>Число неправильных ответов: ${this.countNo}</p>
                                                      <p>Число неотвеченных вопросов: ${this.answeredQuestions - this.countNo - this.countYes}</p>`
                    : (this.countYes <= 3 || this.countNo >= 3) ? `<p>Увы, в этот раз не повезло</p>
                                                               <p>Число правильных ответов: ${this.countYes}</p>
                                                               <p>Число неправильных ответов: ${this.countNo}</p>
                                                               <p>Число неотвеченных вопросов: ${this.answeredQuestions - this.countNo - this.countYes}</p>` :
                        (this.countYes === 0 || this.countNo === 0) ? '<p>Так бывает</p>' : ''}                                                            
                              </div>
                              <canvas></canvas>`;

                let a = new Fireworks();
                a.run();
            } else {
                this.generateQuestion();
            }
        }, 20000);
    }

    addUser() {
        const name = document.getElementById('name'),
            email = document.getElementById('email');

        const newUser = {
            Name: name.value.trim(),
            Email: email.value.trim(),
            correctAnswers: this.countYes,
            incorrectAnswers: this.countNo
        };

        this.model.addUser(newUser).then(() => {
        });
    }

    showError() {
        const modal = document.getElementsByClassName('modal-wrapper')[0];
        modal.innerHTML += `<div class="modal">
                                <div class="head">
                                </div>
                                <div class="content">
                                     <h1>Error, data from the server is not received.</h1>
                                </div>
                            </div>`;
        modal.classList.toggle('open');
    }
}

export default Tests;


