// メインコード
const pokerHand = ['ロイヤルストレートフラッシュ', 'ストレート・フラッシュ', 'フォア・カード', 'フルハウス', 'フラッシュ', 'ストレート', 'スリーカード', 'ツウ・ペア', 'ワン・ペア', 'ノーペア'];

const cards = new Cards();
cards.initDeck();
cards.shuffleDeck();
cards.initHand();

myHandVue.updateHand(cards.myHand);
resultVue.updateResult(pokerHand[cards.pokerJudgement('myHand')[0]], '???', '???');

document.getElementById('change-button').addEventListener('click', function () {
    if (cards.changeNum >= 1) {
        alert('交換回数は' + cards.changeNum + '回です\nもう一度遊ぶ際にはリセットのボタンを押してください');
    }
    else {
        let myResult, oppoResult, winner;
        //相手の交換
        cards.npcMovement();
        cards.sortHand('oppoHand');
        oppoHandVue.updateHand(cards.oppoHand);

        //自分の交換
        cards.replaceCards('myHand', myHandVue.getSelected);
        myHandVue.updateHand(cards.myHand);

        //捨て札の更新
        discardVue.updateDiscard(cards.discard);

        myResult = pokerHand[cards.pokerJudgement('myHand')[0]];
        oppoResult = pokerHand[cards.pokerJudgement('oppoHand')[0]];
        winner = cards.judgeTheGame();

        resultVue.updateResult(myResult, oppoResult, winner);

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