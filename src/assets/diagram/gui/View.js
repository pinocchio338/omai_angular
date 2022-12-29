

example.View = draw2d.Canvas.extend({
	
	init:function(id){
		this._super(id);
		
		this.setScrollArea("#"+id);
		
		this.currentDropConnection = null;
	},

    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     * 
     * @template
     **/
    onDrag:function(droppedDomNode, x, y )
    {
        // console.log(droppedDomNode)
    },
    
    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey)
    {
        var type = $(droppedDomNode).data("shape");
        console.log(typeof(type))
        var figure = eval("new "+type+"();");
        // create a command for the undo/redo support
         console.error(figure);
        if(figure.cssClass=='draw2d_shape_basic_Rectangle'){
            figure.bgColor.red=51;
            figure.bgColor.blue=51;
            figure.bgColor.green=51;
        }
        var command = new draw2d.command.CommandAdd(this, figure, x, y);
        // console.error(command);
        console.log(this)
        window.globalCanvas = this;
        this.getCommandStack().execute(command);
    }
});

