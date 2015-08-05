(function( $ ){

    $.fn.pietimer = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.pietimer' );
        }
    };

    var methods = {
        init : function( options ) {
            var state = {
                timer: null,
                timerStart: 0,
                timerSeconds: 10,
                callback: function () {},
                timerCurrent: 0,
                showPercentage: false,
                fill: false,
                color: '#CCC'
            };

            state = $.extend(state, options);

            return this.each(function() {

                var $this = $(this);
                var data = $this.data('pietimer');
                if ( ! data ) {
                    $this.addClass('pietimer');
                    $this.css({fontSize: $this.width()});
                    $this.data('pietimer', state);
                    if (state.showPercentage) {
                        $this.find('.percent').show();
                    }
                    if (state.fill) {
                        $this.addClass('fill');
                    }
                    $this.pietimer('start');
                }
            });
        },

        stopWatch : function() {
            var data = $(this).data('pietimer');
            if ( data ) {
                data.timerCurrent = (new Date().getTime()/1000) - data.timerStart;
                var seconds = data.timerSeconds - data.timerCurrent;
                var percent = (data.timerCurrent/data.timerSeconds)*100;
                if (seconds <= 0) {
                    clearInterval(data.timer);
                    $(this).pietimer('drawTimer', 100);
                    data.callback();
                } else {
                    var percent = (data.timerCurrent/data.timerSeconds)*100;
                    $(this).pietimer('drawTimer', percent);
                }
            }
        },

        drawTimer : function (percent) {
            $this = $(this);
            var data = $this.data('pietimer');
            if (data) {
                $this.html('<div class="percent"></div><div class="slice'+(percent > 50?' gt50"':'"')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
                var deg = 360/100*percent;
                $this.find('.slice .pie').css({
                    '-moz-transform':'rotate('+deg+'deg)',
                    '-webkit-transform':'rotate('+deg+'deg)',
                    '-o-transform':'rotate('+deg+'deg)',
                    'transform':'rotate('+deg+'deg)'
                });
                $this.find('.percent').html(Math.round(percent)+'%');
                if (data.showPercentage) {
                    $this.find('.percent').show();
                }
                if ($this.hasClass('fill')) {
                    $this.find('.slice .pie').css({backgroundColor: data.color});
                }
                else {
                    $this.find('.slice .pie').css({borderColor: data.color});
                }
            }
        },

        start : function () {
            var data = $(this).data('pietimer');
            if (data) {
                data.timerFinish = new Date().getTime()+(data.timerSeconds*1000); // now + remaining_construction_time
                var percentage = (data.timerCurrent/data.timerSeconds)*100;
                $(this).pietimer('drawTimer', percentage);
                data.timer = setInterval("$this.pietimer('stopWatch')", 50);
            }
        },

        reset : function () {
            var data = $(this).data('pietimer');
            if (data) {
                clearInterval(data.timer);
                var percentage = (data.timerCurrent/data.timerSeconds)*100;
                $(this).pietimer('drawTimer', percentage);
            }
        }

    };
})(jQuery);
