/*global Quintus:false */
/**
Quintus HTML5 Game Engine - Sprites Module

The code in `quintus_sprites.js` defines the `Quintus.Sprites` module, which
add support for sprite sheets and the base sprite class.

Most games will include at a minimum `Quintus.Sprites` and `Quintus.Scenes`

@module Quintus.Sprites
*/


/**
 * Quintus Sprites Module Class
 *
 * @class Quintus.Sprites
 */
Quintus.Sprites = function(Q)
{

  /**

  Sprite sheet class - generally instantiated with `Q.sheet` new `new`


  @class Q.SpriteSheet
  @extends Q.Class
  @for Quintus.Sprites
  */
  Q.Class.extend("SpriteSheet",
  {



    /**
     Returns the starting x position of a single frame

     @method fx
     @for Q.SpriteSheet
     @param {Integer} frame
    */
    fx: function(frame)
    {
      return Math.floor((frame % this.cols) * (this.tileW + this.spacingX) + this.sx);
    },

    /**
     Returns the starting y position of a single frame

     @method fy
     @for Q.SpriteSheet
     @param {Integer} frame
    */
    fy: function(frame)
    {
      return Math.floor(Math.floor(frame / this.cols) * (this.tileH + this.spacingY) + this.sy);
    },

    /**
     Draw a single frame at x,y on the provided context

     @method draw
     @for Q.SpriteSheet
     @param {Context2D} ctx
     @param {Float} x
     @param {Float} y
     @param {Integer} frame
    */
    draw: function(ctx, x, y, frame)
    {
      if(!ctx) { ctx = Q.ctx; }
      ctx.drawImage(Q.asset(this.asset),
                    this.fx(frame),this.fy(frame),
                    this.tileW, this.tileH,
                    Math.floor(x),Math.floor(y),
                    this.tileW, this.tileH);

    }

  });

  /**
   Create a number of `Q.SpriteSheet` objects from an image asset and a sprite data JSON asset

   @method Q.compileSheets
   @for Quintus.Sprites
   @param {String} imageAsset
   @param {String spriteDataAsset
  */
  Q.compileSheets = function(imageAsset,spriteDataAsset) {
    var data = Q.asset(spriteDataAsset);
    Q._each(data,function(spriteData,name) {
      Q.sheet(name,imageAsset,spriteData);
    });
  };


  /**
   Bitmask 0 to indicate no sprites

   @property Q.SPRITE_NONE
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_NONE     = 0;

  /**
   default sprite type 1

   @property Q.SPRITE_DEFAULT
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_DEFAULT  = 1;

  /**
   particle sprite type 2

   @property Q.SPRITE_PARTICLE
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_PARTICLE = 2;

  /**
   active sprite type 4

   @property Q.SPRITE_ACTIVE
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_ACTIVE   = 4;

  /**
   friendly sprite type 8

   @property Q.SPRITE_FRIENDLY
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_FRIENDLY = 8;

  /**
   enemy sprite type 16

   @property Q.SPRITE_ENEMY
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_ENEMY    = 16;


  /**
   powerup sprite type 32

   @property Q.SPRITE_POWERUP
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_POWERUP  = 32;


  /**
   UI sprite type 64

   @property Q.SPRITE_UI
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_UI       = 64;

  /**
   all sprite type - 0xFFFF

   @property Q.SPRITE_ALL
   @for Quintus.Sprites
   @final
  */
  Q.SPRITE_ALL   = 0xFFFF;

  /**

   Basic sprite class - will render either and asset or a frame from a sprite sheet.

   Auto sets the width and height (`p.w` and `p.h`) from the provided image asset and
   centers the sprite so 0,0 is the center of the provide image.

   Most of the times you'll sub-class `Q.Sprite`

   @extends Q.GameObject
   @class Q.Sprite
   @for Quintus.Sprites
  */
  Q.GameObject.extend("Sprite",{

    /**

      Default sprite constructor, takes in a set of properties and a set of default properties (useful when you create a subclass of sprite)

      Default properties:

           {
            asset: null,  // asset to use
            sheet: null,  // sprite sheet to use (overrides asset)
            x: 0,
            y: 0,
            z: 0,
            w: 0,         // width, set from p.asset or p.sheet
            h: 0,         // height, set from p.asset or p.sheet
            cx: w/2,      // center x, defaults to center of the asset or sheet
            cy: h/2,      // center y, default same as cx
            // points defines the collision shape, override to customer the collision shape,
            // must be a convex polygon in clockwise order
            points: [  [ -w/2, -h/2 ], [  w/2, -h/2 ], [  w/2,  h/2 ], [ -w/2,  h/2 ] ],
            opacity: 1,
            angle: 0,
            frame: 0
            type:  Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE,
            name: '',

           }

      @method init
      @for Q.Sprite
      @param {Object} props - property has that will be turned into `p`
      @param {Object} [defaultProps] - default properties that are assigned only if there's not a corresponding value in `props`
    */
    init: function(props,defaultProps) {
      this.p = Q._extend({
        x: 0,
        y: 0,
        z: 0,
        opacity: 1,
        angle: 0,
        frame: 0,
        type: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE,
        name: '',
        spriteProperties: {}
      },defaultProps);


      this.children = [];

      Q._extend(this.p,props);

      this.size();
      this.p.id = this.p.id || Q._uniqueId();

      this.refreshMatrix();
    },

    /**
    Resets the width, height and center based on the
     asset or sprite sheet

    @method size
    @for Q.Sprite
    @param {Boolean} force - force a reset (call if w or h changes)
    */
    size: function(force) {
      if(force || (!this.p.w || !this.p.h)) {
        if(this.asset()) {
          this.p.w = this.asset().width;
          this.p.h = this.asset().height;
        } else if(this.sheet()) {
          this.p.w = this.sheet().tileW;
          this.p.h = this.sheet().tileH;
        }
      }

      this.p.cx = (force || this.p.cx === void 0) ? (this.p.w / 2) : this.p.cx;
      this.p.cy = (force || this.p.cy === void 0) ? (this.p.h / 2) : this.p.cy;
    },

    /**
    Get or set the asset associate with this sprite

    @method asset
    @for Q.Sprite
    @param {String} [name] - leave empty to return the asset, add to set the asset
    @param {Boolean} [resize] - force a call to `size()` and `_generatePoints`
    */
    asset: function(name,resize) {
      if(!name) { return Q.asset(this.p.asset); }

      this.p.asset = name;
      if(resize) {
        this.size(true);
        Q._generatePoints(this,true);
      }
    },

    /**

     Get or set the sheet associate with this sprite

     @method sheet
     @for Q.Sprite
     @param {String} [name] - leave empty to return the sprite sheet, add to resize
     @param {Boolean} [resize] - force a resize
    */
    sheet: function(name,resize) {
      if(!name) { return Q.sheet(this.p.sheet); }

      this.p.sheet = name;
      if(resize) {
        this.size(true);
        Q._generatePoints(this,true);
      }
    },

    /**
     Hide the sprite (render returns without rendering)

     @method hide
     @for Q.Sprite
    */
    hide: function() {
      this.p.hidden = true;
    },

    /**
     Show the sprite

     @method show
     @for Q.Sprite
    */
    show: function() {
      this.p.hidden = false;
    },

    /**
     Set a set of `p` properties on a Sprite

     @method set
     @for Q.Sprite
     @param {Object} properties - hash of properties to set
    */
    set: function(properties) {
      Q._extend(this.p,properties);
      return this;
    },

    _sortChild: function(a,b) {
      return ((a.p && a.p.z) || -1) - ((b.p && b.p.z) || -1);
    },

    _flipArgs: {
      "x":  [ -1,  1],
      "y":  [  1, -1],
      "xy": [ -1, -1]
    },

    /**
     Center sprite inside of it's container (or the stage)

     @method center
     @for Q.Sprite
    */
    center: function() {
      if(this.container) {
        this.p.x = this.container.p.w / 2;
        this.p.y = this.container.p.h / 2;
      } else {
        this.p.x = Q.width / 2;
        this.p.y = Q.height / 2;
      }

    },


    /**
     Update method is called each step with the time elapsed since the last step.

     Doesn't do anything other than trigger events, call a `step` method if defined
     and run update on all its children.

     Generally leave this method alone and define a `step` method that will be called

     @method update
     @for Q.Sprite
     @param {Float} dt - time elapsed since last call
    */
    update: function(dt) {
      this.trigger('prestep',dt);
      if(this.step) { this.step(dt); }
      this.trigger('step',dt);
      this.refreshMatrix();

      // Ugly coupling to stage - workaround?
      if(this.stage && this.children.length > 0) {
        this.stage.updateSprites(this.children,dt,true);
      }

      // Reset collisions if we're tracking them
      if(this.p.collisions) { this.p.collisions = []; }
    },


  });

  /**
   Simple sprite that adds in basic newtonian physics on each step:

       p.vx += p.ax * dt;
       p.vy += p.ay * dt;

       p.x += p.vx * dt;
       p.y += p.vy * dt;

   @class Q.MovingSprite
   @extends Q.Sprite
   @for Quintus.Sprites
  */
  Q.Sprite.extend("MovingSprite",{
    init: function(props,defaultProps) {
      this._super(Q._extend({
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0
      },props),defaultProps);
   },

   step: function(dt) {
     var p = this.p;

     p.vx += p.ax * dt;
     p.vy += p.ay * dt;

     p.x += p.vx * dt;
     p.y += p.vy * dt;
   }
 });

 Q.SPRITE_ROCKET   = 1;
 Q.SPRITE_STAR     = 2;
 Q.SPRITE_ASTEROID = 4;
 Q.MENU_ICON       = 8;
 Q.SPRITE_BULLET	 = 16;

 Q.Sprite.extend("Level_Selection",{
   init: function(p)
   {
     this._super(p,
     {
       name:  "Level_Selection",
       asset: "level_selection.png",
       x: 		 210,
       y: 		 300,
       scale:  Q.state.get('scale')
      });
   }
 });

  return Q;
};
