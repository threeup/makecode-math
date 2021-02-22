 scene.setBackgroundColor(0)
 let bgImage:Image = null;
 bgImage = projectImages.wave;

let palBuf2: Buffer = palettes.palettetxt;
 
 image.setPalette(palBuf2)
 scene.setBackgroundImage(bgImage);

 
 
class FourDig {

    private first:Sprite
    private second:Sprite
    private third:Sprite
    private fourth:Sprite
    private val:number = 0
    private thousands:number = 0
    private hundreds:number = 0
    private tens:number = 0
    private ones:number = 0
    private anchorX:number = 0
    private anchorY:number = 0

    constructor(anchorX: number, anchorY: number) {
        this.first = sprites.create(this.getDigit(0));
        this.first.setPosition(1+anchorX, 1+anchorY);
        this.second = sprites.create(this.getDigit(0));
        this.second.setPosition(26+anchorX, 1+anchorY);
        this.third = sprites.create(this.getDigit(0));
        this.third.setPosition(51+anchorX, 1+anchorY);
        this.fourth = sprites.create(this.getDigit(0));
        this.fourth.setPosition(76+anchorX, 1+anchorY);
    }

    public getDigit(num:number):any {
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

    public getValue():number {
        return this.val;
    }
    
    public changeValue(ch:number):void {
        this.setValue(this.val+ch);
    }

    public setValue(num:number):void {
        if(this.val != num) {
            this.val = Math.constrain(num, 0, 99);
            let working = this.val;
            let tenthousands = Math.floor(working / 10000);
            working -= tenthousands*1000;
            let thousands = Math.floor(working / 1000);
            working -= thousands*1000;
            let hundreds = Math.floor(working / 100);
            working -= hundreds*100;
            let tens = Math.floor(working / 10);
            working -= tens*10;
            let ones = working;
            this.first.setImage(this.getDigit(thousands));
            this.second.setImage(this.getDigit(hundreds));
            this.third.setImage(this.getDigit(tens));
            this.fourth.setImage(this.getDigit(ones));
            this.first.setFlag(SpriteFlag.Invisible, thousands == 0);
            this.second.setFlag(SpriteFlag.Invisible, hundreds == 0);
            this.third.setFlag(SpriteFlag.Invisible, tens == 0);
            if(this.thousands != thousands) {
                this.thousands = thousands
                this.first.startEffect(effects.warmRadial, 300);
            }
            if(this.hundreds != hundreds) {
                this.hundreds = hundreds
                this.second.startEffect(effects.warmRadial, 300);
            }
            if(this.tens != tens) {
                this.tens = tens
                this.third.startEffect(effects.warmRadial, 300);
            }
            if(this.ones != ones) {
                this.ones = ones
                this.fourth.startEffect(effects.warmRadial, 300);
            }
            
        }
    }
}
let current = new FourDig(40,90);
let splitTop = new FourDig(40,15);
let splitBottom = new FourDig(40,45);
let target = new FourDig(40,125);


let scoreSprite: TextSprite = null;
scoreSprite = textsprite.create("0",8,4);
scoreSprite.setMaxFontHeight(16)
scoreSprite.setPosition(6,8);
target.setValue(4);
splitTop.setValue(2);
splitBottom.setValue(2);
current.setValue(1);

let operation = "+"
let operationSprite: TextSprite = null;
operationSprite = textsprite.create(operation, 0,4);
operationSprite.setMaxFontHeight(40);
operationSprite.setPosition(80, 41);
operationSprite.setOutline(4, 10)


let equalsSprite: TextSprite = null;
equalsSprite = textsprite.create("=", 0,4);
equalsSprite.setMaxFontHeight(40);
equalsSprite.setPosition(80, 85);
equalsSprite.setOutline(4, 10)


let dig = 0;
let prevUp = 0;
let prevDown = 0;
let maxValue = 9;

function newAnswer(success:boolean) {
    if(success) {
        info.changeScoreBy(1);
        scoreSprite.setText(info.score().toString());
        scoreSprite.startEffect(effects.spray, 3);
    }
    
    
    if(randint(0, 1) == 0) {
        operation = "+";
        target.setValue(randint(0, maxValue))
        let top = randint(0,target.getValue())
        splitTop.setValue(top);
        splitBottom.setValue(target.getValue() - top);
        
    } else {
        operation = "-";
        splitTop.setValue(randint(0, maxValue))
        let bot = randint(0,target.getValue())
        splitBottom.setValue(bot);
        target.setValue(splitTop.getValue()-bot);
    }
    operationSprite.setText(operation);
    
}

game.onUpdate(function() {

    if(controller.up.isPressed()) {
        prevUp = prevUp+1;
        prevDown = 0;
        if(prevUp%3==0) {
            let increment = prevUp>15?2:1;
            switch(dig) {
                default:
                case 0: current.changeValue(increment); break;
                case 1: current.changeValue(increment*10); break;
                case 2: current.changeValue(increment*100); break;
                case 3: current.changeValue(increment*1000); break;
            }
        }
    } else if(controller.down.isPressed()) {
        prevDown = prevDown+1;
        prevUp = 0;
        if(prevDown%3==0) {
            let increment = prevDown>15?-2:-1;
            switch(dig) {
                default:
                case 0: current.changeValue(increment); break;
                case 1: current.changeValue(increment*10); break;
                case 2: current.changeValue(increment*100); break;
                case 3: current.changeValue(increment*1000); break;
            }
        }
    } else {
        prevUp = 0;
        prevDown = 0;
    }
    
    if (controller.A.isPressed() ) {
        if(target.getValue() == current.getValue()) {
            newAnswer(true);
        }
    }
    if (controller.B.isPressed() ) {
        current.setValue(0);
    }

    
})
 