const oppoHandVue = new Vue({
    el: '#opponents-hand',
    data: {
        hand: [
            { id: 0, linkName: 'backSide.png' },
            { id: 1, linkName: 'backSide.png' },
            { id: 2, linkName: 'backSide.png' },
            { id: 3, linkName: 'backSide.png' },
            { id: 4, linkName: 'backSide.png' },
        ]
    },
    methods: {
        updateHand: function (hand = []) {
            this.deleteHand();
            for (let i = 0; i < 5; i++) {
                this.hand.push({ id: i, linkName: hand[i].linkName });
            }
        },
        deleteHand: function () {
            this.hand.splice(0, this.hand.length);
        },
        changeToDefault: function () {
            this.deleteHand();
            for (let i = 0; i < 5; i++) {
                this.hand.push({ id: i, linkName: 'backSide.png' });
            }
        }
    }
});

const myHandVue = new Vue({
    el: '#my-hand',
    data: {
        hand: [
            { id: 0, linkName: 'backSide.png', isActive: false },
            { id: 1, linkName: 'backSide.png', isActive: false },
            { id: 2, linkName: 'backSide.png', isActive: false },
            { id: 3, linkName: 'backSide.png', isActive: false },
            { id: 4, linkName: 'backSide.png', isActive: false },
        ]
    },
    methods: {
        updateHand: function (hand = []) {
            this.deleteHand();
            for (let i = 0; i < 5; i++) {
                this.hand.push({ id: i, linkName: hand[i].linkName, isActive: false });
            }
        },
        deleteHand: function () {
            this.hand.splice(0, this.hand.length);
        },
        selectCard: function (id) {
            if (this.hand[id].isActive) {
                this.hand[id].isActive = false;
            }
            else {
                this.hand[id].isActive = true;
            }
        },
        changeToDefault: function () {
            this.deleteHand();
            for (let i = 0; i < 5; i++) {
                this.hand.push({ id: i, linkName: 'backSide.png', isActive: false });
            }
        }
    },
    //算出プロパティ(getterみたいなもの)
    computed: {
        getSelected: function () {
            let activeArray = [];
            for (let active of this.hand) {
                activeArray.push(active.isActive);
            }
            return activeArray;
        }
    }
});

const discardVue = new Vue({
    el: '#deck-and-discard',
    data: {
        discard: { linkName: 'frame.png' }
    },
    methods: {
        updateDiscard: function (discard) {
            if (discard[0]) {
                this.discard.linkName = discard[discard.length - 1].linkName;
            }
            else {
                this.changeToDefault();
            }
        },
        changeToDefault: function () {
            this.discard.linkName = 'frame.png';
        }
    }
});

const resultVue = new Vue({
    el: '#result-area',
    data: {
        result: {
            myself: 'あなたのカードは...です',
            opponent: '相手のカードは...です',
            poker: 'カードをクリックして選択'
        }
    },
    methods: {
        updateResult: function (myResult, oppoResult, winner) {
            this.result.myself = 'あなたのカードは「<strong>' + myResult + '</strong>」です';
            this.result.opponent = '相手のカードは「<strong>' + oppoResult + '</strong>」です';
            if (winner == 'myHand') {
                this.result.poker = '結果：あなたの勝ち';
            }
            else if (winner == 'oppoHand') {
                this.result.poker = '結果：あなたの負け';
            }
            else if (winner == 'tieGame') {
                this.result.poker = '結果：引き分け';
            }
            else if (winner == '???') {
                this.result.poker = 'カードをクリックして選択';
            }
        },
        changeToDefault: function () {
            this.result.myself = 'あなたのカードは...です';
            this.result.opponent = '相手のカードは...です';
            this.result.poker = 'カードをクリックして選択';
        }
    }
});