 scene.setBackgroundColor(1)
 
 let first = sprites.create(digits.zero);
 first.setPosition(40, 40);
 let second = sprites.create(digits.five);
 second.setPosition(65, 40);
 let third = sprites.create(digits.eight);
 third.setPosition(90, 40);
 let fourth = sprites.create(digits.zero);
 fourth.setPosition(115, 40);

 function getDigit(num:number):any {
     switch(num) {
        default:
        case 0: return digits.zero;
        case 1: return digits.one;
        case 2: return digits.two;
        case 3: return digits.three;
        case 4: return digits.four;
        case 5: return digits.five;
        case 6: return digits.six;
        case 7: return digits.seven;
        case 8: return digits.eight;
        case 9: return digits.nine;
     }
 }
let current = 1000;
let target = 1234;
game.onUpdate(function() {
    let previous = current;
    if(previous > 10)
    {
        current = current+1;
    }
    if(previous != current) {
        let working = current;
        let tenthousands = Math.floor(working / 10000);
        working -= tenthousands*1000;
        let thousands = Math.floor(working / 1000);
        working -= thousands*1000;
        let hundreds = Math.floor(working / 100);
        working -= hundreds*100;
        let tens = Math.floor(working / 10);
        working -= tens*10;
        let ones = working;
        first.setImage(getDigit(thousands));
        second.setImage(getDigit(hundreds));
        third.setImage(getDigit(tens));
        fourth.setImage(getDigit(ones));
    }
})
 