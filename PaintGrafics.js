var WJO = [];
var ClrShm = [];
ClrShm["Gray"] = [0,131586,328965,460551,657930,789516,986895,1184274,1315860,1513239,1644825,1842204,1973790,2171169,2368548,2500134,2697513,2829099,3026478,3158064,3355443,3552822,3684408,3881787,4013373,4210752,4342338,4539717,4737096,4868682,5066061,5197647,5395026,5592405,5723991,5921370,6052956,6250335,6381921,6579300,6776679,6908265,7105644,7237230,7434609,7566195,7763574,7960953,8092539,8289918,8421504,8618883,8750469,8947848,9145227,9276813,9474192,9605778,9803157,9934743,10132122,10329501,10461087,10658466,10790052,10987431,11184810,11316396,11513775,11645361,11842740,11974326,12171705,12369084,12500670,12698049,12829635,13027014,13158600,13355979,13553358,13684944,13882323,14013909,14211288,14342874,14540253,14737632,14869218,15066597,15198183,15395562,15527148,15724527,15921906,16053492,16250871,16382457,16579836,16777215];
ClrShm["Jet"] = [127,137,148,158,168,179,189,199,209,220,230,240,251,1791,4351,7167,9727,12287,14847,17663,20223,22783,25599,28159,30719,33535,36095,38655,41215,44031,46591,49151,51967,54527,57087,59903,62463,65023,655349,1310699,1966049,2621399,3342284,3997634,4652984,5373869,6029219,6684569,7405454,8060804,8716154,9371504,10092389,10747739,11403089,12123974,12779324,13434674,14155559,14810909,15466259,16121609,16776448,16773888,16771328,16768512,16765952,16763392,16760576,16758016,16755456,16752640,16750080,16747520,16744960,16742144,16739584,16737024,16734208,16731648,16729088,16726272,16723712,16721152,16718592,16715776,16713216,16449536,15728640,15073280,14417920,13697024,13041664,12386304,11730944,11010048,10354688,9699328,8978432,8323072];
ClrShm["HSV"] = [16711680,16715520,16719360,16723456,16727296,16731392,16735232,16739328,16743168,16747264,16751104,16755200,16759040,16762880,16766976,16770816,16774912,16252672,15204096,14221056,13172480,12189440,11206400,10157824,9174784,8126208,7143168,6094592,5111552,4062976,3079936,2031360,1048320,65280,65295,65310,65326,65341,65357,65372,65388,65403,65419,65434,65450,65465,65480,65496,65511,65527,63487,59391,55551,51455,47615,43775,39679,35839,31743,27903,23807,19967,15871,12031,7935,4095,255,983295,1966335,3014911,3997951,5046527,6029567,7078143,8061183,9109759,10092799,11141375,12124415,13107455,14156031,15139071,16187647,16711927,16711911,16711896,16711880,16711865,16711850,16711834,16711819,16711803,16711788,16711772,16711757,16711741,16711726,16711710,16711695,16711680];

function ReadJSON(_tx,_op,site)
{
  $.getJSON( site, 
		function(json)
		{
			CreateSchedule(_tx,_op,Normalize(json,10));
		}
	);
};

function Normalize(json,needRange)
{
	var zMin = json.mas[0][0];
	var zMax = zMin;
	var n = json.n - 1;
	var m = json.m - 1;
	for(var i = 0;i <= n;i++)
		for(var j = 0;j <= m;j++)
		{
			if (zMin > json.mas[i][j])
				zMin = json.mas[i][j];
			if (zMax < json.mas[i][j])
				zMax = json.mas[i][j];
		}	
	var zRange = zMax - zMin;
	var mul = needRange / zRange;
	for(var i = 0;i <= n;i++)
		for(var j = 0;j <= m;j++)
			json.mas[i][j] *= mul;
	return json;
};

function ChangeScheme(__tx,__op)
{
	WJO[__tx.id] = CreateGraph(WJO[__tx.id],__op.value);
};

function CreateGraph(opt,index_clr)
{	
	var zMin = opt.json.mas[0][0];
	var zMax = opt.json.mas[0][0];
	var n = opt.json.n - 1;
	var m = opt.json.m - 1;
	for(var i = 0;i <= n;i++)
		for(var j = 0;j <= m;j++)
		{
			if (zMin > opt.json.mas[i][j])
				zMin = opt.json.mas[i][j];
			if (zMax < opt.json.mas[i][j])
				zMax = opt.json.mas[i][j];
		}	
	opt.meshFunction = function(xx, yy) 
	{	
		xx = Math.round(n * xx);
		yy = Math.round(m * yy);
		var z = opt.json.mas[xx][yy];
		if ( isNaN(z) )
			return new THREE.Vector3(0,0,0); 
		else
			return new THREE.Vector3(xx, yy, z);
	};
		
	opt.graphGeometry = new THREE.ParametricGeometry( opt.meshFunction, n, m, true ) ;
	opt.graphGeometry.computeBoundingBox();	
	zMin = opt.graphGeometry.boundingBox.min.z;
	zMax = opt.graphGeometry.boundingBox.max.z;
	var zRange = zMax - zMin;
		
	var color, point, face, numberOfSides, vertexIndex;
	var faceIndices = [ 'a', 'b', 'c', 'd' ];
	
	for ( var i = 0; i < opt.graphGeometry.vertices.length; i++ ) 
	{
		point = opt.graphGeometry.vertices[ i ];
		var temp = (zMax - point.z) / zRange;
		var ii = Math.round(temp * 100);
		ii = Math.min(ii,99);
		ii = Math.max(ii,0);
		color = new THREE.Color( ClrShm[index_clr][ii]);
		opt.graphGeometry.colors[i] = color; 
	}
		
	for ( var i = 0; i < opt.graphGeometry.faces.length; i++ ) 
	{
		face = opt.graphGeometry.faces[ i ];
		numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
		for( var j = 0; j < numberOfSides; j++ ) 
		{
			vertexIndex = face[ faceIndices[ j ] ];
			face.vertexColors[ j ] = opt.graphGeometry.colors[ vertexIndex ];
		}
	}
	opt.wireMaterial.map.repeat.set( n , m );
	if (opt.graphMesh)
	{
		opt.scene.remove(opt.graphMesh);
	}
	opt.graphMesh = new THREE.Mesh( opt.graphGeometry, opt.wireMaterial );
	opt.scene.add(opt.graphMesh);
	
	opt.camera.position.set( 2 * n, 2 * m, 4 * zMax);
	opt.camera.up = new THREE.Vector3( 0, 0, 1 );	
	
	return opt;
};

function CreateSchedule(__id, __op, json)
{	
	var opt = 
	{
		container:0, scene:0, camera:0, renderer:0, controls:0,
		keyboard : new THREEx.KeyboardState(),
		meshFunction:0,
		wireMaterial:0,
		json:0,
		graphGeometry:0,
		graphMesh:0,
	};
	var init = function()
	{	
		opt.scene = new THREE.Scene();
		var SCREEN_WIDTH = parseInt(__id.style.width), SCREEN_HEIGHT = parseInt(__id.style.height);
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT , NEAR = 0.1, FAR = 20000;
		opt.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		opt.camera.up = new THREE.Vector3( 0, 0, 1 );
		opt.camera.lookAt(opt.scene.position);	
		opt.scene.add(opt.camera);

		if ( Detector.webgl )
			opt.renderer = new THREE.WebGLRenderer( {antialias:true} );
		else
			opt.renderer = new THREE.CanvasRenderer();
		opt.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		opt.container = __id;
		opt.container.appendChild( opt.renderer.domElement );
		opt.controls = new THREE.TrackballControls( opt.camera, opt.renderer.domElement );			
		opt.scene.add( new THREE.AxisHelper() );

		var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, wireframe: true, side:THREE.DoubleSide } ); 
		var floorGeometry = new THREE.PlaneGeometry(1000,1000,10,10);
		var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
		floor.position.z = -0.01;
		opt.scene.add(floor);
				
		var normMaterial = new THREE.MeshNormalMaterial;
		var shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
				
		var wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
		wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
		wireTexture.repeat.set( 40, 40 );
		opt.wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );

		opt.renderer.setClearColorHex( 0x888888, 1 );		
	};
	
	init();
	
	opt.json = json;
	
	opt = CreateGraph(opt,__op.value); 

	var animate = function()
	{
		requestAnimationFrame( animate );
		opt.renderer.render( opt.scene, opt.camera);	
		opt.controls.update();
	};
	
	animate();
	WJO[__id.id] = opt;
};
