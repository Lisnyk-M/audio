// import {dou} from '.dog.js';
window.onload=function(){     
    var ind = document.getElementsByClassName("indicate");
	//ind[0].innerHTML = dou();
	//console.log(ind);
	//ind[0].innerHTML = 'pes';

    var x = 0, z = 0;
	var vec3 = new THREE.Vector3;

    var scene = new THREE.Scene;
	//scene.background = new THREE.Color( 0x000000, 0 );
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
    var render = new THREE.WebGLRenderer({ alpha: true, transparent: true  } ); 	//{ antialias: true },  
    // 
    render.setSize(window.innerWidth, window.innerHeight);
    render.setClearColor(0xEEEEEE, 0.7);
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;

 
    // render.setClearAlpha(1.0);

    //console.log(render.getContext());
    //ind[0].innerHTML = render.getClearAlpha();
    
    document.body.appendChild(render.domElement);

    var axes = new THREE.AxesHelper( 60 );
    scene.add(axes);
    
    // var cubeGeometry = new THREE.CubeGeometry(4,4,4);
	// var cubeMaterial = new THREE.MeshBasicMaterial(
	// 	{color: 0xff0000, wireframe: true});
    // var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
    //========================== text geometry ===========================
    var loader = new THREE.FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        var geometry = new THREE.TextGeometry( 'Hello three.js!', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 3
        } );
        var text = new THREE.Mesh(geometry, cubeMaterial);
        scene.add(text);
        text.position.set(-5, 0.3, -24);
        text.scale.set(0.02, 0.02, 0.02);
        text.castShadow = true;
    } );
//========================== end text geometry ===========================
	// create an AudioListener and add it to the camera
	var listener = new THREE.AudioListener();
	camera.add( listener );

	// create the PositionalAudio object (passing in the listener)
	var sound = new THREE.Audio( listener );

	// load a sound and set it as the PositionalAudio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load( 'sounds/song.mp3', function( buffer ) {
		sound.setBuffer( buffer );
         //sound.setRefDistance( 20 );
        sound.setVolume(0.7);
        //sound.play();
        // console.log(buffer);
    });
    // create an AudioAnalyser, passing in the sound and desired fftSize
    var analyser = new THREE.AudioAnalyser( sound, 64 );
   // listener.addEventListener('canplay', function(){});

    // get the average frequency of the sound
    // var data = analyser.getAverageFrequency();
	// create an object for the sound to play from
	// var sphere = new THREE.SphereGeometry( 7, 32, 16 );
	// var material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
	// var mesh = new THREE.Mesh( sphere, material );
	//scene.add( mesh );

	// finally add the sound to the mesh
	//mesh.add( sound );
//==========================end audio=================================
    var turn = -1;
    var tm = document.getElementsByClassName('btn');
    tm[0].addEventListener('click', play_sound);  
    // console.log(tm[0]);

    function play_sound(){
        if (turn < 0){
            sound.play();
            // console.log(sound);
            document.getElementsByClassName('btn')[0].innerHTML = 'Stop';
        }else{
            sound.stop();
            document.getElementsByClassName('btn')[0].innerHTML = 'Play Audio';
        }        
        turn *= -1;
    }


    var cubes = [];
 
    function create_cubes(buffer, mat, size){      
        var cubes_g = [];
        var pos = -10;
        for (var i=0; i<buffer.length; i++){
            cubes_g[i] = new THREE.CubeGeometry(size.x, size.y, size.z)
            cubes[i] = new THREE.Mesh(cubes_g[i], mat);
            cubes[i].position.x = pos + i * (size.x + size.x*0.01);
            cubes[i].position.y = 1;             
            cubes[i].position.z = -20;
            scene.add(cubes[i]);
        }
        // console.log(cubes);       
    }
    function update_cubes(multiple, buffer){
        // console.log(buffer);
        for (var i=0; i<buffer.length; i++){                       
            var tmp = multiple * buffer[i];
            if (tmp<0.5)
                tmp = 0.5;
            cubes[i].scale.y = tmp;
            cubes[i].position.y = tmp/2;
        }
    }

    // var cMaterial = new THREE.MeshLambertMaterial(
    //     {color: 0xff0000, wireframe: false}); 
    var screen_size = new THREE.Vector2;
    render.getDrawingBufferSize(screen_size);
    // console.log(screen_size);
    var cMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            // time: { value: 1.0 },
            // resolution: new THREE.Uniform(new THREE.Vector2())
            u_width: {value: screen_size.x},
            u_height: {value: screen_size.y}
        },        
        vertexShader: document.getElementById ('analyser_vertexShader').textContent,
        fragmentShader: document.getElementById ('analyser_fragmentShader').textContent
    });        
    var sz = new THREE.Vector3; 
    sz.x = 1;
    sz.y = 1; 
    sz.z = 1;
    create_cubes(analyser.data, cMaterial, sz);  
//==========================end cube audio============================

    var cubeGeometry = new THREE.CubeGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshPhongMaterial(
        {color: 0xcc0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);    

	cube.position.x = -40;
	cube.position.y = 3;
	cube.position.z = 0;
	cube.scale.y = 10;
	cube.castShadow = true;
	// scene.add(cube);
     
	var planeGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
	//   var planeMaterial = new THREE.MeshLambertMaterial({color: 0x00DD00, side: THREE.DoubleSide, wireframe: false});
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee00, /*side: THREE.DoubleSide, */wireframe: false});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.receiveShadow = true;
	plane.rotation.x = -0.5*Math.PI;
	//plane.scale.x = 2;
	//plane.scale.y = 2;
	scene.add(plane);

	var shaderMaterial = new THREE.ShaderMaterial( {
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	});

	var sphere_sh_geometry = new THREE.SphereBufferGeometry(10, 64, 64);
	var sphere_sh = new THREE.Mesh(sphere_sh_geometry, shaderMaterial);
    sphere_sh.position.set(-20, 10, 0);
    sphere_sh.castShadow = true;
	scene.add(sphere_sh);


	camera.position.set(40, 45, 40);
	var amColor = "#faffe3";
	var amLight = new THREE.AmbientLight(amColor, 0.9);
	scene.add(amLight);

	var light = new THREE.DirectionalLight(0xfff7e8, 1); 
	scene.add(light);
	light.position.y += 40;

	camera.lookAt(scene.position);



    //Set up shadow properties for the light
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;	
	spotLight.shadow.mapSize.width = 2048;  // default
	spotLight.shadow.mapSize.height = 2048; // default
	spotLight.shadow.camera.near = 0.5;       // default
	spotLight.shadow.camera.far = 500      // default       
    scene.add(spotLight );
    
    var manager = new THREE.LoadingManager();
    var loader = new THREE.ImageLoader(manager);
    var textureBody = new THREE.Texture();
    var textureHead = new THREE.Texture();

    loader.load('model/cerberus/Cerberus_A.jpg', function(image){
         textureBody.image = image;
         textureBody.needsUpdate = true;
    });

    var bumpMapBody = new THREE.Texture();
    loader.load('model/cerberus/Cerberus_M.jpg', function(image){
        bumpMapBody.image = image;
        bumpMapBody.needsUpdate = true;
   });


    meshes = [];
    //var body;
    var objLoader = new THREE.OBJLoader();



    objLoader.load('model/cerberus/Cerberus.obj', function(object){ 
        // console.log(object);
        //var body;
        object.traverse(function(child){
            if (child instanceof THREE.Mesh){
                meshes.push(child);
            }
        });
    
      //console.log(meshes);

		var body = meshes[0];   
        // console.log(body);
		body.scale.set(10, 10, 10);
		body.position.set(10, 3, 0);
		body.castShadow = true;
		scene.add(body);
      
        //var bumpMapBody = new THREE.TextureLoader().load('model/cerberus/Cerberus_M.jpg');
        // var blphaMapBody = new THREE.TextureLoader().load('model/cerberus/Cerberus_R.jpg');

        // body.material = new THREE.MeshNormalMaterial();
        body.material = new THREE.MeshPhongMaterial({
            map: textureBody,
            bumpMap: bumpMapBody,
            // alphaMap: blphaMapBody,
            bumpScale: 1,
            specular: 0xfff7e8           
        });      
    });    
    
    var strela = new THREE.Mesh();
    var strelkaLoader = new THREE.OBJLoader();
    strelkaLoader.load('model/stralka.obj', function(object){ 
        var meshes2 = [];
        object.traverse(function(child){
            if (child instanceof THREE.Mesh){
                meshes2.push(child);
            }
        });               
           
        strela = meshes2[0];
        strela.material = new THREE.MeshPhongMaterial({specular: 0x222222, color: 0x0000ff});
        // console.log(meshes);
        strela.castShadow = true;
        strela.position.set(0, 1, 30);
        scene.add(strela);
    });

       //==============besier============================
    var curve = new THREE.CubicBezierCurve(
        new THREE.Vector2( -10, 0 ),
        new THREE.Vector2( -5, 15 ),
        new THREE.Vector2( 20, 15 ),
        new THREE.Vector2( 10, 0 )
    );
    
    var points = curve.getPoints( 50 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    var material = new THREE.LineBasicMaterial( { color : 0xcccc00 } );
    
    // Create the final object to add to the scene
    var curveObject = new THREE.Line( geometry, material );
    curveObject.castShadow = true;
    // scene.add(curveObject);
    curveObject.position.x += 20;
    curveObject.scale.y = 5;    
   //==============end of besier============================     
    
    // var controls = new THREE.TrackballControls( camera );    
    var controls = new THREE.OrbitControls (camera, render.domElement);  
	controls.enablePan = false;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 300;
        // body.position.x += 1;
    
    var angle = 0;  
    var angle_change = 2*Math.PI/180;
    var k_left = false;
    var k_right = false;
    var k_up = false;
    var k_down = false;
     
	document.addEventListener('keydown', function(event) {
		if (event.key =="ArrowLeft")            
            k_left = true;
		if (event.key =="ArrowRight")
            k_right = true;    
		if (event.key =="ArrowUp"){
            k_up = true;
        }
		if (event.key =="ArrowDown"){
            k_down = true;
        }        
    });

    document.addEventListener('keyup', function(event) {
        if (event.key =="ArrowLeft")
            k_left = false;
        if (event.key =="ArrowRight")
            k_right = false;        
        if (event.key =="ArrowUp")
            k_up = false;
        if (event.key =="ArrowDown")
            k_down = false;                      
    });
	
    var rendering = function(){  
//=======================key test====================
        if (k_left)
            angle += angle_change;
            angle %= 2*Math.PI;
        if (k_right)
            angle -= angle_change;
            angle %= 2*Math.PI;
        if (k_up){
            z -=0.2*Math.cos(angle);
            x -=0.2*Math.sin(angle);        
        }
        if (k_down){
            z +=0.2*Math.cos(angle);
            x +=0.2*Math.sin(angle);
        }
//======================= end key test====================

        strela.position.z = z;
        strela.position.x = x;
        strela.rotation.y = angle;
		camera.getWorldDirection(vec3);
        //ind[0].innerHTML = vec3.x + '<br>' + vec3.y + '<br>' + vec3.z + '<br>' + '../';
        ind[0].innerHTML = 'x=' + x + '<br>' + 'z=' + z + '<br>' +'angle=' + angle*180/Math.PI + '<br>';
        analyser.getAverageFrequency();
        //ind[0].innerHTML = 'sound data= ' + analyser.data + '<br>' + analyser.getAverageFrequency();
        update_cubes(0.07, analyser.data);

        //console.log(camera.getWorldDirection(vec3));
        //console.log('sound data= ' + analyser.data);
        requestAnimationFrame(rendering);
        controls.update();
        render.render(scene, camera);        
    }
    rendering();
}