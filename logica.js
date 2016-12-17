

// Elaboro Mario Osorio Torres
// Marioosorio714@gmail.com
(function (window, undefined) {
    var KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40,

        canvas = null,
        ctx = null,
        lastPress = null,
        pause = false,
        gameover = false,
        currentScene = 0,
        scenes = [],
        mainScene = null,
        gameScene = null,
        body = [],
        food = null,
        dir = 0,
        score = 0,
        iBody = new Image(),
        iFood = new Image(),
        aEat = new Audio(),
        aDie = new Audio();
        var wall = [];

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 17);
            };
    }());

    document.addEventListener('keydown', function (evt) {
        if (evt.which >= 37 && evt.which <= 40) {
            evt.preventDefault();
        }

        lastPress = evt.which;
    }, false);

    function Rectangle(x, y, width, height) {

        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height;
    }

    Rectangle.prototype = {
        constructor: Rectangle,

        intersects: function (rect) {
            if (rect === undefined) {
                window.console.warn('Parámetros que faltan en intersecciones de funciones');
            } else {
                return (this.x < rect.x + rect.width &&
                    this.x + this.width > rect.x &&
                    this.y < rect.y + rect.height &&
                    this.y + this.height > rect.y);
            }
        },

        fill: function (ctx) {
            if (ctx === undefined) {
                window.console.warn('Parámetros que faltan en intersecciones de funciones');
            } else {
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        },

        drawImage: function (ctx, img) {
            if (img === undefined) {
                window.console.warn('Parámetros que faltan en intersecciones de funciones');
            } else {
                if (img.width) {
                    ctx.drawImage(img, this.x, this.y);
                } else {
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            }
        }
    };

    function Scene() {
        this.id = scenes.length;
        scenes.push(this);
    }

    Scene.prototype = {
        constructor: Scene,
        load: function () {},
        paint: function (ctx) {},
        act: function () {}
    };

    function loadScene(scene) {
        currentScene = scene.id;
        scenes[currentScene].load();
    }

    function random(max) {
        return ~~(Math.random() * max);
    }

    function repaint() {
        window.requestAnimationFrame(repaint);
        if (scenes.length) {
            scenes[currentScene].paint(ctx);
        }
    }

    function run() {
        setTimeout(run, 70);
        if (scenes.length) {
            scenes[currentScene].act();
        }
    }

    function init() {
        // Canvas y getContext
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        // Imagenes y sonidos
        iBody.src = 'cuerpo.PNG';
        iFood.src = 'vg.png';
        aEat.src = 'sonidoManzana.mp3';
        aDie.src = 'muerte.mp3';

        // Crear Comida
        food = new Rectangle(80, 80, 22, 22);

        // Start game
        run();
        repaint();
    }

    // Main Scene
    mainScene = new Scene();

    mainScene.paint = function (ctx) {
        // Limpiar canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, 750, 400);

        // Dibujar Textos
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'italic 20pt Calibri';
        ctx.fillText('Juego Elaborado por Mario',  350, 200);
        ctx.fillText('Presione Enter Para Iniciar', 350, 250);
    };

    mainScene.act = function () {
        // Cargar siguiente escena
        if (lastPress === KEY_ENTER) {
            loadScene(gameScene);
            lastPress = null;
        }
    };

    // Jugar escena
    gameScene = new Scene();

    gameScene.load = function () {
        score = 0;
        dir = 1;
        body.length = 0;
        body.push(new Rectangle(40, 40, 20, 20));
        body.push(new Rectangle(0, 0, 20, 20));
        body.push(new Rectangle(0, 0, 20, 20));
        food.x = random(canvas.width / 20 - 1) * 20;
        food.y = random(canvas.height / 20 - 1) * 20;
        gameover = false;
    };

    gameScene.paint = function (ctx) {
        var i = 0,
            l = 0;

        // Lipiar canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar Jugador
        ctx.strokeStyle = '#0f0';
        for (i = 0, l = body.length; i < l; i += 1) {
            body[i].drawImage(ctx, iBody);
        }

        // Dibujar Comida
        ctx.strokeStyle = '#f00';
        food.drawImage(ctx, iFood);

        // Dibujar puntaje
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('Puntaje: ' + score, 0, 30);


        // Dibujar pause
        if (pause) {
            ctx.textAlign = 'center';
            if (gameover) {
                ctx.fillText('Juego Terninado Iniciar Juego', 350, 200);
            } else {
                ctx.fillText('PAUSADO', 350, 200);
            }
        }
    };

    gameScene.act = function () {
        var i = 0,
            l = 0;

        if (!pause) {
            // GameOver Reiniciar
            if (gameover) {
                loadScene(mainScene);
            }

            // Mover cuerpo
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }

            // Cambar Direccion
            if (lastPress === KEY_UP && dir !== 2) {
                dir = 0;
            }
            if (lastPress === KEY_RIGHT && dir !== 3) {
                dir = 1;
            }
            if (lastPress === KEY_DOWN && dir !== 0) {
                dir = 2;
            }
            if (lastPress === KEY_LEFT && dir !== 1) {
                dir = 3;
            }

            // Mover Caveza
            if (dir === 0) {
                body[0].y -= 20;
            }
            if (dir === 1) {
                body[0].x += 20;
            }
            if (dir === 2) {
                body[0].y += 20;
            }
            if (dir === 3) {
                body[0].x -= 20;
            }

            // Out Screen
            if (body[0].x > canvas.width - body[0].width) {
                body[0].x = 0;
            }
            if (body[0].y > canvas.height - body[0].height) {
                body[0].y = 0;
            }
            if (body[0].x < 0) {
                body[0].x = canvas.width - body[0].width;
            }
            if (body[0].y < 0) {
                body[0].y = canvas.height - body[0].height;
            }

            // Comida Intersects
            if (body[0].intersects(food)) {
                body.push(new Rectangle(0, 0, 20, 20));
                score += 1;
                food.x = random(canvas.width / 20 - 1) * 20;
                food.y = random(canvas.height / 20 - 1) * 20;
                aEat.play();
            }

            // Cuerpo Intersects
            for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }

        }
        // Pause/Des Pause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    };

    window.addEventListener('load', init, false);
}(window));
