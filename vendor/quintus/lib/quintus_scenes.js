/*global Quintus:false */

/**
Quintus HTML5 Game Engine - Scenes Module

The code in `quintus_scenes.js` defines the `Quintus.Scenes` module, which
adds in support for Scenes and Stages into Quintus.

Depends on the `Quintus.Sprite` module.

Scenes let you create reusable definitions for setting up levels and screens.

Stages are the primary container object in Quintus, handling Sprite management,
stepping, rendering and collision detection.

@module Quintus.Scenes
*/

/**
 * Quintus Scenes Module Class
 *
 * @class Quintus.Scenes
 */
Quintus.Scenes = function(Q) {

  /**
   Basic scene class, consisting primarily of a scene function
   and some options that are passed to the stage.

   Should be instantiated by calling `Q.scene` not new

   @class Q.Scene
   @for Quintus.Scenes
  */
  Q.Class.extend('Scene',{
    init: function(sceneFunc,opts) {
      this.opts = opts || {};
      this.sceneFunc = sceneFunc;
    }
  });

  /**
   SAT collision detection between two objects
   Thanks to doc's at: http://www.sevenson.com.au/actionscript/sat/

   This is sort of a black box - use the methods on stage like `search` and `collide` to
   run the collision system.

   @property Q.collision
   @for Quintus.Scenes
  */
  Q.collision = (function() {
    var normalX, normalY,
        offset = [ 0,0 ],
        result1 = { separate: [] },
        result2 = { separate: [] };

    function calculateNormal(points,idx) {
      var pt1 = points[idx],
          pt2 = points[idx+1] || points[0];

      normalX = -(pt2[1] - pt1[1]);
      normalY = pt2[0] - pt1[0];

      var dist = Math.sqrt(normalX*normalX + normalY*normalY);
      if(dist > 0) {
        normalX /= dist;
        normalY /= dist;
      }
    }

    function dotProductAgainstNormal(point) {
      return (normalX * point[0]) + (normalY * point[1]);

    }

    function collide(o1,o2,flip) {
      var min1,max1,
          min2,max2,
          d1, d2,
          offsetLength,
          tmp, i, j,
          minDist, minDistAbs,
          shortestDist = Number.POSITIVE_INFINITY,
          collided = false,
          p1, p2;

      var result = flip ? result2 : result1;

      offset[0] = 0; //o1.x + o1.cx - o2.x - o2.cx;
      offset[1] = 0; //o1.y + o1.cy - o2.y - o2.cy;

      // If we have a position matrix, just use those points,
      if(o1.c) {
        p1 = o1.c.points;
      } else {
        p1 = o1.p.points;
        offset[0] += o1.p.x;
        offset[1] += o1.p.y;
      }

      if(o2.c) {
        p2 = o2.c.points;
      } else {
        p2 = o2.p.points;
        offset[0] += -o2.p.x;
        offset[1] += -o2.p.y;
      }

      o1 = o1.p;
      o2 = o2.p;


      for(i = 0;i<p1.length;i++) {
        calculateNormal(p1,i);

        min1 = dotProductAgainstNormal(p1[0]);
        max1 = min1;

        for(j = 1; j<p1.length;j++) {
          tmp = dotProductAgainstNormal(p1[j]);
          if(tmp < min1) { min1 = tmp; }
          if(tmp > max1) { max1 = tmp; }
        }

        min2 = dotProductAgainstNormal(p2[0]);
        max2 = min2;

        for(j = 1;j<p2.length;j++) {
          tmp = dotProductAgainstNormal(p2[j]);
          if(tmp < min2) { min2 = tmp; }
          if(tmp > max2) { max2 = tmp; }
        }

        offsetLength = dotProductAgainstNormal(offset);
        min1 += offsetLength;
        max1 += offsetLength;

        d1 = min1 - max2;
        d2 = min2 - max1;

        if(d1 > 0 || d2 > 0) { return null; }

        minDist = (max2 - min1) * -1;
        if(flip) { minDist *= -1; }

        minDistAbs = Math.abs(minDist);

        if(minDistAbs < shortestDist) {
          result.distance = minDist;
          result.magnitude = minDistAbs;
          result.normalX = normalX;
          result.normalY = normalY;

          if(result.distance > 0) {
            result.distance *= -1;
            result.normalX *= -1;
            result.normalY *= -1;
          }

          collided = true;
          shortestDist = minDistAbs;
        }
      }

      // Do return the actual collision
      return collided ? result : null;
    }

    function satCollision(o1,o2) {
      var result1, result2, result;

      if(!o1.p.points) { Q._generatePoints(o1); }
      if(!o2.p.points) { Q._generatePoints(o2); }

      result1 = collide(o1,o2);
      if(!result1) { return false; }

      result2 = collide(o2,o1,true);
      if(!result2) { return false; }

      result = (result2.magnitude < result1.magnitude) ? result2 : result1;

      if(result.magnitude === 0) { return false; }
      result.separate[0] = result.distance * result.normalX;
      result.separate[1] = result.distance * result.normalY;

      return result;
    }

    return satCollision;
  }());


  /**
   Check for the overlap of the boudning boxes of two Sprites

   @method Q.overlap
   @for Quintus.Scenes
   @param {Q.Sprite} o1
   @param {Q.Sprite} o2
   @returns {Boolean}
  */
  Q.overlap = function(o1,o2) {
    var c1 = o1.c || o1.p || o1;
    var c2 = o2.c || o2.p || o2;

    var o1x = c1.x - (c1.cx || 0),
        o1y = c1.y - (c1.cy || 0);
    var o2x = c2.x - (c2.cx || 0),
        o2y = c2.y - (c2.cy || 0);

    return !((o1y+c1.h<o2y) || (o1y>o2y+c2.h) ||
             (o1x+c1.w<o2x) || (o1x>o2x+c2.w));
  };

  /**
   Base stage class, responsible for managing sets of sprites.

   `Q.Stage`'s aren't generally instantiated directly, but rather are created
   automatically when you call `Q.stageScene('sceneName')`

   @class Q.Stage
   @extends Q.GameObject
   @for Quintus.Scenes
  */
  Q.Stage = Q.GameObject.extend({
    // Should know whether or not the stage is paused
    defaults: {
      sort: false,
      gridW: 400,
      gridH: 400,
      x: 0,
      y: 0
    },

    init: function(scene,opts) {
      this.scene = scene;
      this.items = [];
      this.lists = {};
      this.index = {};
      this.removeList = [];
      this.grid = {};
      this._collisionLayers = [];

      this.time = 0;

      this.defaults['w'] = Q.width;
      this.defaults['h'] = Q.height;

      this.options = Q._extend({},this.defaults);
      if(this.scene)  {
        Q._extend(this.options,scene.opts);
      }
      if(opts) { Q._extend(this.options,opts); }


      if(this.options.sort && !Q._isFunction(this.options.sort)) {
          this.options.sort = function(a,b) { return ((a.p && a.p.z) || -1) - ((b.p && b.p.z) || -1); };
      }
    },

    destroyed: function() {
      this.invoke("debind");
      this.trigger("destroyed");
    },

    /**
      Load an array of assets of the form:

          [ [ "Player", { x: 15, y: 54 } ],
            [ "Enemy",  { x: 54, y: 42 } ] ]

      Either pass in the array or a string of asset name

     @method loadAssets
     @param {Array or String} asset - Array of assets or a string of asset name
     @for Q.Stage
    */
    // Load an array of assets of the form:
    // [ [ "Player", { x: 15, y: 54 } ],
    //   [ "Enemy",  { x: 54, y: 42 } ] ]
    // Either pass in the array or a string of asset name
    loadAssets: function(asset) {
      var assetArray = Q._isArray(asset) ? asset : Q.asset(asset);
      for(var i=0;i<assetArray.length;i++) {
        var spriteClass = assetArray[i][0];
        var spriteProps = assetArray[i][1];
        this.insert(new Q[spriteClass](spriteProps));
      }
    },

    /**
     executes the callback for each item in the scene

     @method each
     @param {function} callback
     @for Q.Stage
    */
    each: function(callback) {
      for(var i=0,len=this.items.length;i<len;i++) {
        callback.call(this.items[i],arguments[1],arguments[2]);
      }
    },

    /**
     invokes a functioncall for each item in the scene

     @method invoke
     @param {function} funcName
     @for Q.Stage
    */
    invoke: function(funcName) {
      for(var i=0,len=this.items.length;i<len;i++) {
        this.items[i][funcName].call(
          this.items[i],arguments[1],arguments[2]
        );
      }
    },

    /**

     @method detect
     @param {function} func
     @for Q.Stage
    */
    detect: function(func) {
      for(var i = this.items.length-1;i >= 0; i--) {
        if(func.call(this.items[i],arguments[1],arguments[2],arguments[3])) {
          return this.items[i];
        }
      }
      return false;
    },


    /**

     @method identify
     @param {function} func
     @for Q.Stage
    */
    identify: function(func) {
      var result;
      for(var i = this.items.length-1;i >= 0; i--) {
        if(result = func.call(this.items[i],arguments[1],arguments[2],arguments[3])) {
          return result;
        }
      }
      return false;
    },

    /**

     @method find
     @param {Number or String} id
     @for Q.Stage
    */
    find: function(id) {
      return this.index[id];
    },

    addToLists: function(lists,object) {
      for(var i=0;i<lists.length;i++) {
        this.addToList(lists[i],object);
      }
    },

    addToList: function(list, itm) {
      if(!this.lists[list]) { this.lists[list] = []; }
      this.lists[list].push(itm);
    },


    removeFromLists: function(lists, itm) {
      for(var i=0;i<lists.length;i++) {
        this.removeFromList(lists[i],itm);
      }
    },

    removeFromList: function(list, itm) {
      var listIndex = this.lists[list].indexOf(itm);
      if(listIndex !== -1) {
        this.lists[list].splice(listIndex,1);
      }
    },



    /**
     removes an item from the scene

     @method remove
     @param {Q.GameObject} itm - the Item to remove
     @for Q.Stage
    */
    remove: function(itm) {
      this.delGrid(itm);
      this.removeList.push(itm);
    },

    forceRemove: function(itm) {
      var idx =  this.items.indexOf(itm);
      if(idx !== -1) {
        this.items.splice(idx,1);

        if(itm.className) { this.removeFromList(itm.className,itm); }
        if(itm.activeComponents) { this.removeFromLists(itm.activeComponents,itm); }
        if(itm.container) {
          var containerIdx = itm.container.children.indexOf(itm);
          if(containerIdx !== -1) {
            itm.container.children.splice(containerIdx,1);
          }
        }

        if(itm.destroy) { itm.destroy(); }
        if(itm.p.id) {
          delete this.index[itm.p.id];
        }
        this.trigger('removed',itm);
      }
    },

    /**
     Pauses the scene, sprites will no longer be stepped but still rendered.

     @method pause
     @for Q.Stage
    */
    pause: function() {
      this.paused = true;
    },

    /**
     Unpauses the scene.

     @method unpause
     @for Q.Stage
    */
    unpause: function() {
      this.paused = false;
    },

    _gridCellCheck: function(type,id,obj,collisionMask) {
      if(Q._isUndefined(collisionMask) || collisionMask & type) {
        var obj2 = this.index[id];
        if(obj2 && obj2 !== obj && Q.overlap(obj,obj2)) {
          var col= Q.collision(obj,obj2);
          if(col) {
            col.obj = obj2;
            return col;
          } else {
            return false;
          }
        }
      }
    },

    gridTest: function(obj,collisionMask) {
      var grid = obj.grid, gridCell, col;

      for(var y = grid.Y1;y <= grid.Y2;y++) {
        if(this.grid[y]) {
          for(var x = grid.X1;x <= grid.X2;x++) {
            gridCell = this.grid[y][x];
            if(gridCell) {
              col = Q._detect(gridCell,this._gridCellCheck,this,obj,collisionMask);
              if(col) { return col; }
            }
          }
        }
      }
      return false;
    },

    collisionLayer: function(layer) {
      this._collisionLayers.push(layer);
      layer.collisionLayer = true;
      return this.insert(layer);
    },

    _collideCollisionLayer: function(obj,collisionMask) {
      var col;

      for(var i = 0,max = this._collisionLayers.length;i < max;i++) {
        var layer = this._collisionLayers[i];
        if(layer.p.type & collisionMask) {
          col = layer.collide(obj);
          if(col) { col.obj = layer;  return col; }
        }
      }
      return false;
    },

    /**
     Searches the scene for an object.

     @method search
     @param obj
     @param collisionMask - _optional_
     @for Q.Stage
    */
    search: function(obj,collisionMask) {
      var col;

      // If the object doesn't have a grid, regrid it
      // so we know where to search
      // and skip adding it to the grid only if it's not on this stage
      if(!obj.grid) { this.regrid(obj,obj.stage !== this); }

      collisionMask = Q._isUndefined(collisionMask) ? (obj.p && obj.p.collisionMask) : collisionMask;

      col = this._collideCollisionLayer(obj,collisionMask);
      col =  col || this.gridTest(obj,collisionMask);
      return col;
    },

    _locateObj: {
      p: {
        x: 0,
        y: 0,
        cx: 0,
        cy: 0,
        w: 1,
        h: 1
      }, grid: {}
    },

    /**
     Finds any object that collides with the point x,y on the stage (not on the canvas).
     If `collisionMask` is used, only checks for collisions with sprites of that type.

     @method locate
     @param {number} x
     @param {number} y
     @param collisionMask - type of the sprite _optional_
     @return the object if one is found or false
     @for Q.Stage
    */
    locate: function(x,y,collisionMask) {
      var col = null;

      this._locateObj.p.x = x;
      this._locateObj.p.y = y;

      this.regrid(this._locateObj,true);

      col = this._collideCollisionLayer(this._locateObj,collisionMask);
      col =  col || this.gridTest(this._locateObj,collisionMask);

      if(col && col.obj) {
        return col.obj;
      } else {
        return false;
      }

    },

    /**
     calculates if the given object collides with anything in the scene

     @method collide
     @param obj
     @param options - _optional_
     @return col2 || col
     @for Q.Stage
    */
    collide: function(obj,options) {
      var col, col2, collisionMask,
          maxCol, curCol, skipEvents;
      if(Q._isObject(options)) {
        collisionMask = options.collisionMask;
        maxCol = options.maxCol;
        skipEvents = options.skipEvents;
      } else {
        collisionMask = options;
      }
      collisionMask = Q._isUndefined(collisionMask) ? (obj.p && obj.p.collisionMask) : collisionMask;
      maxCol = maxCol || 3;


      Q._generateCollisionPoints(obj);
      this.regrid(obj);

      curCol = maxCol;
      while(curCol > 0 && (col = this._collideCollisionLayer(obj,collisionMask))) {
        if(!skipEvents) {
          obj.trigger('hit',col);
          obj.trigger('hit.collision',col);
        }
        Q._generateCollisionPoints(obj);
        this.regrid(obj);
        curCol--;
      }

      curCol = maxCol;
      while(curCol > 0 && (col2 = this.gridTest(obj,collisionMask))) {
        obj.trigger('hit',col2);
        obj.trigger('hit.sprite',col2);

        // Do the recipricol collision
        // TODO: extract
        if(!skipEvents) {
          var obj2 = col2.obj;
          col2.obj = obj;
          col2.normalX *= -1;
          col2.normalY *= -1;
          col2.distance = 0;
          col2.magnitude = 0;
          col2.separate[0] = 0;
          col2.separate[1] = 0;


          obj2.trigger('hit',col2);
          obj2.trigger('hit.sprite',col2);
        }

        Q._generateCollisionPoints(obj);
        this.regrid(obj);
        curCol--;
      }

      return col2 || col;
    },

    delGrid: function(item) {
      var grid = item.grid;

      for(var y = grid.Y1;y <= grid.Y2;y++) {
        if(this.grid[y]) {
          for(var x = grid.X1;x <= grid.X2;x++) {
            if(this.grid[y][x]) {
            delete this.grid[y][x][item.p.id];
            }
          }
        }
      }
    },

    addGrid: function(item) {
      var grid = item.grid;

      for(var y = grid.Y1;y <= grid.Y2;y++) {
        if(!this.grid[y]) { this.grid[y] = {}; }
        for(var x = grid.X1;x <= grid.X2;x++) {
          if(!this.grid[y][x]) { this.grid[y][x] = {}; }
          this.grid[y][x][item.p.id] = item.p.type;
        }
      }

    },

    // Add an item into the collision detection grid,
    // Ignore collision layers
    regrid: function(item,skipAdd) {
      if(item.collisionLayer) { return; }
      item.grid = item.grid || {};

      var c = item.c || item.p;

      var gridX1 = Math.floor((c.x - c.cx) / this.options.gridW),
          gridY1 = Math.floor((c.y - c.cy) / this.options.gridH),
          gridX2 = Math.floor((c.x - c.cx + c.w) / this.options.gridW),
          gridY2 = Math.floor((c.y - c.cy + c.h) / this.options.gridH),
          grid = item.grid;

      if(grid.X1 !== gridX1 || grid.X2 !== gridX2 ||
         grid.Y1 !== gridY1 || grid.Y2 !== gridY2) {

         if(grid.X1 !== void 0) { this.delGrid(item); }
         grid.X1 = gridX1;
         grid.X2 = gridX2;
         grid.Y1 = gridY1;
         grid.Y2 = gridY2;

         if(!skipAdd) { this.addGrid(item); }
      }
    },

    /**
     hides the scene

     @method hide
     @for Q.Stage
    */
    hide: function() {
      this.hidden = true;
    },

    /**
     unhides the scene

     @method show
     @for Q.Stage
    */
    show: function() {
      this.hidden = false;
    },

    /**
     stops the scene (hides and pauses)

     @method stop
     @for Q.Stage
    */
    stop: function() {
      this.hide();
      this.pause();
    },

    /**
     starts the scene (shows and unpauses)

     @method start
     @for Q.Stage
    */
    start: function() {
      this.show();
      this.unpause();
    },

    render: function(ctx) {
      if(this.hidden) { return false; }
      if(this.options.sort) {
        this.items.sort(this.options.sort);
      }
      this.trigger("prerender",ctx);
      this.trigger("beforerender",ctx);

      for(var i=0,len=this.items.length;i<len;i++) {
        var item = this.items[i];
        // Don't render sprites with containers (sprites do that themselves)
        // Also don't render if not onscreen
        if(!item.container && (item.p.renderAlways || item.mark >= this.time)) {
          item.render(ctx);
        }
      }
      this.trigger("render",ctx);
      this.trigger("postrender",ctx);
    }
  });



  Q.StageSelector = Q.Class.extend({
    emptyList: [],

    init: function(stage,selector) {
      this.stage = stage;
      this.selector = selector;

      // Generate an object list from the selector
      // TODO: handle array selectors
      this.items = this.stage.lists[this.selector] || this.emptyList;
      this.length = this.items.length;
    },

    each: function(callback) {
      for(var i=0,len=this.items.length;i<len;i++) {
        callback.call(this.items[i],arguments[1],arguments[2]);
      }
      return this;
    },

    invoke: function(funcName) {
      for(var i=0,len=this.items.length;i<len;i++) {
        this.items[i][funcName].call(
          this.items[i],arguments[1],arguments[2]
        );
      }
      return this;
    },

    trigger: function(name,params) {
      this.invoke("trigger",name,params);
    },

    destroy: function() {
      this.invoke("destroy");
    },

    detect: function(func) {
      for(var i = 0,val=null, len=this.items.length; i < len; i++) {
        if(func.call(this.items[i],arguments[1],arguments[2])) {
          return this.items[i];
        }
      }
      return false;
    },

    identify: function(func) {
      var result = null;
      for(var i = 0,val=null, len=this.items.length; i < len; i++) {
        if(result = func.call(this.items[i],arguments[1],arguments[2])) {
          return result;
        }
      }
      return false;

    },

    // This hidden utility method extends
    // and object's properties with a source object.
    // Used by the p method to set properties.
    _pObject: function(source) {
      Q._extend(this.p,source);
    },

    _pSingle: function(property,value) {
      this.p[property] = value;
    },

    set: function(property, value) {
      // Is value undefined
      if(value === void 0) {
        this.each(this._pObject,property);
      } else {
        this.each(this._pSingle,property,value);
      }

      return this;
    },

    at: function(idx) {
      return this.items[idx];
    },

    first: function() {
      return this.items[0];
    },

    last: function() {
      return this.items[this.items.length-1];
    }

  });

  // Maybe add support for different types
  // entity - active collision detection
  //  particle - no collision detection, no adding components to lists / etc
  //

  // Q("Player").invoke("shimmer); - needs to return a selector
  // Q(".happy").invoke("sasdfa",'fdsafas',"fasdfas");
  // Q("Enemy").p({ a: "asdfasf"  });

  Q.select = function(selector,scope) {
    scope = (scope === void 0) ? Q.activeStage : scope;
    scope = Q.stage(scope);
    if(Q._isNumber(selector)) {
      return scope.index[selector];
    } else {
      return new Q.StageSelector(scope,selector);
      // check if is array
      // check is has any commas
         // split into arrays
      // find each of the classes
      // find all the instances of a specific class
    }
  };


  Q.stageGameLoop = function(dt) {
    var i,len,stage;


    if(dt < 0) { dt = 1.0/60; }
    if(dt > 1/15) { dt  = 1.0/15; }

    for(i =0,len=Q.stages.length;i<len;i++) {
      Q.activeStage = i;
      stage = Q.stage();
      if(stage) {
        stage.step(dt);
      }
    }

    if(Q.ctx) { Q.clear(); }

    for(i =0,len=Q.stages.length;i<len;i++) {
      Q.activeStage = i;
      stage = Q.stage();
      if(stage) {
        stage.render(Q.ctx);
      }
    }

    Q.activeStage = 0;

    if(Q.input && Q.ctx) { Q.input.drawCanvas(Q.ctx); }
  };



  /**
   Destroys all stages

   @method clearStages
   @for Q
  */
  Q.clearStages = function() {
    for(var i=0,len=Q.stages.length;i<len;i++) {
      if(Q.stages[i]) { Q.stages[i].destroy(); }
    }
    Q.stages.length = 0;
  };


};
