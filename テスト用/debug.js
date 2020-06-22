function setRoyalStraightFlush(TargetHandName = 'myHand') {
    const cardsName = ['deck', 'myHand', 'oppoHand', 'discard'];
    const linkName = ['s1.png', 's10.png', 's11.png', 's12.png', 's13.png'];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < cardsName.length; j++) {
            for (let k = 0; k < cards[cardsName[j]].length; k++) {
                if (cards[cardsName[j]][k].linkName == linkName[i]) {
                    [cards[TargetHandName][i], cards[cardsName[j]][k]] = [cards[cardsName[j]][k], cards[TargetHandName][i]]
                }
            }
        }
    }
    myHandVue.updateHand(cards.myHand);
    resultVue.updateResult(pokerHand[cards.pokerJudgement('myHand')[0]], '???', '???');
}
/*function setRoyalStraightFlush(TargetHandName = 'myHand') {
    cards[TargetHandName][0] = { number: 1, suit: 'Spade', linkName: 's1.png' };
    for (let i = 1; i < 5; i++) {
        cards[TargetHandName][i] = { number: i + 9, suit: 'Spade', linkName: 's' + (i + 9) + '.png' };
    }
    myHandVue.updateHand(cards.myHand);
    resultVue.updateResult(pokerHand[cards.pokerJudgement('myHand')[0]], '???', '???');
}*/

