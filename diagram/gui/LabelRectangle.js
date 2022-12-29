/**
 * @class example.connection_labeledit.LabelConnection
 * 
 * A simple Connection with a label wehich sticks in the middle of the connection..
 *
 * @author Andreas Herz
 * @extend draw2d.Connection
 */
example.LabelRectangle= draw2d.shape.basic.Rectangle.extend({
    
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({text:"Parameter", color:"'#FF0000'", fontColor:"#FFFFFF"});
      
      // add the new decoration to the connection with a position locator.
      //
      
      this.label.ox=10;
      this.label.oy=10;
      this.label.x = 10;
      console.error('label',this.label)
      this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
      this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
      this.label.installEditor(new draw2d.ui.LabelInplaceEditor());
    },

    getPersistentAttributes : function()
    {
        var memento = this._super();
        // console.log('here')
        // add all decorations to the memento 
        //
        memento.type = "example.LabelRectangle"
        memento.labels = [];
        this.children.each(function(i,e){
            var labelJSON = e.figure.getPersistentAttributes();
            labelJSON.locator=e.locator.NAME;
            labelJSON.id= 'value_'+labelJSON.text;
            if(window.params.includes(labelJSON.text))
                labelJSON.param = labelJSON.text;
            if(labelJSON.cssClass.includes('Label') && !labelJSON.cssClass.includes(labelJSON.text))
                labelJSON.cssClass= labelJSON.cssClass+' '+labelJSON.text;
            console.log(labelJSON);
            memento.labels.push(labelJSON);
        });
    
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
    //   console.log('inside')
        this._super(memento);
        
        // remove all decorations created in the constructor of this element
        //
        this.resetChildren();
        
        // and add all children of the JSON document.
        //
        // console.log(memento)
        $.each(memento.labels, $.proxy(function(i,json){
            // create the figure stored in the JSON
            var figure =  eval("new "+json.type+"()");            
            // apply all attributes
            // console.error(json)
            figure.attr(json);                     
            figure.attr('param',json.param)
            // console.log(figure)
            // instantiate the locator
            var locator =  eval("new "+json.locator+"()");
            
            // add the new figure as child to this figure
            this.add(figure, locator);
        },this));
    }



    
});
