
example.Toolbar = Class.extend({
	
	init:function(elementId, view){
		this.html = $("#"+elementId);
		this.view = view;
		
		// register this class as event listener for the canvas
		// CommandStack. This is required to update the state of 
		// the Undo/Redo Buttons.
		//
		view.getCommandStack().addEventListener(this);

		// Register a Selection listener for the state hnadling
		// of the Delete Button
		//
        view.on("select", $.proxy(this.onSelectionChanged,this));
		
		// Inject the UNDO Button and the callbacks
		//
		this.zoomInButton  = $("<button>Zoom In</button>");
		this.html.append(this.zoomInButton);
		this.zoomInButton.button().click($.proxy(function(){
		      this.view.setZoom(this.view.getZoom()*0.7,true);
		      this.app.layout();
		},this));

		// Inject the DELETE Button
		//
		this.resetButton  = $("<button>1:1</button>");
		this.html.append(this.resetButton);
		this.resetButton.button().click($.proxy(function(){
		    this.view.setZoom(1.0, true);
            this.app.layout();
		},this));
		
		// Inject the REDO Button and the callback
		//
		this.zoomOutButton  = $("<button>Zoom Out</button>");
		this.html.append(this.zoomOutButton);
		this.zoomOutButton.button().click($.proxy(function(){
            this.view.setZoom(this.view.getZoom()*1.3, true);
            this.app.layout();
		},this));
		
		function getUrlVars() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
			function(m,key,value) {
			  vars[key] = value;
			});
			return vars;
		}

		this.undoButton  = $("<button>Undo</button>");
		this.html.append(this.undoButton);
		this.undoButton.button().click($.proxy(function(){
		       this.view.getCommandStack().undo();
		},this)).button( "option", "disabled", true );

		// Inject the REDO Button and the callback
		//
		this.redoButton  = $("<button>Redo</button>");
		this.html.append(this.redoButton);
		this.redoButton.button().click($.proxy(function(){
		    this.view.getCommandStack().redo();
		},this)).button( "option", "disabled", true );
		
		this.delimiter  = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the DELETE Button
		//
		this.deleteButton  = $("<button>Delete</button>");
		this.html.append(this.deleteButton);
		this.deleteButton.button().click($.proxy(function(){
			var node = this.view.getPrimarySelection();
			var command= new draw2d.command.CommandDelete(node);
			this.view.getCommandStack().execute(command);
		},this)).button( "option", "disabled", true );

		// added JSON write
		this.jsonWriteButton  = $("<button>Save</button>");
		this.html.append(this.jsonWriteButton);
		let self = this;
		this.jsonWriteButton.button().click($.proxy(function(){
			var writer = new draw2d.io.json.Writer();
			console.log(self)
			writer.marshal(self.view, function(json){
			// convert the json object into string representation
			var jsonTxt = JSON.stringify(json,null,2);

			// insert the json string into a DIV for preview or post
			// it via ajax to the server....
			// $("#json").text(jsonTxt);
				console.log(jsonTxt);
				// console.log(this.parent)
				let index = getUrlVars()['index'];
				sessionStorage.setItem('jsonData_'+index,JSON.stringify(jsonTxt))
			});
		},this)).button( "option", "disabled", false );

		// added JSON read
		// this.jsonReadButton  = $("<button>Read from JSON</button>");
		// this.html.append(this.jsonReadButton);
		// let self = this;
		let index = getUrlVars()['index'];
		let storedData=sessionStorage.getItem('jsonData_'+index)
		// console.error(storedData)
		globalCanvas = self.view;
		if(storedData){
			let reader = new draw2d.io.json.Reader();
			self.view.clear();
			storedData = JSON.parse(storedData)
			console.log('self--',self)			
			reader.unmarshal(self.view, storedData);
			console.log('read from json')
		}
		
		// this.jsonReadButton.button().click($.proxy(function(){
		// 	// if(sessionStorage.getItem('jsonData'))
		// 		var data = JSON.parse(sessionStorage.getItem('jsonData'));
			
		// 	let reader = new draw2d.io.json.Reader();
		// 	self.view.clear();
		// 	reader.unmarshal(self.view, data);
		// 	console.log('read from json')
		// },this)).button( "option", "disabled", false );
		
		this.delimiter  = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);
	},


	
	/**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 *
     * @param {draw2d.Canvas} emitter
     * @param {Object} event
     * @param {draw2d.Figure} event.figure
	 */
	onSelectionChanged : function(emitter, event){
		this.deleteButton.button( "option", "disabled", event.figure===null );
	},
	
	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
	 * can be used to identify the type of event which has occurred.
	 * 
	 * @template
	 * 
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	stackChanged:function(event)
	{
		this.undoButton.button( "option", "disabled", !event.getStack().canUndo() );
		this.redoButton.button( "option", "disabled", !event.getStack().canRedo() );
	}
});