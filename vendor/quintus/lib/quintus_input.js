/*global Quintus:false */
/**
Quintus HTML5 Game Engine - Input Module

The code in `quintus_input.js` defines the `Quintus.Input` module, which
concerns itself with game-type (pretty anything besides touchscreen input)

@module Quintus.Input
*/

/**
* Quintus Input Module
*
* @class Quintus.Input
*/
Quintus.Input = function(Q)
{
  /**
	*
	* Convert a canvas point to a stage point, x dimension
	*
	* @method Q.canvasToStageX
	* @for Quintus.Input
	* @param {Float} x
	* @param {Q.Stage} stage
	* @returns {Integer} x
	*/
  Q.canvasToStageX = function(x,stage) {
	 x = x / Q.cssWidth * Q.width;
	 if(stage.viewport) {
		x /= stage.viewport.scale;
		x += stage.viewport.x;
	 }

	 return x;
  };

  /**
	*
	* Convert a canvas point to a stage point, y dimension
	*
	* @method Q.canvasToStageY
	* @param {Float} y
	* @param {Q.Stage} stage
	* @returns {Integer} y
	*/
  Q.canvasToStageY = function(y,stage) {
		y = y / Q.cssWidth * Q.width;
		if(stage.viewport) {
		  y /= stage.viewport.scale;
		  y += stage.viewport.y;
		}

		return y;
  };



  /**
	*
	* Button and mouse input subsystem for Quintus.
	* An instance of this class is auto-created as {{#crossLink "Q.input"}}{{/crossLink}}
	*
	* @class Q.InputSystem
	* @extends Q.Evented
	* @for Quintus.Input
	*/
  Q.InputSystem = Q.Evented.extend({

	 _containerOffset: function() {
		Q.input.offsetX = 0;
		Q.input.offsetY = 0;
		var el = Q.el;
		do {
		  Q.input.offsetX += el.offsetLeft;
		  Q.input.offsetY += el.offsetTop;
		} while(el = el.offsetParent);
	 },

	 touchLocation: function(touch) {
		var el = Q.el,
		  posX = touch.offsetX,
		  posY = touch.offsetY,
		  touchX, touchY;

		if(Q._isUndefined(posX) || Q._isUndefined(posY)) {
		  posX = touch.layerX;
		  posY = touch.layerY;
		}

		if(Q._isUndefined(posX) || Q._isUndefined(posY)) {
		  if(Q.input.offsetX === void 0) { Q.input._containerOffset(); }
		  posX = touch.pageX - Q.input.offsetX;
		  posY = touch.pageY - Q.input.offsetY;
		}

		touchX = Q.width * posX / Q.cssWidth;
		touchY = Q.height * posY / Q.cssHeight;


		return { x: touchX, y: touchY };
	 },

	 /**
	  * Activate touch button controls - pass in an options hash to override
	  *
	  * Default Options:
	  *
	  *     {
	  *        left: 0,
	  *        gutter:10,
	  *        controls: DEFAULT_TOUCH_CONTROLS,
	  *        width: Q.width,
	  *        bottom: Q.height
	  *      }
	  *
	  * Default controls are left and right buttons, a space, and 'a' and 'b' buttons, as defined as an Array of Arrays below:
	  *
	  *      [ ['left','<' ],
	  *        ['right','>' ],
	  *        [],  // use an empty array as a spacer
	  *        ['action','b'],
	  *        ['fire', 'a' ]]
	  *
	  * @method touchControls
	  * @for Q.InputSystem
	  * @param {Object} [opts] - Options hash
	  */
	 touchControls: function(opts)
	 {

		if(this.touchEnabled) { return false; }
		if(!hasTouch) { return false; }

		Q.input.keypad = opts = Q._extend({
		  left: 0,
		  gutter:10,
		  controls: DEFAULT_TOUCH_CONTROLS,
		  width: Q.width,
		  bottom: Q.height
		},opts);

		opts.unit = (opts.width / opts.controls.length);
		opts.size = opts.unit - 2 * opts.gutter;

		function getKey(touch) {
		  var pos = Q.input.touchLocation(touch);
		  for(var i=0,len=opts.controls.length;i<len;i++) {
			 if(pos.x < opts.unit * (i+1) && pos.y > (Q.height - opts.unit)) {
				return opts.controls[i][0];
			 }
		  }
		}

		function touchDispatch(event) {
		  var wasOn = {},
				i, len, tch, key, actionName;

		  // Reset all the actions bound to controls
		  // but keep track of all the actions that were on
		  for(i=0,len = opts.controls.length;i<len;i++) {
			 actionName = opts.controls[i][0];
			 if(Q.inputs[actionName]) { wasOn[actionName] = true; }
			 Q.inputs[actionName] = false;
		  }

		  var touches = event.touches ? event.touches : [ event ];

		  for(i=0,len=touches.length;i<len;i++) {
			 tch = touches[i];
			 key = getKey(tch);

			 if(key) {
				// Mark this input as on
				Q.inputs[key] = true;

				// Either trigger a new action
				// or remove from wasOn list
				if(!wasOn[key]) {
				  Q.input.trigger(key);
				} else {
				  delete wasOn[key];
				}
			 }
		  }

		  // Any remaining were on the last frame
		  // and need to trigger an up action
		  for(actionName in wasOn) {
			 Q.input.trigger(actionName + "Up");
		  }

		  return null;
		}

		this.touchDispatchHandler = function(e) {
		  touchDispatch(e);
		  e.preventDefault();
		};


		Q._each(["touchstart","touchend","touchmove","touchcancel"],function(evt) {
		  Q.el.addEventListener(evt,this.touchDispatchHandler);
		},this);

		this.touchEnabled = true;
	 },

	 /**
	  * Turn off touch (buytton and joypad) controls and remove event listeners
	  *
	  * @method disableTouchControls
	  * @for Q.InputSystem
	  */
	 disableTouchControls: function() {
		Q._each(["touchstart","touchend","touchmove","touchcancel"],function(evt) {
		  Q.el.removeEventListener(evt,this.touchDispatchHandler);
		},this);

		Q.el.removeEventListener('touchstart',this.joypadStart);
		Q.el.removeEventListener('touchmove',this.joypadMove);
		Q.el.removeEventListener('touchend',this.joypadEnd);
		Q.el.removeEventListener('touchcancel',this.joypadEnd);
		this.touchEnabled = false;

		// clear existing inputs
		for(var input in Q.inputs) {
		  Q.inputs[input] = false;
		}
	 },

	 /**
	  * Activate mouse controls - mouse controls don't trigger events, but just set `Q.inputs['mouseX']` & `Q.inputs['mouseY']` on each frame.
	  *
	  * Default options:
	  *
	  *     {
	  *       stageNum: 0,
	  *       mouseX: "mouseX",
	  *       mouseY: "mouseY",
	  *       cursor: "off"
	  *     }
	  *
	  * @method mouseControls
	  * @for Q.InputSystem
	  * @param {Object} [options] - override default options
	  */
	 mouseControls: function(options) {
		options = options || {};

		var stageNum = options.stageNum || 0;
		var mouseInputX = options.mouseX || "mouseX";
		var mouseInputY = options.mouseY || "mouseY";
		var cursor = options.cursor || "off";

		var mouseMoveObj = {};

		if(cursor !== "on") {
			 if(cursor === "off") {
				  Q.el.style.cursor = 'none';
			 }
			 else {
				  Q.el.style.cursor = cursor;
			 }
		}

		Q.inputs[mouseInputX] = 0;
		Q.inputs[mouseInputY] = 0;

		Q._mouseMove = function(e) {
		  e.preventDefault();
		  var touch = e.touches ? e.touches[0] : e;
		  var el = Q.el,
				posX = touch.offsetX,
				posY = touch.offsetY,
				eX, eY,
				stage = Q.stage(stageNum);

		  if(Q._isUndefined(posX) || Q._isUndefined(posY)) {
			 posX = touch.layerX;
			 posY = touch.layerY;
		  }

		  if(Q._isUndefined(posX) || Q._isUndefined(posY)) {
			 if(Q.input.offsetX === void 0) { Q.input._containerOffset(); }
			 posX = touch.pageX - Q.input.offsetX;
			 posY = touch.pageY - Q.input.offsetY;
		  }

		  if(stage) {
			 mouseMoveObj.x= Q.canvasToStageX(posX,stage);
			 mouseMoveObj.y= Q.canvasToStageY(posY,stage);

			 Q.inputs[mouseInputX] = mouseMoveObj.x;
			 Q.inputs[mouseInputY] = mouseMoveObj.y;

			 Q.input.trigger('mouseMove',mouseMoveObj);
		  }
		};

		Q.el.addEventListener('mousemove',Q._mouseMove,true);
		Q.el.addEventListener('touchstart',Q._mouseMove,true);
		Q.el.addEventListener('touchmove',Q._mouseMove,true);
	 },

	 /**
	  * Turn off mouse controls
	  *
	  * @method disableMouseControls
	  * @for Q.InputSystem
	  */
	 disableMouseControls: function() {
		if(Q._mouseMove) {
		  Q.el.removeEventListener("mousemove",Q._mouseMove, true);
		  Q.el.style.cursor = 'inherit';
		  Q._mouseMove = null;
		}
	 },

	 /**
	  * Draw the touch buttons on the screen
	  *
	  * overload this to change how buttons are drawn
	  *
	  * @method drawButtons
	  * @for Q.InputSystem
	  */
	 drawButtons: function() {
		var keypad = Q.input.keypad,
			 ctx = Q.ctx;

		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		for(var i=0;i<keypad.controls.length;i++) {
		  var control = keypad.controls[i];

		  if(control[0]) {
			 ctx.font = "bold " + (keypad.size/2) + "px arial";
			 var x = keypad.left + i * keypad.unit + keypad.gutter,
				  y = keypad.bottom - keypad.unit,
				  key = Q.inputs[control[0]];

			 ctx.fillStyle = keypad.color || "#FFFFFF";
			 ctx.globalAlpha = key ? 1.0 : 0.5;
			 ctx.fillRect(x,y,keypad.size,keypad.size);

			 ctx.fillStyle = keypad.text || "#000000";
			 ctx.fillText(control[1],
							  x+keypad.size/2,
							  y+keypad.size/2);
		  }
		}

		ctx.restore();
	 },

	 drawCircle: function(x,y,color,size) {
		var ctx = Q.ctx,
			 joypad = Q.joypad;

		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha=joypad.alpha;
		ctx.fillStyle = color;
		ctx.arc(x, y, size, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	 },



	 /**
	  * Draw the joypad on the screen
	  *
	  * overload this to change how joypad is drawn
	  *
	  * @method drawJoypad
	  * @for Q.InputSystem
	  */
	 drawJoypad: function() {
		var joypad = Q.joypad;
		if(joypad.joypadTouch !== null) {
		  Q.input.drawCircle(joypad.centerX,
									joypad.centerY,
									joypad.background,
									joypad.size);

		  if(joypad.x !== null) {
			 Q.input.drawCircle(joypad.x,
									joypad.y,
									joypad.color,
									joypad.center);
		  }
		}

	 },

	 /**
	  * Called each frame by the stage game loop to render any onscreen UI
	  *
	  * calls `drawJoypad` and `drawButtons` if enabled
	  *
	  * @method drawCanvas
	  * @for Q.InputSystem
	  */
	 drawCanvas: function() {
		if(this.touchEnabled) {
		  this.drawButtons();
		}

		if(this.joypadEnabled) {
		  this.drawJoypad();
		}
	 }


  });

  /**
	* Instance of the input subsytem that is actually used during gameplay
	*
	* @property Q.input
	* @for Quintus.Input
	* @type Q.InputSystem
	*/
  Q.input = new Q.InputSystem();

  /**
	* Helper method to activate controls with default options
	*
	* @for Quintus.Input
	* @method Q.controls
	* @param {Boolean} joypad - enable 4-way joypad (true) or just left, right controls (false, undefined)
	*/
  Q.controls = function(joypad) {
	 Q.input.keyboardControls();

	 if(joypad) {
		Q.input.touchControls({
		  controls: [ [],[],[],['action','b'],['fire','a']]
		});
		Q.input.joypadControls();
	 } else {
		Q.input.touchControls();
	 }

	 return Q;
  };


  /**
	* Step Controls component
	*
	* Adds Step (square grid based) 4-ways controls onto a Sprite
	*
	* Adds the following properties to the entity:
	*
	*      {
	*        stepDistance: 32, // should be tile size
	*        stepDelay: 0.2  // seconds to delay before next step
	*      }
	*
	*
	* @class stepControls
	* @for Quintus.Input
	*/
  Q.component("stepControls", {

	 collision: function(col) {
		var p = this.entity.p;

		if(p.stepping) {
		  p.stepping = false;
		  p.x = p.origX;
		  p.y = p.origY;
		}

	 },

  });
};
