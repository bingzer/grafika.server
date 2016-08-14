/**
 * Copyright 2014 Ricky Tobing
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance insert the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/**
 * Grafika.js is written with pure javascript with no dependencies.
 * Supported browser: IE9 > up, chrome, edge
 */
var Grafika = function (){	
	var GRAFIKA_VERSION = '0.10.6';
	
    // ---------------------------------------------------------- Constants -------------------------------------//
    var MODE_NONE = 'none', MODE_PAINT = 'paint', MODE_MOVE = 'move', MODE_SELECT = 'select', MODE_DELETE = 'delete';		
    // ---------------------------------------------------------- variables -------------------------------------//
	this.version = GRAFIKA_VERSION;
	
    var options = {
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        brushSize: 2,
        graphic: 'freeform',
        graphicFill: false,
        useCarbonCopy: true,
        useNavigationText: true,
        debugMode: true,
        drawingMode: 'none',
		loop: false
    };
    var animation = {};
    var frame;
    var selectedGraphics = [];
    var isMovingGraphics = false;
    var animator = null;
    
    var canvas;
    var context;
    var lastX, lastY;
    var currentGraphic;
    var callback = {
        on : function(eventName, obj){
            log('[callback] ' + eventName, obj);
        }
    };
	
	var plugins = [];
	var factory = new Grafika.Graphics.Factory();
	
	var that = this;
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// PUBLIC FUNCTIONS //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	this.initialize = function(canvasId, opts, anim) {
		//this.log('Grafika v.' + api.version);
		canvas = validateCanvas(canvasId);
		this.setAnimation(anim);	
		this.setOptions(opts);
		
		// grab plugins
		if (Grafika.Plugins){
			Grafika.Plugins.forEach(function (func){
				var plugin = func(that);
				log('Plugin: ' + (plugin.name) + ' v.' + (plugin.version || '{unknown}'));
				plugins.push(plugin);
			});
		}
	
		log('Grafika v.' + this.version + ' [initialized]', this);
		callback.on('initialized');	
	}
	
    // ----------------------------------------------------- Animations -------------------------------------//
	
	this.getAnimation = function() {
		return animation;
	}	
	this.setAnimation = function(anim){
		animation = new Grafika.Animation(this, anim);
		log('Animation (' + animation.localId + ')' +
			' name: ' + animation.name +
			', timer: ' + animation.timer + 
			', size: ' + animation.width + ' x ' + animation.height +
			', frames: ' + animation.frames.length + ' frames');
			
        canvas.setAttribute('width', animation.width);
        canvas.setAttribute('height', animation.height);
		this.setFrames(animation.frames);
	}
	this.saveAnimation = function(){
	    animation.totalFrame = animation.frames.length;
		animation.modified = false;
		animation.dateModified = Date.now();
		animation.client = {
			navigator: navigator
		};
		callback.on('animationSaved')
	}
    this.play = function() {
        if (animator)  return; // already animating
        if (!animation.timer) 
            animation.timer = 500;
		
        log('Animation started. Timer: ' + animation.timer + 'ms', animation);
        animator = window.setInterval(animate, animation.timer);
		
		callback.on('frameCount', animation.frames.length);
        callback.on('playing', true);
        this.navigateToFrame(0, true);

		function animate() {
			if (animation.currentFrame >= animation.frames.length - 1) {
				if (options.loop)
					animation.currentFrame = 0;
				else
					return that.pause();
			}
			else {
				navigateTo(animation.currentFrame + 1, false);
			}
		}
    }
    this.pause = function() {
        if (typeof animator === 'undefined') return;
        window.clearInterval(animator);
        animator = null;

        callback.on('playing', false);
        log('Animation stopped');
    }
    this.isPlaying = function() {
        return animator != null;
    }
    this.isModified = function(){
        if (animation.modified) return true;
        if (frame.modified) return true;
        return false;
    }
    this.save = function(){
        this.saveAnimation();
        this.saveFrame();
    }
    
    // ------------------------------------------------------ Frames -------------------------------------//
	
	this.getFrame = function(){
		return frame;
	}
	this.getFrames = function(){
		return animation.frames;
	}
	this.setFrames = function(frames) {		
		animation.setFrames(frames);
		frame = animation.frames[0];
		this.navigateToFrame(0);
		callback.on('frameCount', animation.totalFrame);
	}
    this.saveFrame = function() {
        frame.modified = false;
        animation.frames[animation.currentFrame] = frame;
        callback.on('frameSaved', animation.currentFrame);
    }
    this.nextFrame = function() {
        this.navigateToFrame(animation.currentFrame + 1, true);
    }
    this.previousFrame = function() {
        this.navigateToFrame(animation.currentFrame - 1, true);
    }
    this.navigateToFrame = function(idx){
		navigateTo(idx, true);
	}
	
    // ------------------------------------------------------ Graphics -------------------------------------//
	
    this.findSelectedGraphics = function(x, y) {
        selectedGraphics = [];
        for (var i = 0; i < frame.layers.length; i++){
            var layer = frame.layers[i];
            for (var j = 0; j < layer.graphics.length; j++){
                var g = layer.graphics[j];
                if (g.contains(x, y)){
                    selectedGraphics.push(g);
                    return selectedGraphics;
                }
            }
        }
		
        return selectedGraphics;
    }
	this.getSelectedGraphics = function(){
		return selectedGraphics;
	}
    this.deleteSelectedGraphics = function(){
        frame.modified = true;
        var temp = [];
		var graphics = frame.currentLayer().graphics;
        for(var i = 0; i < graphics.length; i++){
            var found = false;
            for (var j = 0; j < selectedGraphics.length; j++){
                if (graphics[i].id == selectedGraphics[j].id){
                    found = true;
                    if (found) break;
                }
            }
            
            if (!found) temp.push(graphics[i]);
        }
        graphics = temp;
        selectedGraphics = [];
        this.refresh();
    }
	this.currentGraphic = function(){
		return currentGraphic;
	};
	
    // ---------------------------------------------------- Setters/Getters -------------------------------------//
	
    this.setCallback = function(cb) {
        if (!cb) throw new Error('callback cannot be undefined');

        callback = cb;
    }
    this.setOptions = function(opts) {
        if (!opts) return;
        if (opts.backgroundColor) {
            options.backgroundColor = opts.backgroundColor;
            frame.backgroundColor = options.backgroundColor;
			frame.modified = true;
            this.refresh();
        }
        if (opts.foregroundColor) {
            options.foregroundColor = opts.foregroundColor;
            frame.foregroundColor = options.foregroundColor;
            this.refresh();
        }
        if (opts.brushSize) options.brushSize = opts.brushSize;
        if (opts.graphic) {
			var g = factory.createGraphic(opts.graphic);
			if (g) options.graphic = g.type;
            this.refresh();
        }
        if (typeof opts.graphicFill !== 'undefined' && opts.graphicFill != null) {
            options.graphicFill = opts.graphicFill;
            this.refresh();
        }
        if (typeof opts.useCarbonCopy !== 'undefined' && opts.useCarbonCopy != null) {
            options.useCarbonCopy = opts.useCarbonCopy;
            this.refresh();
        }
        if (typeof opts.useNavigationText !== 'undefined' && opts.useNavigationText != null) {
            options.useNavigationText = opts.useNavigationText;
            this.refresh();
        }
		if (typeof opts.loop !== 'undefined' && opts.loop != null) {
			options.loop = opts.loop;
		}
        if (opts.drawingMode){
            var mode = opts.drawingMode.toLowerCase();
            if (mode != MODE_NONE && mode != MODE_PAINT && mode != MODE_MOVE && mode != MODE_SELECT && mode != MODE_DELETE)
                throw new Error('Drawing mode is not supported: ' + mode);
            options.drawingMode = mode;
            if (options.drawingMode == MODE_PAINT || options.drawingMode == MODE_NONE)
            this.refresh();
			if (options.drawingMode == MODE_DELETE) {
				this.deleteSelectedGraphics();
				this.refresh();
			}
        }
        if (typeof opts.debugMode !== 'undefined' && opts.debugMode != null){
            options.debugMode = opts.debugMode;
        }
        log("Options: ", options);
    }
    this.getOptions = function(){
        return options;
    }
	this.getGraphicsFactory = function() {
		return factory;
	}
	this.getCanvas = function(){
		return canvas;
	}
	
    // ---------------------------------------------------- Functions -------------------------------------//
	
	this.refresh = function(){
        currentGraphic = null;
        return setFrame(frame, true);
    }
	this.clear = function(){
		frame = new Grafika.Frame(that);
		this.refresh();
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// PRIVATE FUNCTIONS //////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    function onMouseDown(e) {
        if (!e || that.isPlaying()) return;
        if( navigator.userAgent.match(/Android/i) ) {
            e.preventDefault();
        }
        
        if (e.type === 'mousedown' && e.which != 1) return; // left click only
        if (that.isPlaying()) return;
        
        var eX = e.offsetX;
        var eY = e.offsetY;
        if (e.changedTouches){
            eX = e.changedTouches[0].pageX;
            eY = e.changedTouches[0].pageY;
        }

        if (options.drawingMode == MODE_MOVE && selectedGraphics.length > 0) {
            isMovingGraphics = true;
            return;
        }
        if (options.drawingMode == MODE_SELECT){
            var newSelectedGraphics = that.findSelectedGraphics(eX, eY);
            if (newSelectedGraphics.length > 0) {
                selectedGraphics = [];
                redraw();
                selectedGraphics = newSelectedGraphics;
                redraw();
                return;
            } else {
                selectedGraphics = [];
                redraw();
            }
        }

        // painting
        if (options.drawingMode != MODE_PAINT) return;
        canvas.isPainting = options.drawingMode == MODE_PAINT;
        currentGraphic = factory.createGraphic(options.graphic);
        currentGraphic.isFilled = options.graphicFill;
        currentGraphic.x = eX;
        currentGraphic.y = eY;
        currentGraphic.brushSize = options.brushSize;
        currentGraphic.backgroundColor = options.backgroundColor;
        currentGraphic.foregroundColor = options.foregroundColor;
		currentGraphic.invoke(context, 'mousedown', eX, eY);
    }

    function onMouseMove(e) {
        if (!e || that.isPlaying()) return;

        var eX = e.offsetX;
        var eY = e.offsetY;
        if (!eX || !eY){
            if (e.changedTouches){
                eX = e.changedTouches[0].pageX;
                eY = e.changedTouches[0].pageY;   
            }
            else return;
        }

        if (isMovingGraphics && selectedGraphics.length > 0) {			
			if (!lastX) lastX = eX;
			if (!lastY) lastY = eY;    
            for (var i = 0; i < selectedGraphics.length; i++) {
				selectedGraphics[i].move(context, eX, eY, lastX, lastY);
            }
            lastX = eX;
            lastY = eY;
            clearCanvas();
            redraw();
            return;
        }
        if (canvas.isPainting && currentGraphic) {
			currentGraphic.invoke(context, 'mousemove', eX, eY);
			redraw();
        }
    }

    function onMouseUp(e) {
        if (!e || that.isPlaying()) return;

        var eX = e.offsetX;
        var eY = e.offsetY;
        if (!eX || !eY){
            if (e.changedTouches){
                eX = e.changedTouches[0].pageX;
                eY = e.changedTouches[0].pageY;   
            }
            else return;
        }
        
        if (that.isPlaying() && e.type == 'mouseup') {
            pause();
            return;
        }
        if (isMovingGraphics) {
            isMovingGraphics = false;
            callback.on('frameUpdated', frame.index);
            lastX = null;
            lastY = null;
            clearCanvas();
            redraw();
            return;
        }
        if (!canvas.isPainting) return;
		
		currentGraphic.invoke(context, 'mouseup', eX, eY);
        if (currentGraphic && currentGraphic.isValid()) {
            frame.currentLayer().graphics.push(currentGraphic);
            frame.modified = true;
			callback.on('frameUpdated', frame.index);
        }

		that.refresh();
        canvas.isPainting = false;
    }

    function clear() {
        if (animator) return;
        frame = new Grafika.Frame(that);
        selectedGraphics = [];
        currentGraphic = null;
        isMovingGraphics = false;
        //movingGraphicsMode = false;
        options.drawingMode = MODE_PAINT;
        clearCanvas();
    }

    function clearCanvas() {
		// Clears the canvas
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		// background color
		context.rect(-2, -2, canvas.getAttribute('width') + 2, canvas.getAttribute('height') + 2);
		context.fillStyle = '#ffffff';
		context.fill();
    }
    
    function redraw() {
        return setFrame(frame);
    }
	
	function navigateTo(idx, save) {
        if (idx <= 0) idx = 0;
        
        // save current frames
        if (save) that.saveFrame();
        animation.currentFrame = idx;
        
        frame = animation.frames[animation.currentFrame];
        if (!frame){
            frame = new Grafika.Frame(that);
        }
        if (save) that.saveFrame();
        setFrame(frame, true);
        
        callback.on('frameChanged', frame.index);
        log('Current Frame: ' + (animation.currentFrame + 1) + '/' + animation.frames.length, frame);
	}
    
	function setFrame(fr, clear) {
        if (!fr) return;
        if (clear || !fr || fr._id != frame._id) {
            clearCanvas();
            selectedGraphics = [];
            frame = fr;
        }
        // background color
        context.rect(-2, -2, canvas.getAttribute('width') + 2, canvas.getAttribute('height') + 2);
        context.fillStyle = frame.backgroundColor;
        context.fill();
        // navigation text
        if (options.useNavigationText) {
            context.fillStyle = 'gray';
            context.font = '25px Verdana';
            context.fontWeight = 'bold';
            context.fillText((animation.currentFrame + 1) + ' / ' + (animation.frames.length), 15, 40);   
        }

        if (frame.backgroundResourceId) {
            var img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));
                fr.draw(context);
            };
            img.onerror = function (e) {
                fr.draw(context);
            };
            //img.crossOrigin="anonymous"
            img.crossOrigin = "use-credentials";
            if (!img.src) {
                //img.src = resourceService.getResourceUrl(animation, frame.backgroundResourceId);
            }
        }
        else {
            //backgroundImage.removeAttribute('src');
            fr.draw(context);
        }
    }	
    
    function validateCanvas(canvasId){
        if (!canvasId) throw new Error('canvasId is required');
        canvas = document.querySelector(canvasId) || document.getElementById(canvasId);
        if (!canvas) throw new Error('No element found for ' + canvasId + '.');
        canvas.isPainting = false;
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('touchstart', onMouseDown);        
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('touchmove', onMouseMove);        
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('touchend', onMouseUp);        
        canvas.addEventListener('mouseleave', onMouseUp);
        canvas.addEventListener('touchleave', onMouseUp);
		
        context = canvas.getContext('2d');		
        if (!context.setLineDash) {
			log('LineDash: is not available!');
            context.setLineDash = function () { }			
		}
        
        return canvas;
    }
	
	function log(){
		if (!options.debugMode) return;
		if (arguments.length == 0) return;		
		var params = [];
		for (var i = 1; i < arguments.length; i++) {
			params.push(arguments[i]);
		}
		if (params.length == 0) 
			params = '';
		
		console.log('[grafika] ' + arguments[0], params);
	}		
	
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Plugins = [];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics = {};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Drawable = function (grafika) {	
	if (!grafika) throw new Error('grafika instance is required');
	
	this.randomUid = function(){
		return (("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6));
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Animation = function (grafika, anim) {
	Grafika.Drawable.call(this, grafika);
	anim = validate(anim);
	
	this.setFrames = function (frames) {
		if (!frames || frames.length == 0)
			frames = [ new Grafika.Frame(grafika) ];
		
		this.frames = [];
		for (var i = 0; i < frames.length; i++) {
			this.frames[i] = new Grafika.Frame(grafika, frames[i]);
		}
		this.totalFrame = this.frames.length;

		return this.frames;
	}
	
	function validate(anim){
		if (!anim) {
			anim = { };			
		}
		else {
			if (!anim.name) throw new Error('Animation name is required');
			if (!anim.width || !anim.height) throw new Error('Animation width + height is required');
			if (typeof anim.frames === 'undefined' || anim.frames.length == 0) {
				anim.frames = [ new Grafika.Frame(grafika) ];
			}			
		}
		return anim;
	}
	
	this._id = anim._id; // maybe undefined if new
	this.localId = anim.localId || this.randomUid(); // always something
	this.name = anim.name || this.localId;
	this.description = anim.description || this.description;
	this.timer = anim.timer || 500;
	this.width = anim.width || window.innerWidth;
	this.height = anim.height || window.innerHeight;
	this.dateCreated = anim.dateCreated || Date.now();
	this.dateModified = anim.dateModified || this.dateCreated;
	this.views = anim.views || 0;
	this.rating = anim.rating || 0;
	this.category = anim.category || this.category;
	this.isPublic = anim.isPublic || this.isPublic;
	this.author = anim.author || this.author;
	this.userId = anim.userId || this.userId;
	this.thumbnailUrl = anim.thumbnailUrl || this.thumbnailUrl;
	this.frames = this.setFrames(anim.frames);
	this.totalFrame = anim.totalFrame || 0;
	
	this.currentFrame = anim.currentFrame || 0;
	this.modified = anim.modified || false;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Frame = function (grafika, frame) {
	Grafika.Drawable.call(this, grafika);
	if (!frame) frame = {};
	
	this.setLayers = function (layers) {
		if (!layers || layers.length == 0)
			layers = [ new Grafika.Layer(grafika) ];
		
		this.layers = [];
		for (var i = 0; i < layers.length; i++){
			this.layers[i] = new Grafika.Layer(grafika, layers[i]);
		}
		return this.layers;
	};
	this.currentLayer = function(){
        return this.layers[this.layers.length - 1];
	};
	this.draw = function(context) {
        // selected graphics
		var selectedGraphics = grafika.getSelectedGraphics();
		var animation = grafika.getAnimation();
		var options = grafika.getOptions();
		var currentGraphic = grafika.currentGraphic();
		
        for (var i = 0; i < selectedGraphics.length; i++) {
            var g = selectedGraphics[i];
            var rect = g.getBounds();
            var offset = g.brushSize / 2;
            
            context.lineWidth = 2;
            context.setLineDash([2,4 ]);
            if (this.backgroundColor != '#000000')
                context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            else context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            context.strokeRect(rect.x - offset - 2, rect.y - offset - 2, rect.width + (offset * 2) + 4, rect.height + (offset * 2) + 4);
        }        
        // previous frame
        if (options.useCarbonCopy && animation.currentFrame > 0){
            var previousFrame = animation.frames[animation.currentFrame - 1];
            if (previousFrame){
                for (var li = 0; li < previousFrame.layers.length; li++) {
					previousFrame.layers[li].draw(context, true);
                }
            }
        }
        // current frame
        for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].draw(context);
        }
		
		if (currentGraphic)
			currentGraphic.draw(context);
	}
	
	this.id = frame.id || this.randomUid();
	this.index = (frame.index >= 0 ? frame.index : (grafika.getAnimation().currentFrame || 0));
	this.backgroundColor = frame.backgroundColor || grafika.getOptions().backgroundColor;
	this.foregroundColor = frame.foregroundColor || grafika.getOptions().foregroundColor;
	this.layers = this.setLayers(frame.layers);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Layer = function (grafika, layer) {
	Grafika.Drawable.call(this, grafika);
	if (!layer) layer = {};
	
	this.setGraphics = function (graphics) {
		if (!graphics || graphics.length == 0)
			graphics = [ ];
		
		this.graphics = [];
		for (var i = 0; i < graphics.length; i++) {
			this.graphics[i] = grafika.getGraphicsFactory().createGraphic(graphics[i]);
		}
		return this.graphics;
	}
	this.draw = function (context, carbonCopy) {
		var g;
		context.setLineDash([]);
		context.lineJoin = "round";
		context.lineCap = "round";
		for(var i = 0; i < this.graphics.length; i++) {
			g = this.graphics[i];
			if (carbonCopy) {
				var rgb = hexToRgb(g.foregroundColor);
				g.foregroundAlpha = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.2)';
			}
			
			g.draw(context);
			
			delete g.foregroundAlpha;
		}
	}
	
	this.id = layer.id || this.randomUid();
	this.index = layer.index || 0;
	this.graphics = this.setGraphics(layer.graphics);
	
	function hexToRgb(hex) {		
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});
	
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Shape = function(g){
	if (!g) throw new Error('invalid type');
	if (g && !g.type) throw new Error('invalid type');
	
	this.id = g.id || (("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4));
	this.x = g.x || 0;
	this.y = g.y || 0;
	this.width = g.width || 0;
	this.height = g.height || 0;
	this.backgroundColor = g.backgroundColor || '#ffffff';
	this.foregroundColor = g.foregroundColor || '#000000';
	this.isFilled = g.isFilled || false;
	this.type = g.type;
	this.brushSize = g.brushSize || 2;
	this.isVisible = (typeof g.isVisible !== 'undefined' && g.isVisible != null) ? g.isVisible : true;
	
	this.getBounds = function (){
		return {
			x: this.width > 0 ? this.x : this.x + this.width,
			y: this.height > 0 ? this.y : this.y + this.height,
			width: Math.abs(this.width),
			height: Math.abs(this.height)
		}
	};
    this.contains = function (x, y) {
		var bounds = this.getBounds();
		return bounds.x < x && bounds.x + bounds.width > x && bounds.y < y && bounds.y + bounds.height > y;
	};
	this.isValid = function() {
		return Math.abs(this.width) > 20 && Math.abs(this.height) > 20;
	};
	this.draw = function(context) {
		context.lineWidth = this.brushSize > 1 ? this.brushSize : 1;
		context.strokeStyle = this.foregroundAlpha || this.foregroundColor;
		context.fillStyle = this.foregroundAlpha || this.foregroundColor;	
		this.onDraw(context);
	};
	this.move = function(context, x, y, lastX, lastY) {
		this.onMove(context, x, y, lastX, lastY);
	};
	this.invoke = function(context, eventType, eventX, eventY) {
		this.onEvent(context, eventType, eventX, eventY);
	};
	
	// ------------- needs to be implemented -------- //
	this.onDraw = function(context) {
		throw new Error('Not implemented onDraw()');
	};
	this.onMove = function(context, x, y, lastX, lastY) {
		throw new Error('Not implemented onMove()');
	};
	this.onEvent = function(context, eventType, eventX, eventY){
		throw new Error('Not implemented onEvent()');
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Freeform = function(g) {
	g = g || { type: 'freeform' };
	Grafika.Graphics.Shape.call(this, g);
	
	this.points = g.points || [];
	
	this.getBounds = function(){
		var rect = {
			x: this.x,
			y: this.y,
			width: this.x,
			height: this.y,
		}
		for (var pI = 0; pI < this.points.length; pI++) {
			var p = this.points[pI];
			if (rect.x > p.x)
				rect.x = p.x;
			if (rect.y > p.y)
				rect.y = p.y;
			if (rect.width < p.x)
				rect.width = p.x;
			if (rect.height < p.y)
				rect.height = p.y;
		}
		rect.width = rect.width - rect.x;
		rect.height = rect.height - rect.y;
		return rect;
	};
	this.isValid = function() {
		var rect = this.getBounds();
		return rect.width > 5 || rect.height > 5;
	};
	
	this.onDraw = function(context) {
		context.beginPath();
		context.moveTo(this.x, this.y);
		for (var i = 0; i < this.points.length; i++) {
			var point = this.points[i];
			context.lineTo(point.x, point.y);
		}
		
		if (this.isFilled)
			context.fill();
		else context.stroke();
	};
	this.onMove = function(context, x, y, lastX, lastY) {
		// implemented: don't touch (08/27/2015)
		var lastGX = this.x;
		var lastGY = this.y;
		this.x = this.x + (x - lastX);
		this.y = this.y + (y - lastY);
		var deltaX = lastGX - this.x;
		var deltaY = lastGY - this.y;
		for (var i = 0; i < this.points.length; i++){
			this.points[i].x -= deltaX;
			this.points[i].y -= deltaY;
		}
	};
	this.onEvent = function(context, eventType, eventX, eventY) {
		switch (eventType) {
			case "mousemove":
				this.points.push({ x: eventX, y: eventY });
				break;
		}
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Line = function(g){
	g = g || { type: 'line' };
	Grafika.Graphics.Shape.call(this, g);
	
	this.endX = g.endX || 0;
	this.endY = g.endY || 0;
	
	this.getBounds = function() {		
		return {
			x: this.x < this.endX ? this.x : this.endX,
			y: this.y < this.endY ? this.y : this.endY,
			width: this.x > this.endX ? this.x - this.endX : this.endX - this.x,
			height: this.y > this.endY ? this.y - this.endY : this.endY - this.y,
		}
	}
	this.isValid = function() {
		return Math.abs(this.endX - this.x) > 20 || Math.abs(this.endY - this.y) > 20;
	};
	
	this.onDraw = function(context) {
		context.moveTo(this.x, this.y);
		context.lineTo(this.endX, this.endY);
		context.stroke();
	};
	this.onMove = function(context, x, y, lastX, lastY) {
		// implemented: don't touch (08/27/2015)
		this.x = this.x + (x - lastX);
		this.y = this.y + (y - lastY);
		this.endX = this.endX + (x - lastX);
		this.endY = this.endY + (y - lastY);
	};
	this.onEvent = function(context, eventType, eventX, eventY) {
		switch (eventType) {
			case "mousemove":
                this.endX = eventX;
                this.endY = eventY;
				break;
		}
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Rectangle = function(g) {
	g = g || { type: 'rectangle' };
	Grafika.Graphics.Shape.call(this, g);
	
	this.width = g.width || 10;
	this.height = g.height || this.width;
	
	this.onDraw = function(context) {
		if (this.isFilled)
			context.fillRect(this.x, this.y, this.width, this.height);
		else {
			context.strokeRect(this.x, this.y, this.width, this.height);
		}
	};
	this.onMove = function(context, x, y, lastX, lastY) {
		this.x = this.x + (x - lastX);
		this.y = this.y + (y - lastY);
	};
	this.onEvent = function(context, eventType, eventX, eventY) {
		switch (eventType) {
			case "mousemove":
                this.width = eventX - this.x;
                this.height = eventY - this.y;
				break;
		}
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Square = function(g) {
	g = g || { type: 'square' };
	Grafika.Graphics.Rectangle.call(this, g);
	
	this.onEvent = function(context, eventType, eventX, eventY) {
		switch (eventType) {
			case "mousemove":
                this.width = eventX - this.x;
                this.height = eventY - this.y;
                this.width = this.width > this.height ? this.height : this.width;
                this.height = this.width > this.height ? this.height : this.width;
				break;
		}
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Circle = function(g) {
	g = g || { type: 'circle' };
	Grafika.Graphics.Rectangle.call(this, g);
	
	this.radius = g.radius || 5;
	
	this.getBounds = function() {	
		return {
			x: this.x - this.radius,
			y: this.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2,
		}
	}
	this.isValid = function() {
		return this.radius > 5;
	};
	
	this.onDraw = function(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		if (this.isFilled)
			context.fill();
		else
			context.stroke();
	};
	this.onEvent = function(context, eventType, eventX, eventY) {
		switch (eventType) {
			case "mousemove":
                this.radius = Math.abs(eventX - this.x);
				break;
		}
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Oval = function(g) {
	g = g || { type: 'oval' };
	Grafika.Graphics.Circle.call(this, g);
	
	this.radiusY = g.radiusY || 10;
	
	this.getBounds = function() {	
		return {
			x: this.x - this.radius,
			y: this.y - this.radiusY,
			width: this.radius * 2,
			height: this.radiusY * 2,
		}
	};
	this.isValid = function() {
		return this.radius > 10 && this.radiusY > 10;
	};
	this.onDraw = function(context) {
		context.beginPath();
		context.ellipse(this.x, this.y, this.radius, this.radiusY, 0, 0, 2 * Math.PI);
		if (this.isFilled)
			context.fill();
		else context.stroke();
	};
	this.onEvent = function(context, eventType, eventX, eventY) {
		switch (eventType) {
			case "mousemove":
                this.radius = Math.abs(eventX - this.x);
				this.radiusY = Math.abs(eventY - this.y);
				break;
		}
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Text = function(g) {
	g = g || { type: 'text' };
	if (typeof g.isFilled === 'undefined') g.isFilled = true;
	Grafika.Graphics.Rectangle.call(this, g);
	
	this.text = g.text || '';
	this.font = g.font || 'verdana';
	this.fontWeight = g.fontWeight || 'normal';
	this.height = g.height || 25;
	
	this.isValid = function() {
		return this.text && this.text.length > 0;
	};
	
	this.onDraw = function(context) {
		context.font = this.height + 'px ' + this.font;
		if (this.isFilled) {
            context.fillStyle = this.foregroundAlpha || this.foregroundColor;
			context.fillText(this.text, this.x, this.y + this.height);
		}
		else {
			context.strokeStyle = this.foregroundAlpha || this.foregroundColor;
			context.strokeText(this.text, this.x, this.y + this.height);
		}
	};
	this.onEvent = function(context, eventType, eventX, eventY){
		switch (eventType) {
			case "mouseup": 
				this.text = this.prompt('Insert text');
				this.drawFocusRectangle(context);
				
				this.draw(context);
				break;
		}
	};
	
	this.drawFocusRectangle = function(context) {
		var rect = context.measureText(this.text);
		this.width = rect.width;
		context.lineWidth = 1;
		context.setLineDash([2,4]);
		context.strokeStyle = this.foregroundColor;
		context.rect(this.x, this.y, this.width, this.height);		
	}
	this.prompt = function(text, title) {
		return prompt(text, title);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Triangle = function(g) {
	g = g || { type: 'triangle' };
	Grafika.Graphics.Rectangle.call(this, g);
	
	this.onDraw = function(context) {
		context.beginPath();
		context.moveTo(this.x + (this.width/2), this.y);
		context.lineTo(this.x, this.y + this.height);
		context.lineTo(this.x + this.width, this.y + this.height);
		context.closePath();
		if (this.isFilled)
			context.fill();
		else context.stroke();
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grafika.Graphics.Factory = function (){
	this.providers = [
		{ type: 'freeform', create: function(g) { return new Grafika.Graphics.Freeform(g) } },
		{ type: 'line', create: function(g) { return new Grafika.Graphics.Line(g) } },
		{ type: 'rectangle', create: function(g) { return new Grafika.Graphics.Rectangle(g) } },
		{ type: 'square', create: function(g) { return new Grafika.Graphics.Square(g) } },
		{ type: 'circle', create: function(g) { return new Grafika.Graphics.Circle(g) } },
		{ type: 'oval', create: function(g) { return new Grafika.Graphics.Oval(g) } },
		{ type: 'text', create: function(g) { return new Grafika.Graphics.Text(g) } },
		{ type: 'triangle', create: function(g) { return new Grafika.Graphics.Triangle(g) } },
	],
	
	this.createGraphic = function (graphicOrType) {
		if (!graphicOrType) throw new Error('Graphic/type is required');
        var g = { };
        if (typeof(graphicOrType) == 'string')
            g.type = graphicOrType;
        if (typeof(graphicOrType) == 'object')
            g = graphicOrType;
		
		if (!g.type) throw new Error('Graphic/type is required (unspecified)');
		for(var i = 0; i < this.providers.length; i++) {
			if (this.providers[i].type.toLowerCase() === g.type.toLowerCase())
				return this.providers[i].create(g);
		}
	
		throw new Error('Unsupported graphic: ' + graphicOrType);
	}
};