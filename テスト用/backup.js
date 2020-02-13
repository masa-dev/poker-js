//カードのリンク先の名前
const playingCard =[['s1.png','s2.png','s3.png','s4.png','s5.png','s6.png','s7.png','s8.png','s9.png','s10.png','s11.png','s12.png','s13.png'],
                    ['h1.png','h2.png','h3.png','h4.png','h5.png','h6.png','h7.png','h8.png','h9.png','h10.png','h11.png','h12.png','h13.png'],
                    ['d1.png','d2.png','d3.png','d4.png','d5.png','d6.png','d7.png','d8.png','d9.png','d10.png','d11.png','d12.png','d13.png'],
                    ['c1.png','c2.png','c3.png','c4.png','c5.png','c6.png','c7.png','c8.png','c9.png','c10.png','c11.png','c12.png','c13.png'],
                    ['joker.png']
];  //53枚

// カードのクラス
class Card {
    constructor(number, suit, linkName) {
        this.number = number;       //数字
        this.suit = suit;           //絵柄
        this.linkName = linkName;   //リンク名
    }
}

// 複数のカードのクラス
class Cards {
    constructor() {
        this.cards = [];
    }

    // 山札の定義
    initDeck() {
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 13; j++) {
                this.cards[i*13+j] = new Card(j + 1, 'noImage', playingCard[i][j]);

                if(i === 0) {
                    this.cards[i*13+j].suit = 'Spade';
                }
                else if(i === 1) {
                    this.cards[i*13+j].suit = 'Heart';
                }
                else if(i === 2) {
                    this.cards[i*13+j].suit = 'Diamond';
                }
                else {
                    this.cards[i*13+j].suit = 'Club';
                }
        
            }
        }
    }

    /*
    initHands() {   // 山札の定義
        for(let i = 0; i < 5; i++) {
            this.cards[i] = new Card(0,'noImage','noLink');
        }
    }
    */

    //配列をランダムに入れ替えるメソッド (Fisher-Yates)
    shuffle() {
        for(let i = this.cards.length - 1; i >= 0; i--) {
            let rand = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[rand]] = [this.cards[rand], this.cards[i]];
        }
    }

    //配列から一つ値を取り除き、それを返すメソッド
    drawCard(deck, num) {
        this.cards.splice(num, 0, deck.cards.shift());
    }

    //特定の要素を取り除きそれを捨て札に代入するメソッド
    discardAnyCards(quantity, throwNum, discard) {
        let work;
        for(let i = 0; i < quantity; i++) {
            work = this.cards.splice(throwNum[i] - i - 1, 1);   //splice メソッドの戻り値は配列のため，work を使う
            discard.cards[i] = work[0];
            //console.log(work);
        }
    }

    returnToDeck(deck) {
        while(this.cards.length > 0) {
            deck.cards.push(this.cards.shift());
        }
    }
    
    viewAllCards(name) {
        for(let i = 0; i < this.cards.length; i++) {
            console.log(name + '[' + i + '] => number : ' + this.cards[i].number, ', suit : ' + this.cards[i].suit, ', link : ' + this.cards[i].linkName);
        }
    }

    //number でソート（クイックソート）
    sortNumber(startID,endID) {
        let pivot = this.cards[Math.floor((startID + endID)/2)].number;
        let left = startID;
        let right = endID;
    
        while(true) {
            while(this.cards[left].number < pivot) {
                left++;
            }
            while(pivot < this.cards[right].number) {
                right--;
            }
            if(right <= left) {
                break;
            }
            [this.cards[left], this.cards[right]] = [this.cards[right], this.cards[left]];
            right--;
        }
        
        if(startID < left-1) {
            this.sortNumber(startID,left-1);
        }
        if(right+1 < endID) {
            this.sortNumber(right+1,endID);
        }
    }

    pokerJudgement() {
        //コピー作成
        let i, j;
        let copy = new Cards;
        for(i = 0; i < 5; i++) {
            copy.cards[i] = this.cards[i];
        }
        //ソート
        copy.sortNumber(0, 5-1);

        //ロイヤルストレートフラッシュ
        let count = 0;
        for(i = 0; i < 5; i++) {
            if(copy.cards[0].suit == copy.cards[i].suit) {
                if(i == 0 && copy.cards[0].number == 1) {           //1 (A)
                    count++;
                }
                else if(i >= 1 && copy.cards[i].number == 9 + i) {  //10 ~ 13
                    count++;
                }
                else{
                    break;
                }
            }
        }
        if (count == 5) {
            return 0;
        }

        //ストレート・フラッシュ
        count = 0;
        for(i = 0; i < 4; i++) {
            if(copy.cards[0].suit == copy.cards[i].suit) {
                if(copy.cards[i].number + 1 == copy.cards[i+1].number) {
                    count++;
                }
            }
        }
        if(count == 4) {
            return 1;
        }

        //フォア・カード
        count = 0;
        for(i = 0; i < 2; i++) {
            for(j = 0; j < 3; j++) { //フルハウスと混同しないように4枚分をずらしながら比べる
                if(copy.cards[i+j].number == copy.cards[i+j+1].number) {
                    count++;
                }
            }
            if(count == 3) {
                return 2;
            }
            else {
                count = 0;
            }
        }

        //フルハウス
        count = 0;
        for(i = 0; i < 4; i++) {
            if(copy.cards[i].number == copy.cards[i+1].number) {
                count++;
            }
        }
        if(count == 3) {
            return 3;
        }

        //フラッシュ
        count = 0;
        for(i = 1; i < 5; i++) {
            if(copy.cards[0].suit == copy.cards[i].suit) {
                count++;
            }
        }
        if(count == 4) {
            return 4;
        }

        //ストレート
        count = 0;
        for(i = 0; i < 4; i++) {
            if(copy.cards[i].number + 1 == copy.cards[i + 1].number) {
                count++;
            }
        }
        if(count == 4) {
            return 5;
        }

        //スリーカード
        count = 0;
        for(i = 0; i < 3; i++) {
            for(j = 0; j < 2; j++) {
                if(copy.cards[i+j].number == copy.cards[i+j+1].number) {
                    count++;
                }
            }
            if(count == 2) {
                return 6;
            }
            else {
                count = 0;
            }
        }

        //ツウ・ペア，ワンペア
        count = 0;
        for(i = 0; i < 4; i++) {
            if(copy.cards[i].number == copy.cards[i+1].number) {
                count++;
            }
        }
        if(count == 2) {
            return 7;
        }
        else if(count == 1) {
            return 8;
        }

        //ノーペア
        return 9;
    }
}

//htmlに画像を出力する関数
//相手を含むすべてのカードを更新
function updateAllCards() {
    for(let i = 0; i < 5; i++) {
        document.getElementById('opponentsCard_'+(i+1)).src = 'card/' + opponentsHand.cards[i].linkName;
        document.getElementById('myCard_'+(i+1)).src = 'card/' + myHand.cards[i].linkName;

    }
    if(discard.cards.length != 0) {
        document.getElementById('discard').src = 'card/' + discard.cards[discard.cards.length-1].linkName;
    }
}
//相手を除くすべてのカードを更新
function updateMyCards() {
    for(let i = 0; i < 5; i++) {
        //document.getElementById('opponentsCard_'+(i+1)).src = 'card/' + opponentsHand.cards[i].linkName;
        document.getElementById('myCard_'+(i+1)).src = 'card/' + myHand.cards[i].linkName;

    }
    if(discard.cards.length != 0) {
        document.getElementById('discard').src = 'card/' + discard.cards[discard.cards.length-1].linkName;
    }
}

//メインコード

let pokerHand = ['ロイヤルストレートフラッシュ', 'ストレート・フラッシュ', 'フォア・カード', 'フルハウス', 'フラッシュ', 'ストレート', 'スリーカード', 'ツウ・ペア', 'ワン・ペア', 'ノーペア']
let myNum, oppoNum;             //自分と相手の役の数字
let deck;                       //山札
let myHand, opponentsHand;      //手札
let discard;                    //捨て札
let quantity = 0, excNum = [];  //交換量と交換番号
let executedCount = 0;

deck = new Cards();
myHand = new Cards();
opponentsHand = new Cards();
discard = new Cards();

deck.initDeck();
//myHand.initHands();
deck.shuffle();  //山札をシャッフル

for(let i = 0; i < 5; i++) { //手札補充
    myHand.drawCard(deck, i);
    opponentsHand.drawCard(deck, i);
}

//自分の手札の表示
updateMyCards();

//役の判定
//oppoNum = opponentsHand.pokerJudgement();
//document.getElementById('opponents_result_1').innerHTML = '相手の役は「' + pokerHand[oppoNum] + '」です';
myNum = myHand.pokerJudgement();
document.getElementById('my_result_1').innerHTML = 'あなたの役は「' + pokerHand[myNum] + '」です';

//クリックしたカードを動かす関数作成
let status = [0,0,0,0,0];
function moveImage(num) {
    $(function() {
        $('#myCard_'+num).click(function() {
            if(status[num-1] == 0) {
                $(this).animate({'top':'-40px'},200);
                status[num-1] = 1;
                quantity++;
            }
            else if(status[num-1] == 1) {
                $(this).animate({'top':'0px'},200);
                status[num-1] = 0;
                quantity--;
            }
        });
    });
}
//5つ分実行
moveImage(1);
moveImage(2);
moveImage(3);
moveImage(4);
moveImage(5);

//実行ボタンとリセットボタンの id をそれぞれ取得して格納
let exe_btn = document.getElementById('exe_btn');
let reset_btn = document.getElementById('reset_btn');

//実行ボタンクリック時
exe_btn.addEventListener('click', function() {
    //実行済み回数が1以上の時は実行しない
    if(executedCount >= 1) {
        return;
    }
    //status を excNum に変換する(設計の都合)
    let count = 0;
    for(let i = 0; i < 5; i++) {
        if(status[i] == 1) {
            excNum[count] = i+1;
            count++;
        }
    }
    //カードを捨てる/引く
    myHand.discardAnyCards(quantity, excNum, discard);
    for(let i = 0; i < quantity; i++) {
        myHand.drawCard(deck, excNum[i] - 1);
    }
    //html の自分のカードに上書きする
    updateAllCards();
    //選択するために動かしたカードを戻す
    for(let i = 1; i <= 5; i++) {
        $('#myCard_'+i).animate({'top':'0px'},200);
    }
    //役の判定
    oppoNum = opponentsHand.pokerJudgement();
    document.getElementById('opponents_result_1').innerHTML = '相手の役は「' + pokerHand[oppoNum] + '」です';
    myNum = myHand.pokerJudgement();
    document.getElementById('my_result_1').innerHTML = 'あなたの役は「' + pokerHand[myNum] + '」です';
    //勝敗の判定
    if(oppoNum > myNum) {
        document.getElementById('total_result').innerHTML = 'あなたの勝ちです';
    }
    else if(myNum > oppoNum) {
        document.getElementById('total_result').innerHTML = 'あなたの負けです';
    }
    else{
        document.getElementById('total_result').innerHTML = '引き分けです';
    }
    //実行済み回数をカウントする
    executedCount++;
}, false);

//リセットボタンクリック時
reset_btn.addEventListener('click', function() {
    location.reload();
}, false);

//console.log(pokerHand[myNum]);
/*
myHand.returnToDeck(deck);
opponentsHand.returnToDeck(deck);
discard.returnToDeck(deck);
deck.sortNumber(0, deck.cards.length - 1);
*/
