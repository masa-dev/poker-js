// メインコード
const pokerHand = ['ロイヤルストレートフラッシュ', 'ストレート・フラッシュ', 'フォア・カード', 'フルハウス', 'フラッシュ', 'ストレート', 'スリーカード', 'ツウ・ペア', 'ワン・ペア', 'ノーペア'];

let changeableLimits = 1;
const cards = new Cards();
cards.initDeck();
cards.shuffleDeck();
cards.initHand();

myHandVue.updateHand(cards.myHand);
resultVue.updateResult(pokerHand[cards.pokerJudgement('myHand')[0]], '???', '???');

document.getElementById('change-button').addEventListener('click', function () {
    if (cards.changeNum >= changeableLimits) {
        alert('交換回数は' + cards.changeNum + '回です\nもう一度遊ぶ際にはリセットのボタンを押してください');
    }
    //交換回数があと1回の場合
    else if (cards.changeNum + 1 == changeableLimits) {
        let myResult, oppoResult, winner;

        //交換
        cards.npcMovement();
        cards.sortHand('oppoHand');
        cards.replaceCards('myHand', myHandVue.getSelected);

        oppoHandVue.updateHand(cards.oppoHand);
        myHandVue.updateHand(cards.myHand);
        discardVue.updateDiscard(cards.discard);

        myResult = pokerHand[cards.pokerJudgement('myHand')[0]];
        oppoResult = pokerHand[cards.pokerJudgement('oppoHand')[0]];
        winner = cards.judgeTheGame();

        resultVue.updateResult(myResult, oppoResult, winner);

        cards.countExe();
    }
    //交換回数が2回以上の場合
    else {
        //相手の交換
        cards.npcMovement();
        cards.sortHand('oppoHand');

        //自分の交換
        cards.replaceCards('myHand', myHandVue.getSelected);

        myHandVue.updateHand(cards.myHand);
        discardVue.updateDiscard(cards.discard);

        resultVue.updateResult(pokerHand[cards.pokerJudgement('myHand')[0]], '???', '???');

        cards.countExe();
    }
});

document.getElementById('reset-button').addEventListener('click', function () {
    cards.returnToDeck();
    cards.resetCount();

    myHandVue.changeToDefault();
    oppoHandVue.changeToDefault();
    discardVue.changeToDefault();
    resultVue.changeToDefault();

    cards.shuffleDeck();
    cards.initHand();

    myHandVue.updateHand(cards.myHand);
    resultVue.updateResult(pokerHand[cards.pokerJudgement('myHand')[0]], '???', '???');
});

//画像のプリロード
window.onload = function () {
    const imgFolder = 'card/'
    for (let i = 0; i < cards.myHand.length; i++) {
        let img = document.createElement('img');
        img.src = imgFolder + cards.myHand[i].linkName;
    }
    for (let i = 0; i < cards.oppoHand.length; i++) {
        let img = document.createElement('img');
        img.src = imgFolder + cards.oppoHand[i].linkName;
    }
    for (let i = 0; i < cards.deck.length; i++) {
        let img = document.createElement('img');
        img.src = imgFolder + cards.deck[i].linkName;
    }
}