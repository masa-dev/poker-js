//カードのリンク先の名前
const playingCardImageLink = [
    ['s1.png', 's2.png', 's3.png', 's4.png', 's5.png', 's6.png', 's7.png', 's8.png', 's9.png', 's10.png', 's11.png', 's12.png', 's13.png'],
    ['h1.png', 'h2.png', 'h3.png', 'h4.png', 'h5.png', 'h6.png', 'h7.png', 'h8.png', 'h9.png', 'h10.png', 'h11.png', 'h12.png', 'h13.png'],
    ['d1.png', 'd2.png', 'd3.png', 'd4.png', 'd5.png', 'd6.png', 'd7.png', 'd8.png', 'd9.png', 'd10.png', 'd11.png', 'd12.png', 'd13.png'],
    ['c1.png', 'c2.png', 'c3.png', 'c4.png', 'c5.png', 'c6.png', 'c7.png', 'c8.png', 'c9.png', 'c10.png', 'c11.png', 'c12.png', 'c13.png'],
    ['joker.png']
];  //53枚

//カードのクラス
class Card {
    constructor(number, suit, linkName) {
        this.number = number;
        this.suit = suit;
        this.linkName = linkName;
    }
}


// 複数のカードのクラス
class Cards {
    constructor() {
        this.deck = [];
        this.myHand = [];
        this.oppoHand = [];
        this.discard = [];
        this._changeNum = 0;
    }

    initDeck() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                this.deck.push(new Card(j + 1, 'noImage', playingCardImageLink[i][j]));

                if (i === 0) {
                    this.deck[i * 13 + j].suit = 'Spade';
                }
                else if (i === 1) {
                    this.deck[i * 13 + j].suit = 'Heart';
                }
                else if (i === 2) {
                    this.deck[i * 13 + j].suit = 'Diamond';
                }
                else {
                    this.deck[i * 13 + j].suit = 'Club';
                }
            }
        }
    }

    initHand() {
        for (let i = 0; i < 5; i++) {
            this.drawCard('myHand', i);
            this.drawCard('oppoHand', i);
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i >= 0; i--) {
            let rand = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[rand]] = [this.deck[rand], this.deck[i]];
        }
    }

    drawCard(targetHandName, index) {
        if (targetHandName != 'myHand' && targetHandName != 'oppoHand') {
            console.log(new RangeError('targetHandName is not a valid value(methods:drawCard, value:' + targetHandName + ')'));
            return;
        }
        this[targetHandName][index] = this.deck.shift();
    }

    discardCard(targetHandName, index) {
        if (targetHandName != 'myHand' && targetHandName != 'oppoHand') {
            console.log(new RangeError('targetHandName is not a valid value(methods:discardCard, value:' + targetHandName + ')'));
            return;
        }
        this.discard.push(this[targetHandName][index]);
        this[targetHandName][index] = null;
    }

    replaceCards(targetHandName, replacementFlag = [false, false, false, false, false]) {
        if (targetHandName != 'myHand' && targetHandName != 'oppoHand') {
            console.log(new RangeError('targetHandName is not a valid value(methods:replaceCards, value:' + targetHandName + ')'));
            return;
        }
        for (let i = 0; i < 5; i++) {
            if (replacementFlag[i]) {
                this.discardCard(targetHandName, i);
                this.drawCard(targetHandName, i);
            }
        }
    }

    sortHand(targetHandName) {
        if (targetHandName != 'myHand' && targetHandName != 'oppoHand') {
            console.log(new RangeError('targetHandName is not a valid value(methods:sortHand, value:' + targetHandName + ')'));
            return;
        }
        this[targetHandName].sort(function (a, b) {
            return a.number - b.number;
        });
    }

    returnToDeck() {
        let i, myLength, opponentLength, discardLength;
        myLength = this.myHand.length;
        opponentLength = this.oppoHand.length;
        discardLength = this.discard.length

        for (i = 0; i < myLength; i++) {
            this.deck.push(this.myHand.shift());
        }
        for (i = 0; i < opponentLength; i++) {
            this.deck.push(this.oppoHand.shift());
        }
        for (i = 0; i < discardLength; i++) {
            this.deck.push(this.discard.shift());
        }
    }

    countExe() {
        this._changeNum++;
    }

    resetCount() {
        this._changeNum = 0;
    }

    get changeNum() {
        return this._changeNum;
    }

    pokerJudgement(targetHandName) {
        if (targetHandName != 'myHand' && targetHandName != 'oppoHand') {
            console.log(new RangeError('targetHandName is not a valid value(methods:pokerJudgement, value:' + targetHandName + ')'));
            return;
        }

        let i, j, count, max;
        let copy = [];

        for (i = 0; i < 5; i++) {
            copy.push(this[targetHandName][i]);
        }
        copy.sort(function (a, b) {
            return a.number - b.number;
        });

        //ロイヤルストレートフラッシュ
        count = 0;
        for (i = 0; i < 5; i++) {
            if (copy[i].suit == 'Spade') {
                if (i == 0 && copy[i].number == 1) {
                    count++;
                }
                else if (i >= 1 && copy[i].number == 9 + i) {
                    count++;
                }
            }
        }
        if (count == 5) {
            return [0, 1];
        }

        //ストレート・フラッシュ
        count = 0, max = 0;
        for (i = 0; i < 4; i++) {
            if (copy[0].suit == copy[i].suit) {
                if (copy[i].number + 1 == copy[i + 1].number) {
                    count++;
                    max = copy[i + 1].number;
                }
            }
        }
        if (count == 4) {
            return [1, max];
        }
        count = 0, max = 0;
        for (i = 0; i < 5; i++) {   //1,10,J,Q,K の場合
            if (copy[0].suit == copy[i].suit) {
                if (i == 0 && copy[i].number == 1) {
                    count++;
                }
                else if (i >= 1 && copy[i].number == 10 + (i - 1));
            }
        }
        if (count == 4) {
            return [1, 1];
        }

        //フォア・カード
        count = 0, max = 0;
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 3; j++) {    //フルハウスと混同しないように4枚分をずらしながら比べる
                if (copy[i + j].number == copy[i + j + 1].number) {
                    count++;
                    max = copy[i + j].number;
                }
            }
            if (count == 3) {
                return [2, max];
            }
            else {
                count = 0;
            }
        }

        //フルハウス
        count = 0, max = 0;
        for (i = 0; i < 4; i++) {
            if (copy[i].number == copy[i + 1].number) {
                count++;
                if (i < 3 && copy[i + 1].number == copy[i + 2].number) {
                    max = copy[i].number;
                }
            }
        }
        if (count == 3) {
            return [3, max];
        }

        //フラッシュ
        count = 0, max = 0;
        for (i = 1; i < 5; i++) {
            if (copy[0].suit == copy[i].suit) {
                count++;
            }
        }
        if (count == 4) {
            max = copy[0].number;
            return [4, max];
        }

        //ストレート
        count = 0, max = 0;
        for (i = 0; i < 4; i++) {
            if (i == 0 && copy[0].number == 1) {
                if (copy[1].number == 10) {
                    count++;
                    max = 13 + 1;
                }
            }
            else if (copy[i].number + 1 == copy[i + 1].number) {
                count++;
                max = copy[i + 1].number;
            }
        }
        if (count == 4) {
            return [5, max]
        }

        //スリーカード
        count = 0, max = 0;
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 2; j++) {
                if (copy[i + j].number == copy[i + j + 1].number) {
                    count++;
                    max = copy[i + j].number;
                }
            }
            if (count == 2) {
                return [6, max];
            }
            else {
                count = 0;
            }
        }

        //ツウ・ペア，ワンペア
        count = 0, max = 0;
        for (i = 0; i < 4; i++) {
            if (copy[i].number == copy[i + 1].number) {
                count++;
                if (max == 1 || copy[i].number == 1) {
                    max = 1;
                }
                else {
                    max = copy[i].number;
                }
            }
        }
        if (count == 2) {
            return [7, max];
        }
        else if (count == 1) {
            return [8, max];
        }

        //ノーペア
        max = 0;
        for (i = 0; i < 5; i++) {
            if (copy[i].number > max) {
                max = copy[i].number;
            }
        }
        return [9, max];
    }

    npcMovement() {
        let i, j, count = 0;
        let judge;
        judge = this.pokerJudgement('oppoHand')[0];
        let replacementFlag = [false, false, false, false, false];

        if (judge == 9) {
            //同じ絵柄が４つある時(フラッシュを狙う)
            for (i = 0; i < 2; i++) {
                for (j = 0; j < 5; j++) {
                    if (this.oppoHand[i].suit == this.oppoHand[j].suit) {
                        count++;
                    }
                    if (count == 4) {
                        for (j = 0; j < 5; j++) {
                            if (this.oppoHand[i].suit != this.oppoHand[j].suit) {
                                replacementFlag[j] = true;
                                this.replaceCards('oppoHand', replacementFlag);
                                return;
                            }
                        }
                    }
                }
                count = 0;
            }
            //フラッシュを狙えない時
            replacementFlag = [true, true, true, true, true];
            this.replaceCards('oppoHand', replacementFlag);
        }
        //ワンペア～スリーカードの時
        else if (judge >= 6) {
            for (i = 0; i < 5; i++) {
                count = 0;
                for (j = 0; j < 5; j++) {
                    if (this.oppoHand[i].number == this.oppoHand[j].number) {
                        count++;
                    }
                }
                if (count == 1) {
                    replacementFlag[i] = true;
                }
            }
            this.replaceCards('oppoHand', replacementFlag);
        }
    }

    judgeTheGame() {
        let myHandResult = this.pokerJudgement('myHand');
        let oppoHandResult = this.pokerJudgement('oppoHand');
        let winner;

        //0が強い
        if (myHandResult[0] < oppoHandResult[0]) {
            winner = 'myHand';
        }
        else if (myHandResult[0] > oppoHandResult[0]) {
            winner = 'oppoHand';
        }
        else if (myHandResult[0] == oppoHandResult[0]) {
            if (myHandResult[1] == 1) {
                myHandResult[1] += 13;
            }
            if (oppoHandResult[1] == 1) {
                oppoHandResult[1] += 13;
            }
            //13(1)が強い
            if (myHandResult[1] > oppoHandResult[1]) {
                winner = 'myHand';
            }
            else if (myHandResult[1] < oppoHandResult[1]) {
                winner = 'oppoHand'
            }
            else {
                winner = 'tieGame';
            }
        }
        return winner;
    }
}