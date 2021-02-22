scene.setBackgroundColor(0)
let bgImage:Image = projectImages.greatwave;

image.setPalette(palettes.palettetxt)
scene.setBackgroundImage(bgImage);

class Rules {
    public min:number;
    public max:number;
    public digits:number;
    public speed:number;
    public rate:number;
    constructor(speed: number, min:number, max:number, digits:number) {
        this.speed = Math.clamp(1,100,speed);
        this.rate = Math.round(100/speed);
        this.min = min;
        this.max = max;
        this.digits = digits;
    }
}
class State {
    public prevUp:number = 0;
    public prevDown:number = 0;
    public prevB:number = 0;
    public curDigit:number = 0;
    constructor() {
        this.prevUp = 0;
        this.prevDown = 0;
        this.prevB = 0;
        this.curDigit = 0;
    }
}

class FourDig {
    private first:Sprite
    private second:Sprite
    private third:Sprite
    private fourth:Sprite
    private val:number = -1
    private thousands:number = 0
    private hundreds:number = 0
    private tens:number = 0
    private ones:number = 0

    constructor() {
        this.first = sprites.create(this.getDigit(0));
        this.second = sprites.create(this.getDigit(0));
        this.third = sprites.create(this.getDigit(0));
        this.fourth = sprites.create(this.getDigit(0));
    }

    public setPosition(anchorX: number, anchorY: number) {
        this.first.setPosition(1+anchorX, 1+anchorY);
        this.second.setPosition(26+anchorX, 1+anchorY);
        this.third.setPosition(51+anchorX, 1+anchorY);
        this.fourth.setPosition(76+anchorX, 1+anchorY);
    }

    public getDigit(num:number):any {
        switch(num) {
            default:
            case 0: return projectImages.zero;
            case 1: return projectImages.one;
            case 2: return projectImages.two;
            case 3: return projectImages.three;
            case 4: return projectImages.four;
            case 5: return projectImages.five;
            case 6: return projectImages.six;
            case 7: return projectImages.seven;
            case 8: return projectImages.eight;
            case 9: return projectImages.nine;
        }
    }

    public getValue():number {
        return this.val;
    }
    
    public changeValue(ch:number, min:number, max:number):void {
        let next = Math.clamp(min, max,this.val+ch);
        this.setValue(next);
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

let r = new Rules(6,0,9,1);
let s = new State();
 
let scoreSprite: TextSprite = null;

let operation = "+";
let operationSprite: TextSprite = null;
let equalsSprite: TextSprite = null;

let current:FourDig = null;
let splitTop:FourDig = null;
let splitBottom:FourDig = null;
let target:FourDig = null;

function createLayout() {
    current = new FourDig();
    splitTop = new FourDig();
    splitBottom = new FourDig();
    target = new FourDig();

    scoreSprite = textsprite.create("0",8,4);
    scoreSprite.setMaxFontHeight(16)
    scoreSprite.setPosition(6,8);

    operationSprite = textsprite.create(operation, 0,4);
    operationSprite.setMaxFontHeight(40);
    operationSprite.setOutline(3, 15)

    equalsSprite = textsprite.create("=", 0,4);
    equalsSprite.setMaxFontHeight(40);
    equalsSprite.setOutline(3, 15)
}

function moveLayout() {
    let xpos = 110 - 30*r.digits;
    operationSprite.setPosition(xpos, 44);
    equalsSprite.setPosition(xpos, 89);

    current.setPosition(40,93);
    splitTop.setPosition(40,18);
    splitBottom.setPosition(40,48);
    target.setPosition(40,132);
}

function newAnswer(success:boolean) {
    if(success) {
        info.changeScoreBy(1);
        scoreSprite.setText(info.score().toString());
        scoreSprite.startEffect(effects.spray, 3);
    }
    if(randint(0, 1) == 0) {
        operation = "+";
        target.setValue(randint(0, r.max))
        let top = randint(0,target.getValue())
        splitTop.setValue(top);
        splitBottom.setValue(target.getValue() - top);
    } else {
        operation = "-";
        splitTop.setValue(randint(0, r.max))
        let bot = randint(0,splitTop.getValue())
        splitBottom.setValue(bot);
        target.setValue(splitTop.getValue()-bot);
    }
    operationSprite.setText(operation);
}

function changeDig(increment:number) {
    switch(s.curDigit) {
        default:
        case 0: current.changeValue(increment,r.min,r.max); break;
        case 1: current.changeValue(increment*10,r.min,r.max); break;
        case 2: current.changeValue(increment*100,r.min,r.max); break;
        case 3: current.changeValue(increment*1000,r.min,r.max); break;
    }
}

createLayout();
moveLayout();
current.setValue(1);
newAnswer(false);

game.onUpdate(function() {
    if(controller.up.isPressed()) {
        s.prevUp = s.prevUp+1;
        s.prevDown = 0;
        if(s.prevUp % r.rate == 0) {
            let increment = s.prevUp>r.rate*2?2:1;
            changeDig(increment);
        }
    } else if(controller.down.isPressed()) {
        s.prevDown = s.prevDown+1;
        s.prevUp = 0;
        if(s.prevDown % r.rate == 0) {
            let increment = s.prevDown>r.rate*2?-2:-1;
            changeDig(increment);
        }
    } else {
        s.prevUp = 0;
        s.prevDown = 0;
    }
    
    if (controller.A.isPressed() ) {
        if(target.getValue() == current.getValue()) {
            newAnswer(true);
        }
    }
    if (controller.B.isPressed() ) {
        s.prevB = s.prevB+1;
        if(s.prevB > 20) {
            s.prevB = 0;
            if(r.digits==1) {
                r.digits=2;
                r.max=99;
                moveLayout();
                newAnswer(false);
                current.setValue(1);
            } else {
                r.digits=1;
                r.max=9;
                moveLayout();
                newAnswer(false);
                current.setValue(1);
            }
        }
    }
    else {
        s.prevB = 0;
    }
})
 