var WJO = [];
var ClrShm = [];
ClrShm["Gray"] = [0,131586,328965,460551,657930,789516,986895,1184274,1315860,1513239,1644825,1842204,1973790,2171169,2368548,2500134,2697513,2829099,3026478,3158064,3355443,3552822,3684408,3881787,4013373,4210752,4342338,4539717,4737096,4868682,5066061,5197647,5395026,5592405,5723991,5921370,6052956,6250335,6381921,6579300,6776679,6908265,7105644,7237230,7434609,7566195,7763574,7960953,8092539,8289918,8421504,8618883,8750469,8947848,9145227,9276813,9474192,9605778,9803157,9934743,10132122,10329501,10461087,10658466,10790052,10987431,11184810,11316396,11513775,11645361,11842740,11974326,12171705,12369084,12500670,12698049,12829635,13027014,13158600,13355979,13553358,13684944,13882323,14013909,14211288,14342874,14540253,14737632,14869218,15066597,15198183,15395562,15527148,15724527,15921906,16053492,16250871,16382457,16579836,16777215];
ClrShm["Jet"] = [127,137,148,158,168,179,189,199,209,220,230,240,251,1791,4351,7167,9727,12287,14847,17663,20223,22783,25599,28159,30719,33535,36095,38655,41215,44031,46591,49151,51967,54527,57087,59903,62463,65023,655349,1310699,1966049,2621399,3342284,3997634,4652984,5373869,6029219,6684569,7405454,8060804,8716154,9371504,10092389,10747739,11403089,12123974,12779324,13434674,14155559,14810909,15466259,16121609,16776448,16773888,16771328,16768512,16765952,16763392,16760576,16758016,16755456,16752640,16750080,16747520,16744960,16742144,16739584,16737024,16734208,16731648,16729088,16726272,16723712,16721152,16718592,16715776,16713216,16449536,15728640,15073280,14417920,13697024,13041664,12386304,11730944,11010048,10354688,9699328,8978432,8323072];
ClrShm["HSV"] = [16711680,16715520,16719360,16723456,16727296,16731392,16735232,16739328,16743168,16747264,16751104,16755200,16759040,16762880,16766976,16770816,16774912,16252672,15204096,14221056,13172480,12189440,11206400,10157824,9174784,8126208,7143168,6094592,5111552,4062976,3079936,2031360,1048320,65280,65295,65310,65326,65341,65357,65372,65388,65403,65419,65434,65450,65465,65480,65496,65511,65527,63487,59391,55551,51455,47615,43775,39679,35839,31743,27903,23807,19967,15871,12031,7935,4095,255,983295,1966335,3014911,3997951,5046527,6029567,7078143,8061183,9109759,10092799,11141375,12124415,13107455,14156031,15139071,16187647,16711927,16711911,16711896,16711880,16711865,16711850,16711834,16711819,16711803,16711788,16711772,16711757,16711741,16711726,16711710,16711695,16711680];

var QOI;

function SCHEDULE(s)
{
	if (!s.renderID || !s.nameVariable)
	{
		alert("The main fields aren't filled : renderID, nameVariable");
		exit();
	}
	this.width = s.width ? s.width : 300;
	this.height = s.height ? s.height : 300;
	this.URLJSON = s.URLJSON ? s.URLJSON : "data.json";
	this.renderID = s.renderID;
	this.ColorScheme = s.ColorScheme ? s.ColorScheme : "Jet";
	this.nameVariable = s.nameVariable;
	var scene = 0;
	var camera = 0;
	var renderer = 0;
	var controls = 0;
	var keyboard = new THREEx.KeyboardState();
	var meshFunction = 0;
	var wireMaterial = 0;
	var json = 0;
	var graphGeometry = 0;
	var graphMesh = 0;
	var initGUI = false;
	var BoundingBoxx = 0;
	var cube = 0;
	var renderSTART = false;
	var zMin,zMax;
	var _WIREFRAME = false;
	var median = 0;
	
	this.ReadJSON = function()
	{		
		//alert("START READ");
		var url = this.URLJSON;
		$.ajax(
		{
			url: url,
			dataType: "json",
			async: false,
			success: function(data)
			{
				QOI = data;
			}
		});
		json = QOI;
		//alert("END READ");
	};
	
	this.InitScene = function()
	{
		//alert("START INIT");
		scene = new THREE.Scene();
		
		var VIEW_ANGLE = 45, ASPECT = this.width / this.height , NEAR = 0.1, FAR = 20000;
		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.up = new THREE.Vector3( 0, 0, 1 );
		camera.lookAt(scene.position);	
		scene.add(camera);
			
		if ( Detector.webgl )
			renderer = new THREE.WebGLRenderer( {antialias:true} );
		else
			renderer = new THREE.CanvasRenderer();
			
		renderer.setSize(this.width, this.height);
		document.getElementById(this.renderID.id + "Renderer").appendChild( renderer.domElement );
		
		controls = new THREE.TrackballControls( camera, renderer.domElement );			
		
		//scene.add(new THREE.AxisHelper(1000));
				
		var wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
		wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
		wireTexture.repeat.set( 40, 40 );
		wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide,wireframe:false } );
		renderer.setClearColorHex( 0x888888, 1 );
		//alert("END INIT");
	};
	
	this.CreateSchedule = function()
	{
		//alert("START SCHEDULE");
		if (json == 0)
			this.ReadJSON();
		zMin = json.mas[0][0];
		zMax = json.mas[0][0];
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
		var meshFunction = function(xx, yy) 
		{	
			xx = Math.round(n * xx);
			yy = Math.round(m * yy);
			var z = json.mas[xx][yy];
			if ( isNaN(z) )
				return new THREE.Vector3(0,0,0); 
			else
				return new THREE.Vector3(xx, yy, z);
		};
			
		graphGeometry = new THREE.ParametricGeometry( meshFunction, n, m, true ) ;	
		graphGeometry.computeBoundingBox();	
		
		zMin = graphGeometry.boundingBox.min.z;
		zMax = graphGeometry.boundingBox.max.z;
		var zRange = zMax - zMin;
		
		var color, point, face, numberOfSides, vertexIndex;
		var faceIndices = [ 'a', 'b', 'c', 'd' ];
		
		for ( var i = 0; i < graphGeometry.vertices.length; i++ ) 
		{
			point = graphGeometry.vertices[ i ];
			var temp = (zMax - point.z) / zRange;
			var ii = Math.round(temp * 100);
			ii = Math.min(ii,99);
			ii = Math.max(ii,0);
			color = new THREE.Color(ClrShm[this.ColorScheme][ii]);
			graphGeometry.colors[i] = color; 
		}

		for ( var i = 0; i < graphGeometry.faces.length; i++ ) 
		{
			face = graphGeometry.faces[ i ];
			numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
			for( var j = 0; j < numberOfSides; j++ ) 
			{
				vertexIndex = face[ faceIndices[ j ] ];
				face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
			}
		}
		
		wireMaterial.map.repeat.set( n , m );
		
		camera.position.set( n, m, 2 * zMax);
		camera.up = new THREE.Vector3( 0, 0, 1 );
		_WIREFRAME = false;
		graphMesh = new THREE.Mesh( graphGeometry,wireMaterial );
		scene.add(graphMesh);	
		graphMesh.position.set( - (n / 2), -( m / 2), - (zRange / 2 ));
		//alert("END SCHEDULE");
	};
	
	var Animate = function()
	{
		requestAnimationFrame( Animate );
		renderer.render( scene, camera);	
		controls.update();
	};	
	
	this.Render = function()
	{
		//alert("START RENDER");
		if (initGUI == false)
			this.CreateGUI();
		if (scene == 0)
			this.InitScene();
		if (graphMesh == 0)
			this.CreateSchedule();
		Animate();
		renderSTART = true;
		//alert("END RENDER");
	};
	
	this.Normalize = function(needRange)
	{
		if (json == 0)
			this.ReadJSON();
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
	};
	
	this.ChangeColorScheme = function()
	{
		this.ColorScheme = document.getElementById(this.renderID.id + "ColorList").value;
		
		var zRange = zMax - zMin;
		var color, point, face, numberOfSides, vertexIndex;
		var faceIndices = [ 'a', 'b', 'c', 'd' ];
		
		for ( var i = 0; i < graphGeometry.vertices.length; i++ ) 
		{
			point = graphGeometry.vertices[ i ];
			var temp = (zMax - point.z) / zRange;
			var ii = Math.round(temp * 100);
			ii = Math.min(ii,99);
			ii = Math.max(ii,0);
			color = new THREE.Color(ClrShm[this.ColorScheme][ii]);
			graphGeometry.colors[i] = color; 
		}

		for ( var i = 0; i < graphGeometry.faces.length; i++ ) 
		{
			face = graphGeometry.faces[ i ];
			numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
			for( var j = 0; j < numberOfSides; j++ ) 
			{
				vertexIndex = face[ faceIndices[ j ] ];
				face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
			}
		}
		
		_WIREFRAME = false;
		scene.remove(graphMesh);
		graphMesh = new THREE.Mesh( graphGeometry.clone(), wireMaterial );
		scene.add(graphMesh);
		
		graphMesh.position.set( - ((json.n-1) / 2), -( (json.m-1) / 2), - (zRange / 2 ));
	};
	
	this.Cube = function()
	{	
		if ( cube )
		{
			scene.remove(cube);
			cube = 0;
			exit();
		}
		var cubeGeometry = new THREE.CubeGeometry( json.n - 1, json.m - 1, zMax-zMin,3, 3, 3);
		var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0b0b0c, wireframe: true, transparent: false } ); 
		cube = new THREE.Mesh( cubeGeometry, wireframeMaterial );
		cube.position.z = 0.01;
		scene.add(cube);
	}
	
	this.WireFrame = function()
	{
		if (_WIREFRAME == false)
		{
			graphMesh.material = new THREE.MeshBasicMaterial( { color:0xffffff,wireframe: true} );
			_WIREFRAME = true;
			exit();
		}
		_WIREFRAME = false;
		graphMesh.material = wireMaterial;
	};
	
	this.CameraToUp = function()
	{
		camera.position.set(0,0,2 * (zMax - zMin));
		camera.up = new THREE.Vector3( -1, 0, 0 );
	};
	
	this.CameraToDown = function()
	{
		camera.position.set(0,0,-2 * (zMax - zMin));
		camera.up = new THREE.Vector3( -1, 0, 0 );
	};
	
	this.CameraToPerspect = function()
	{
		camera.position.set( 0, 1.5 * json.m , 1.5 * (zMax-zMin));
		camera.up = new THREE.Vector3( 0, 0, 1 );
	};
	
	this.Median = function()
	{
		if (median)
		{
			scene.remove(median);
			median = 0;
			exit();
		}
		var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, side:THREE.DoubleSide ,transparent:true} ); 
		var medianGeometry = new THREE.PlaneGeometry(json.n + 5,json.m + 5,10,10);
		wireframeMaterial.opacity = 0.2;
		median = new THREE.Mesh(medianGeometry, wireframeMaterial);
		median.position.z = -0.01;
		scene.add(median);
	};
	
	this.sigma2 = function()
	{
		alert("I don't know how realize this function :(");
	};
	
	this.CreateGUI = function()
	{
		initGUI = true;
		this.renderID.innerHTML = this.renderID.innerHTML + 
			'<div id="' + this.renderID.id + 'Renderer"></div>' +
			'<select id="' + this.renderID.id + 'ColorList" style="width:' + this.width + ';height:20;" onChange="' + this.nameVariable + '.ChangeColorScheme();">' +
			'<option>Jet</option><option>HSV</option><option>Gray</option></select><br>' +
			'<input type="button" style ="width:' + this.width / 3 + ';height:25;" onClick="' + this.nameVariable + '.CameraToUp();" value="View Up"/>'+
			'<input type="button" style ="width:' + this.width / 3 + ';height:25;" onClick="' + this.nameVariable + '.CameraToDown();" value="View Down"/>'+
			'<input type="button" style ="width:' + this.width / 3 + ';height:25;" onClick="' + this.nameVariable + '.CameraToPerspect();" value="View Perspect"/><br>'+
			'<input type="button" style ="width:' + this.width / 4 + ';height:25;" onClick="' + this.nameVariable + '.Cube();" value="Cube"/>'+
			'<input type="button" style ="width:' + this.width / 4 + ';height:25;" onClick="' + this.nameVariable + '.WireFrame();" value="WireFrame"/>'+
			'<input type="button" style ="width:' + this.width / 4 + ';height:25;" onClick="' + this.nameVariable + '.Median();" value="Median"/>'+
			'<input type="button" style ="width:' + this.width / 4 + ';height:25;" onClick="' + this.nameVariable + '.sigma2();" value="2sigma"/>';
	};
	
};
