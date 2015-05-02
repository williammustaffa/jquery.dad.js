

$(function(){
    var __id=0;
    function Mouse(){
        var self=this;
        this.x=0;
        this.y=0;
        this.target=false;
        this.clone=false;
        this.placeholder=false;
        this.cloneoffset={x:0,y:0};
        this.move=function(e){
            self.x=e.pageX;
            self.y=e.pageY;
            if (self.clone!=false && self.target!=false){
                self.clone.css({top:self.y-self.cloneoffset.y,left:self.x-self.cloneoffset.x});
            }else{

            }
        };
        this.clearClone=function(){
            self.clone.remove();
            self.clone=false;
        };
        this.clearPlaceholder=function(){
            self.placeholder.remove();
            self.placeholder=false;
        };
        this.freeTarget=function(){
            self.placeholder=false;
        };
        $(window).on('mousemove',function(e){
            self.move(e)
        });
    }


     $.prototype.dad=function(opts){
         options=opts;
         $(this).each(function(){
             var target,daddy,mouse,childrenClass,jQclass,cloneClass;
             childrenClass='dads-children';
             cloneClass='dads-children-clone';
             jQclass='.dads-children';
             mouse=new Mouse();
             daddy=$(this);
             daddy.addClass('dad-container');
             if ( typeof opts != "undefined" && typeof opts.target !== 'undefined'){
                 target=opts.target;
             }else{
                 target=daddy.children();
             }
             function closestEdge(x,y,w,h) {
                 var topEdgeDist = distMetric(x,y,w/2,0);
                 var bottomEdgeDist = distMetric(x,y,w/2,h);
                 var leftEdgeDist = distMetric(x,y,0,h/2);
                 var rightEdgeDist = distMetric(x,y,w,h/2);

                 var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);
                 switch (min) {
                     case leftEdgeDist:
                         return "left";
                     case rightEdgeDist:
                         return "right";
                     case topEdgeDist:
                         return "top";
                     case bottomEdgeDist:
                         return "bottom";
                 }
             }
             function distMetric(x,y,x2,y2) {
                 var xDiff = x - x2;
                 var yDiff = y - y2;
                 return (xDiff * xDiff) + (yDiff * yDiff);
             }
            function children_replace(){
                if (mouse.target!=false &&  mouse.clone!=false){
                    var appear=mouse.target;
                    var desapear=mouse.clone;
                    var holder=mouse.placeholder;
                    var bLeft =Math.floor(parseFloat(daddy.css('border-left-width')));
                    var bTop =Math.floor(parseFloat(daddy.css('border-top-width')));
                    mouse.clone.animate({top:mouse.target.offset().top-daddy.offset().top-bTop,left:mouse.target.offset().left-daddy.offset().left-bLeft},300,function(){
                        appear.css({visibility:'visible'}).removeClass('active');
                        desapear.remove();
                    });
                    holder.remove();
                    mouse.clone=false;
                    mouse.placeholder=false;
                    mouse.target=false;
                }
                $("html,body").removeClass('dad-noSelect');


            }
             function children_update(obj){
                 if (mouse.target!=false && mouse.clone!=false) {
                     var newplace, origin, edge, el_pos;
                     origin = $('<span style="display:none"></span>');
                     newplace = $('<span style="display:none"></span>');
                     el_pos=obj.offset();
                     edge = closestEdge(mouse.x - el_pos.left, mouse.y - el_pos.top, obj.width(), obj.height());
                     console.log(edge);
                     if (edge!='top'){
                         if (obj.prev().hasClass('active')){
                             obj.after(newplace);
                         }else{
                             obj.before(newplace);
                         }
                     }else{
                         obj.after(newplace);
                     }
                     mouse.target.before(origin);
                     newplace.before(mouse.target);
                     //update placeholder
                     mouse.placeholder.css({
                         top:mouse.target.offset().top-daddy.offset().top,
                         left:mouse.target.offset().left-daddy.offset().left,
                         width: mouse.target.outerWidth()-10,
                         height: mouse.target.outerHeight()-10
                     });
                     //origin.before(obj);
                     origin.remove();
                     newplace.remove();
                 }
             }
             target.addClass(childrenClass);
             daddy.find(jQclass).on('mousedown touchstart',function(e){
                 if (mouse.target==false && e.which==1){
                     // GET TARGET
                     mouse.target=$(this);

                     // ADD CLONE
                     mouse.clone=mouse.target.clone();
                     mouse.target.css({visibility:'hidden'}).addClass('active');
                     mouse.clone.addClass(cloneClass);
                     daddy.append(mouse.clone);

                     // ADD PLACEHOLDER
                     mouse.placeholder=$('<div></div>');
                     mouse.placeholder.addClass('dads-children-placeholder');
                     mouse.placeholder.css({
                         top:mouse.target.offset().top-daddy.offset().top,
                         left:mouse.target.offset().left-daddy.offset().left,
                         width: mouse.target.outerWidth()-10,
                         height: mouse.target.outerHeight()-10,
                         lineHeight: mouse.target.height()-18+'px'
                     });
                     daddy.append(mouse.placeholder);

                     // GET OFFSET FOR CLONE
                     var difx,dify;
                     var bLeft =Math.floor(parseFloat(daddy.css('border-left-width')));
                     var bTop =Math.floor(parseFloat(daddy.css('border-top-width')));
                     difx=mouse.x-mouse.target.offset().left+daddy.offset().left+bLeft;
                     dify=mouse.y-mouse.target.offset().top+daddy.offset().top+bTop;
                     mouse.cloneoffset.x=difx;
                     mouse.cloneoffset.y=dify;

                     // REMOVE THE CHILDREN DAD CLASS AND SET THE POSITION ON SCREEN
                     mouse.clone.removeClass(childrenClass).css({
                         position:'absolute',
                         top:mouse.y-mouse.cloneoffset.y,
                         left:mouse.x-mouse.cloneoffset.x
                     });

                     // UNABLE THE TEXT SELECTION AND SET THE GRAB CURSOR
                     $("html,body").addClass('dad-noSelect');
                 }
             }).on('mouseenter',function(){
                 children_update($(this));
             });
             $(document).on('mouseup',function(){
                 children_replace();
             });



         });
    };

});
