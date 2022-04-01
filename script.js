;(() => {
    const get = (element) => document.querySelector(element)

    class GameData {
        constructor() {
            this.$board = get('.board')
            this.$score = get('.scores')
            this.$moves = get('.moves')
            this.cards = [
                'star',
                'paper-plane',
                'snowflake',
                'thumbs-up',
                'user',
                'lemon',
                'heart',
                'bell',
                'moon',
                'sun'
            ]
            this.cardList = this.setCards([...this.cards, ...this.cards])
            this.moves = 0
            this.scores = 0
            this.limit = 50
            this.total = this.cards.length
            this.current = []
        }

        setCards(cardList) {
            const randomIndexArray = []
            const cardRandom = []
            for (let i = 0; i < cardList.length; i++) {
                let randomNum = Math.floor(Math.random() * cardList.length)
                if(randomIndexArray.indexOf(randomNum) === -1) {
                    randomIndexArray.push(randomNum)
                    cardRandom.push(cardList[randomNum])
                } else {
                    i--;
                }
            }
            return cardRandom
        }

        getCards() {
            return this.cardList
        }

        addMove() {
            return this.moves++
        }

        addScore() {
            return this.scores++
        }

        updatePoint() {
            this.$score.textContent = this.scores
            this.$moves.textContent = this.moves
        }

        resetPoint() {
            this.$score.textContent = 0
            this.$moves.textContent = 0
        }

        resetGame() {
            this.moves = 0
            this.scores = 0
            this.cardList = this.setCards([...this.cards, ...this.cards])
        }

        setGame() {
            this.$board.innerHTML = ''
            let temp = document.createDocumentFragment()
            for (let i = 0; i < this.getCards().length; i++) {
                let card = document.createElement('li')
                let front = document.createElement('span')
                let icon = document.createElement('i')

                card.classList.add('card')
                front.classList.add('front')
                icon.setAttribute('class', `icon far fa-${this.getCards()[i]}`)

                card.append(front)
                card.append(icon)
                temp.append(card)
            }
            this.$board.append(temp)
        }

        isEnd() {
            if(this.moves === this.limit) {
                return 'defeat'
            } else if(this.scores === this.total) {
                return 'win'
            }
        }
    }

    class Stopwatch {
        constructor(element) {
            this.timer = element
            this.interval = null
            this.defaultTime = `00:00.00`
            this.startTime = 0
            this.elapsedTime = 0
        }
        
        addZero(number) {
            if(number < 10){
              number = '0'+ number
            }
            if(number > 99) {
              number = number.toString().slice(0, -1)
            }
            return number
        }
    
        timeToString(time) {
            // getUTC => 현재시간을 정확히 가져올 수 있음
            const date = new Date(time)
            const minute = date.getUTCMinutes()
            const seconds = date.getUTCSeconds()
            const miliseconds = date.getUTCMilliseconds()
            return `${this.addZero(minute)}:${this.addZero(seconds)}.${this.addZero(miliseconds)}`
        }
    
        print(text) {
            this.timer.innerHTML = text
        }
    
        startTimer() {
            this.elapsedTime = Date.now() - this.startTime
            const time = this.timeToString(this.elapsedTime)
            this.print(time)
        }

        start() {
            clearInterval(this.interval)
            this.startTime = Date.now() - this.elapsedTime
            this.interval = setInterval(this.startTimer.bind(this), 10)
        }

        stop() {
            clearInterval(this.interval)
        }

        reset() {
            clearInterval(this.interval)
            this.elapsedTime = 0
            this.startTime = 0
            this.print(this.defaultTime)
        }
    }

    const checkCard = (cards) => {
        game.current = []
        if('defeat' === game.isEnd()) {
            $stopwatch.stop()
            $stopwatch.reset()
            alert('패배!')
            setTimeout(() => {
                game.resetGame()
                game.resetPoint()
                game.setGame()
            }, 1000)
        }
        if(cards[0].children[1].className !== cards[1].children[1].className) {
            closeCards(cards)
            return
        }
        game.addScore()
        game.updatePoint()
        correctCards(cards)
        if('win' === game.isEnd()) {
            $stopwatch.stop()
            alert('승리!')
            $stopwatch.reset()
        }
    }

    const correctCards = (cards) => {
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            element.classList.add('match')
        }
    }

    const closeCards = (cards) => {
        cards.forEach(($element) => {
            $element.classList.add('nonmatch')
            setTimeout(() => {
                $element.setAttribute('class', 'card')
            }, 1000 * 0.5)
        });
    }

    const startGame = (event) => {
        event.target.textContent = '다시 시작'
        game.current = []
        game.resetGame()
        game.resetPoint()
        game.setGame()
        $stopwatch.reset()
        $stopwatch.start()
    }

    const playGame = (event) => {
        let $target = event.target
        if(!$target.classList.contains('card')) return
        $target.classList.add('flip')
        game.current.push($target)
        game.addMove()
        game.updatePoint()
        $target.removeEventListener('click', playGame, false)
        if(game.current.length < 2) return
        checkCard(game.current)
    }


    const game = new GameData();
    const $timer = get('.timer')
    const $stopwatch = new Stopwatch($timer)
    get('.js-play').addEventListener('click', startGame)
    get('.limit').textContent = game.limit
    game.$board.addEventListener('click', playGame)
    
})()