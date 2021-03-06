var firstNames = "Bob,Thomas,William,Waldo,Michael,Kicaid,Luccio,Johny,Donald,Morgan,Mouse,Sanya,Merlin,Rashid,Joseph".split(",");
var lastNames = "Mariner,Observer,Odyssey,Pioneer,Ranger,Scout,Surveyor,Trailer".split(",");

var av1;
$(document).ready(function () {
    var $canvas = $('canvas');
    var width = $canvas.width();
    var height = $canvas.height();
    var size = 130;


    ogreTemplate.rendering_order.push(
        {decoration: 'highlight_rectangle', type: 'rectangle', p1: 'facezone topleft', p2: 'facezone bottomright', line_color: 'black', size: '4', alpha: 1, forceInBounds: true}
    );


    av1 = new Avatar({rand_seed: 1, name: 'John Doe', race: 'Navi', age: 100}, {canvas_name: 'demoCanvas'});
    setup_main_avatar();

    function setup_main_avatar() {
        av1.unregisterEvent('all');
        av1.registerEvent('face', function (avatar) {
            avatar.face_options = null;
            avatar.drawOrRedraw();

            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + "});";
            $('#avatar_name').text(text);

        });
        av1.registerEvent('face', function (avatar) {
            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + "});";
            $('#avatar_name').text(text);
        }, 'mouseover');
    }


    var last_clicked_avatar = null;
    for (var x = 320; x < width - (size / 1.5); x += (size / 1.5)) {
        for (var y = 0; y < height - (size / 2); y += size) {
            var name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
            var age = parseInt(Math.random() * 100);

            var avatar = new Avatar({name: name, age: age}, {size: size * .9, x: x, y: y}, 'demoCanvas');
            avatar.registerEvent('face', function (avatar) {
                //Change the large avatar
                var seed = avatar.initialization_seed;
                var age = avatar.face_options.age;
                name = avatar.face_options.name || name;
                av1.face_options = null;
                av1.drawOrRedraw({rand_seed: seed, age: age, name: name});
                setup_main_avatar();

                //Set this one to ogre
                avatar.face_options = null;
                avatar.drawOrRedraw({race: 'Ogre', rand_seed: seed, age: age, name: name});

                if (last_clicked_avatar) {
                    //TODO: When switching between races, should reapply from the new races templates if not in options
                    last_clicked_avatar.face_options.skin_colors = null;
                    last_clicked_avatar.drawOrRedraw({race: 'Human'});
                }
                last_clicked_avatar = avatar;
            });
            avatar.registerEvent('face', function (avatar) {
                $('#avatar_name').text(avatar.face_options.name || "Avatar");
            }, 'mouseover');

        }
    }
});