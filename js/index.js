//https://opentdb.com/api.php?amount=6&category=25&difficulty=easy

let form = document.querySelector("#quizOptions");
let categoryMenu = document.querySelector("#categoryMenu");
let difficultyOptions = document.querySelector("#difficultyOptions");
let questionsNumber = document.querySelector("#questionsNumber");
let btnStart = document.querySelector(".btn-start");
let allQuestions;
let quiz;
btnStart.addEventListener("click", async function () {
    let category = categoryMenu.value
    let difficulity = difficultyOptions.value
    let quesNumber = questionsNumber.value

    quiz = new Quiz(category, difficulity, quesNumber)
    allQuestions = await quiz.getAllQuestions()
    let myQuestion = new Questions(0)
    myQuestion.display()
    form.classList.replace('d-block', 'd-none')
    console.log(allQuestions);
    console.log(myQuestion);
})

class Quiz {
    constructor(categ, diff, numOfQues) {
        this.category = categ;
        this.difficulity = diff;
        this.nums = numOfQues;
        this.score = 0
    }

    getApi() {
        return `https://opentdb.com/api.php?amount=${this.nums}&category=${this.category}&difficulty=${this.difficulity}`
    }
    async getAllQuestions() {
        let data = await fetch(this.getApi())
        let res = await data.json()
        let final = res.results
        return final
    }
    displayScore() {
        let cartona = `     <div class="row w-75 mx-auto bg-white mt-4 p-4 text-center rounded-2  ">
        <h2>${(this.score == allQuestions.length) ? "Congratulations" : "Opss"} your score is ${this.score} of ${allQuestions.length} </h2>
        <div class="again btn btn-primary rounded-5 mx-auto mt-3"> try again </div>
    </div>`
        document.getElementById('finish').innerHTML = cartona
        document.getElementById("myData").classList.replace("d-block", "d-none")
        document.getElementById("finish").classList.replace("d-none", "d-block")

    }
}
class Questions {
    constructor(index) {
        this.index = index;
        this.category = allQuestions[index].category;
        this.correctAnswer = allQuestions[index].correct_answer;
        this.incorrectAnswers = allQuestions[index].incorrect_answers; // Corrected property name
        this.difficulity = allQuestions[index].difficulty; // Corrected property name
        this.question = allQuestions[index].question;
        this.allAnswers = this.getAllAnswers();
        this.checked = false;

    }

    getAllAnswers() {
        let arr = [...this.incorrectAnswers, this.correctAnswer];
        arr.sort();
        return arr;
    }
    display() {
        let cartonna = ` <div class=" mx-auto mt-4 p-3 bg-white  ">
        <div class="justify-content-between d-flex ">
            <span class="h5 btn-category">${this.category}</span>
            <span class="h5 btn-questions">${this.index + 1} of ${allQuestions.length}</span>
        </div>
        <h2 class="text-center text-capitalize  h4">${this.question}</h2>
        <ul class="list-unstyled  mx-auto d-flex  text center  ">
       ${this.allAnswers.map((ele) => {
            return `<li class="btn choices mx-auto ">${ele}</li>`
        }).join(" ")}
        </ul>
        
        <h2 class="text-capitalize text-center fw-bold ">Score : ${quiz.score}</h2>
    </div>`
        document.getElementById('myData').classList.replace('d-none', 'd-block')
        document.getElementById('myData').innerHTML = cartonna
        let choices = document.querySelectorAll(".choices")
        choices.forEach((ele) => {
            ele.addEventListener("click", () => {
                this.checkAnswer(ele);
            })
        })
    }
    checkAnswer(li) {
        if (!this.checked) {

            this.checked = true;
            if (li.innerHTML == this.correctAnswer) {
                li.classList.add('correct')
                quiz.score++

            } else (
                li.classList.add('wrong')
            )
            this.nextQuestion()
        }
    }
    nextQuestion() {
        this.index++
        if (this.index < allQuestions.length) {
            setTimeout(() => {
                let nextQuestion = new Questions(this.index)
                nextQuestion.display()
            }, 2000)
        } else {
            quiz.displayScore()
            document.querySelector('.again').addEventListener('click',function(){
                window.location.reload()
            })
        }

    }
}


