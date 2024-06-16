export interface GeogebraProps {
  materialId: string
  width?: number
  height?: number
  className?: string
  onApiReady?: (api: GeogebraAppApi | null) => void
  transparentGraphics?: boolean
  pointToTrack?: string
  showOnBoarding?: boolean
  transition?: number
  onboardingAnimationSrc?: object | string
  isApplet2D?: boolean
}

export interface GeogebraAppApi {
  toScreenCoords(pointName: string): unknown
  //#region Commands and Undo-Points

  /**
   * Evaluates the given string just like it would be evaluated when entered into GeoGebra's input bar.
   * From GeoGebra 3.2 you can pass multiple commands at once by separating them with \n.
   *
   * Note: you must use English commands names
   * @param cmdString
   * @returns `true` if command evaluation was successful else `false`.
   */
  evalCommand(cmdString: string): boolean

  /**
   * Like {@link evalCommand}, but the return value is a String containing a comma-separated
   * list of the labels of the created objects. eg "A,B,C"
   * @param cmdString
   * @returns list of the labels of the created objects.
   */
  evalCommandGetLabels(cmdString: string): string[]

  /**
   * Passes the string to GeoGebra's CAS and returns the result as a String.
   * @param string
   */
  evalCommandCAS(string: string): string

  /**
   * Sets an undo point. Useful if you want the user to be able to undo that action of evalCommand.
   * Eg. if you have made an HTML button to act as a custom tool
   */
  setUndoPoint(): void

  //#endregion

  //#region Setting the state of objects

  /**
   * Deletes the object with the given name.
   * @param objName
   */
  deleteObject(objName: string): void

  /**
   * Applies or removes the status of "auxiliary object" to object geo.
   * @param geo
   * @param status
   */
  setAuxiliary(geo: string, status: boolean): void

  /**
   * Sets the double value of the object with the given name.
   *
   * Note: if the specified object is boolean, use a value of `1` to set it to `true` and any other value
   * to set it to `false`. For any other object type, nothing is done.
   * @param objName
   * @param value
   */
  setValue(objName: string, value: number): void

  /**
   * Sets the text value of the object with the given name. For any other object type, nothing is done.
   * @param objName
   * @param value
   */
  setTextValue(objName: string, value: string): void

  /**
   * Sets the coordinates of the object with the given name.
   *
   * Note: if the specified object is not a point, vector, line or absolutely positioned object
   * (text, button, checkbox, input box) nothing is done.
   * @param objName
   * @param x
   * @param y
   */
  setCoords(objName: string, x: number, y: number): void

  /**
   * Sets the caption of object with given name.
   * @param objName
   * @param caption
   */
  setCaption(objName: string, caption: string): void

  /**
   * Sets the color of the object with the given name.
   * @param objName
   * @param red
   * @param green
   * @param blue
   */
  setColor(objName: string, red: number, green: number, blue: number): void

  /**
   * Shows or hides the object with the given name in the graphics window.
   * @param objName
   * @param visible
   */
  setVisible(objName: string, visible: boolean): void

  /**
   * Shows or hides the label of the object with the given name in the graphics window.
   * @param objName
   * @param visible
   */
  setLabelVisible(objName: string, visible: boolean): void

  /**
   * Sets the label style of the object with the given name in the graphics window.
   * Possible label styles are NAME = 0, NAME_VALUE = 1, VALUE = 2 and (from GeoGebra 3.2) CAPTION = 3
   * @param objName
   * @param style
   */
  setLabelStyle(objName: string, style: 0 | 1 | 2 | 3): void

  /**
   * Sets the "Fixed" and "Selection Allowed" state of the object with the given name.
   *
   * Note: fixed objects cannot be changed.
   * @param objName
   * @param fixed
   * @param selectionAllowed
   */
  setFixed(objName: string, fixed: boolean, selectionAllowed: boolean): void

  /**
   * Turns the trace of the object with the given name on or off.
   * @param objName
   * @param flag
   */
  setTrace(objName: string, flag: boolean): void

  /**
   * Renames oldObjName to newObjName. Returns whether the rename was successful.
   * @param oldObjName
   * @param newObjName
   */
  renameObject(oldObjName: string, newObjName: string): boolean

  /**
   * Sets the layer of the object.
   * @param objName
   * @param layer
   */
  setLayer(objName: string, layer: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): void

  /**
   * Shows or hides the all objects in the given layer.
   * @param layer
   * @param visible
   */
  setLayerVisible(layer: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, visible: boolean): void

  /**
   * 	Sets the line style for the object (0 to 4).
   * @param objName
   * @param style
   */
  setLineStyle(objName: string, style: 0 | 1 | 2 | 3 | 4): void

  /**
   * sets the thickness of the object (1 to 13, -1 for default).
   * @param objName
   * @param thickness
   */
  setLineThickness(
    objName: string,
    thickness: -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
  ): void

  /**
   * Sets the style of points (-1 default, 0 filled circle, 1 cross, 2 circle, 3 plus, 4 filled diamond,
   * 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west)).
   * See https://wiki.geogebra.org/en/SetPointStyle_Command for the full list
   * @param objName
   * @param style
   */
  setPointStyle(objName: string, style: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): void

  /**
   * Sets the size of a point (from 1 to 9).
   * @param objName
   * @param size
   */
  setPointSize(objName: string, size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): void

  /**
   * Sets the display style of an object. Style should be one of "parametric", "explicit", "implicit", "specific"
   * @param objName
   * @param style
   */
  setDisplayStyle(objName: string, style: 'parametric' | 'explicit' | 'implicit' | 'specific'): void

  /**
   * Sets the filling of an object (from 0 to 1).
   * @param objName
   * @param filling
   */
  setFilling(objName: string, filling: number): void

  //#endregion

  //#region Getting the state of objects

  /**
   * Returns the cartesian x-coord of the object with the given name.
   *
   * Note: returns 0 if the object is not a point or a vector.
   * @param objName
   */
  getXcoord(objName: string): number

  /**
   * Returns the cartesian y-coord of the object with the given name.
   *
   * Note: returns 0 if the object is not a point or a vector.
   * @param objName
   */
  getYcoord(objName: string): number

  /**
   * Returns the cartesian z-coord of the object with the given name.
   *
   * Note: returns 0 if the object is not a point or a vector.
   * @param objName
   */
  getZcoord(objName: string): number

  /**
   * Returns the double value of the object with the given name (e.g. length of segment, area of polygon).
   *
   * Note: returns 1 for a boolean object with value true. Otherwise 0 is returned.
   * @param objName
   */
  getValue(objName: string): number

  /**
   * Returns the double value of the object in the list (with the given name) with the given index.
   *
   *
   *  returns 1 for a boolean object with value true. Otherwise 0 is returned.
   * @param objName
   * @param index
   */
  getListValue(objName: string, index: number): number

  /**
   * Returns the color of the object with the given name as a hex string, e.g. "#FF0000" for red.
   * Note that the hex string always starts with # and contains no lower case letters.
   * @param objName
   */
  getColor(objName: string): string

  /**
   * Returns true or false depending on whether the object is visible in the Graphics View.
   * Returns false if the object does not exist.
   * @param objName
   */
  getVisible(objName: string): boolean

  /**
   * Returns true or false depending on whether the object is visible in Graphics View `view` (1 or 2).
   * Returns false if the object does not exist.
   * @param objName
   * @param view
   */
  getVisible(objName: string, view: 1 | 2): boolean

  /**
   * Returns the value of the object with the given name as a string.
   * If `useLocalizedInput` is false, returns the command in English, otherwise in current GUI language.
   * Default value is true
   *
   * Note: Localized input uses parentheses, non - localized input uses brackets.
   * For this method (and all others returning type String) it's important to coerce it properly to a JavaScript string
   * for compatibility with GeoGebra Classic 5
   * @example var s = getValueString("text1") + "";
   * @param objName
   * @param useLocalizedInput
   */
  getValueString(objName: string, useLocalizedInput?: boolean): string

  /**
   * Returns the description of the object with the given name as a string (in the currently selected language)
   * @param objName
   */
  getDefinitionString(objName: string): string

  /**
   * Returns the command of the object with the given name as a string.
   * If `useLocalizedInput` is false, returns the command in English, otherwise in current GUI language.
   *
   * Note: Localized input uses parentheses, non - localized input uses brackets.
   * @param objName
   * @param useLocalizedInput
   */
  getCommandString(objName: string, useLocalizedInput?: boolean): string

  /**
   * Returns the value of given object in LaTeX syntax
   * @param objName
   */
  getLaTeXString(objName: string): string

  /**
   * Returns base64 encoded PNG picture containing the object as LaTeX.
   * For `value = false` the object is represented as the definition, for `value = true` the object value is used.
   * @param objName
   * @param value
   */
  getLaTeXBase64(objName: string, value: boolean): string

  /**
   * Returns the type of the given object as a string(like "point", "line", "circle", etc.).
   * @param String
   * @param objName
   */
  getObjectType(objName: string): string

  /**
   * Returns whether an object with the given name exists in the construction.
   * @param objName
   */
  exists(objName: string): boolean

  /**
   * Returns whether the given object's value is valid at the moment.
   * @param objName
   */
  isDefined(objName: string): boolean

  /**
   * Returns an array with all object names in the construction.
   * If `type` parameter is entered, only objects of given `type` are returned.
   * @param type
   */
  getAllObjectNames(type?: string): string[]

  /**
   * Returns the number of objects in the construction.
   */
  getObjectNumber(): number

  /**
   * Returns the number of object(nonempty cells) in CAS.
   */
  getCASObjectNumber(): number

  /**
   * Returns the name of the `i-th` object of the construction.
   * @param i
   */
  getObjectName(i: number): string

  /**
   * Returns the layer of the object.
   * @param objName
   */
  getLayer(objName: string): string

  /**
   * Gets the line style for the object(0 to 4)
   * @param objName
   */
  getLineStyle(objName: string): 0 | 1 | 2 | 3 | 4

  /**
   * Gets the thickness of the line(1 to 13)
   * @param objName
   */
  getLineThickness(objName: string): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

  /**
   * 	Gets the style of points(-1 default, 0 filled circle, 1 circle, 2 cross, 3 plus, 4 filled diamond,
   * 5 unfilled diamond, 6 triangle(north), 7 triangle(south), 8 triangle(east), 9 triangle(west))
   * @param objName
   */
  getPointStyle(objName: string): -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

  /**
   * Gets the size of a point(from 1 to 9)
   * @param objName
   */
  getPointSize(objName: string): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

  /**
   * Gets the filling of an object(from 0 to 1)
   * @param objName
   */
  getFilling(objName: string): number

  /**
   * Returns the caption of the object. If the caption contains placeholders(% n, % v, ...),
   * you can use the second parameter to specify whether you want to substitute them or not.
   * @param objectName
   * @param substitutePlaceholders
   */
  getCaption(objectName: string, substitutePlaceholders: boolean): string

  /**
   * Returns label type for given object, see {@link setLabelStyle} for possible values.
   * @param objectName
   */
  getLabelStyle(objectName: string): 0 | 1 | 2 | 3

  /**
   *
   */
  getLabelVisible(): boolean

  /**
   * Checks if `objName` is independent.
   * @param objName
   */
  isIndependent(objName: string): boolean

  /**
   * Checks if `objName` is is moveable.
   * @param objName
   */
  isMoveable(objName: string): boolean

  //#endregion

  //#region Setting the state of animation

  /**
   * Sets whether an object should be animated. This does not start the animation yet, use {@link startAnimation} to do so.
   * @param objName
   * @param animate
   */
  setAnimating(objName: string, animate: boolean): void

  /**
   * Sets the animation speed of an object.
   * @param objName
   * @param speed
   */
  setAnimationSpeed(objName: string, speed: number): void

  /**
   * Starts automatic animation for all objects with the animating flag set, see {@link setAnimating}.
   */
  startAnimation(): void

  /**
   * Stops animation for all objects with the animating flag set, see {@link setAnimating}.
   */
  stopAnimation(): void

  //#endregion

  //#region Getting the state of animation

  /**
   * Returns whether automatic animation is currently running.
   */
  isAnimationRunning(): boolean

  //#endregion

  //#region Exporting Views

  /**
   * Returns the active Graphics View as a base64-encoded String
   * eg var str = ggbApplet.getPNGBase64(1, true, 72);
   * The DPI setting is slow, set to undefined if you don't need it
   * @param exportScale
   * @param transparent
   * @param DPI
   */
  getPNGBase64(exportScale: number, transparent: boolean, DPI?: number): string

  /**
   * Renders the active Graphics View as an SVG and either downloads it as the given filename or sends it to the callback function.
   * The value is null if the active view is 3D.
   * For Classic 5 compatibility please use ExportImage("type", "svg", "filename", "foo.svg") inside materials
   * @example ggbApplet.exportSVG(svg => console.log("data:image/svg+xml;utf8," + encodeURIComponent(svg)));
   * @param callbackOrFilename
   */
  exportSVG(callbackOrFilename: string | ((svg: string | null) => void)): void

  /**
   * Renders the active Graphics View as a PDF and either downloads it as the given filename or sends it to the callback function.
   * For Classic 5 compatibility please use ExportImage("type", "pdf", "filename", "foo.pdf") instead
   * @example ggbApplet.exportPDF(1, pdf => console.log(pdf));
   * @param scale
   * @param callbackOrFilename
   * @param sliderLabel
   */
  exportPDF(
    scale: number,
    callbackOrFilename: string | ((pdf: string | null) => void),
    sliderLabel?: string,
  ): void

  /**
   * Gets the screenshot of the whole applet as PNG and sends it to the callback function as a base64 encoded string.
   * For internal use only, may not work in all browsers.
   * @example ggbApplet.getScreenshotBase64(function(base64){window.open("data:image/png;base64,"+base64);});
   * @param callback
   */
  getScreenshotBase64(callback: (base64: string) => void): void

  /**
   * Exports the active Graphics View to a .PNG file. The DPI setting is slow, set to undefined if you don't need it.
   * @example var success = ggbApplet.writePNGtoFile("myImage.png", 1, false, 72);
   * @param filename
   * @param exportScale
   * @param transparent
   * @param DPI
   */
  writePNGtoFile(filename: string, exportScale: number, transparent: boolean, DPI?: number): boolean

  //#endregion

  //#region Construction / User Interface

  /**
   * Sets the mouse mode (i.e. tool) for the graphics window (see toolbar reference and the applet parameters "showToolBar" and  "customToolBar" )
   * @param mode
   */
  setMode(mode: number): void

  /**
   * Gets the mouse mode(i.e.tool), see toolbar reference for details
   */
  getMode(): number

  /**
   * Reloads the initial construction(given in filename parameter) of this applet.
   */
  reset(): void

  /**
   * Removes all construction objects
   */
  newConstruction(): void

  /**
   * Refreshes all views.
   *
   * Note: this clears all traces in the graphics window.
   */
  refreshViews(): void

  /**
   * Turns on the fly creation of points in graphics view on(true) or off(false).
   *
   * Note: this is useful if you don't want tools to have the side effect of creating points.
   * For example, when this flag is set to false, the tool "line through two points" will not create points
   * on the fly when you click on the background of the graphics view.
   * @param flag
   */
  setOnTheFlyPointCreationActive(flag: boolean): void

  /**
   * Change point capturing mode.
   * @param view 1 for graphics, 2 for graphics 2, -1 for 3D.
   * @param mode 0 for no capturing, 1 for snap to grid, 2 for fixed to grid, 3 for automatic.
   */
  setPointCapture(view: 1 | 2 | -1, mode: 0 | 1 | 2 | 3): void

  /**
   * The string consists of a number and flags, "s" flag for significant digits, "d" for decimal places(default ).
   * JavaScript integers are cast to string automatically. Example: "10s", "5", 3
   * @param round
   */
  setRounding(round: number | string): void

  /**
   * Hides(`true`) or shows(`false`) the mouse cursor(pointer) when dragging an object to change the construction.
   * @param flag
   */
  hideCursorWhenDragging(flag: boolean): void

  /**
   * Turns the repainting of this applet on(`true`) or off(`false`).
   *
   * Note: use this method for efficient repainting when you invoke several methods.
   * @param flag
   */
  setRepaintingActive(flag: boolean): void

  /**
   * Turns showing of error dialogs on(`true`) or off(`false`).
   *
   * Note: this is especially useful together with {@link evalCommand}.
   * @param flag
   */
  setErrorDialogsActive(flag: boolean): void

  /**
   * Sets the Cartesian coordinate system of the graphics window.
   * @param xmin
   * @param xmax
   * @param ymin
   * @param ymax
   */
  setCoordSystem(xmin: number, xmax: number, ymin: number, ymax: number): void

  /**
   * Sets the Cartesian coordinate system of the 3D graphics window.The last parameter determines whether y - axis should be oriented vertically.
   * @param xmin
   * @param xmax
   * @param ymin
   * @param ymax
   * @param zmin
   * @param zmax
   * @param yVertical
   */
  setCoordSystem(
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number,
    zmin: number,
    zmax: number,
    yVertical: boolean,
  ): void

  /**
   * Shows or hides the x - and y - axis of the coordinate system in the graphics windows 1 and 2.
   * @param xAxis
   * @param yAxis
   */
  setAxesVisible(xAxis: boolean, yAxis: boolean): void

  /**
   * Shows or hides the x -, y - and z - axis of the coordinate system in given graphics window.
   * @example ggbApplet.setAxesVisible(3, false, true, true)
   * @param viewNumber
   * @param xAxis
   * @param yAxis
   * @param zAxis
   */
  setAxesVisible(viewNumber: 1 | 2 | -1, xAxis: boolean, yAxis: boolean, zAxis: boolean): void

  /**
   * Set label for the x -, y - and z - axis of the coordinate system in given graphics window.
   * @example ggbApplet.setAxisLabels(3, "large", "long", "area")
   * @param viewNumber
   * @param xAxis
   * @param yAxis
   * @param zAxis
   */
  setAxisLabels(viewNumber: 1 | 2 | -1, xAxis: string, yAxis: string, zAxis: string): void

  /**
   * Set distance for the x -, y - and z - axis of the coordinate system in given graphics window.
   * @example ggbApplet.setAxisSteps(3, 2, 1, 0.5)
   * @param viewNumber
   * @param xAxis
   * @param yAxis
   * @param zAxis
   */
  setAxisSteps(viewNumber: 1 | 2 | -1, xAxis: number, yAxis: number, zAxis: number): void

  /**
   * Set units for the x -, y - and z - axis of the coordinate system in given graphics window.
   * @example ggbApplet.setAxisUnits(3, "cm", "cm", "cm²")
   * @param viewNumber
   * @param xAxis
   * @param yAxis
   * @param zAxis
   */
  setAxisUnits(viewNumber: 1 | 2 | -1, xAxis: string, yAxis: string, zAxis: string): void

  /**
   * Shows or hides the coordinate grid in the graphics windows 1 and 2.
   * @param flag
   */
  setGridVisible(flag: boolean): void

  /**
   * Shows or hides the coordinate grid in given graphics view graphics window.
   * @param viewNumber
   * @param flag
   */
  setGridVisible(viewNumber: 1 | 2 | -1, flag: boolean): void

  /**
   * Returns true if grid is visible in given view.
   * If view number is omitted, returns whether grid is visible in the first graphics view.
   * @param viewNumber
   */
  getGridVisible(viewNumber?: 1 | 2 | -1): boolean

  /**
   * Returns an XML representation of the current perspective.
   */
  getPerspectiveXML(): string

  /**
   * Undoes one user action.
   */
  undo(): void

  /**
   * Redoes one user action.
   */
  redo(): void

  /**
   * Sets visibility of toolbar.
   * @param show
   */
  showToolBar(show: boolean): void

  /**
   * Sets the layout of the main toolbar, see toolbar reference for details.
   * @param toolbar
   */
  setCustomToolBar(toolbar: string): void

  /**
   * Sets visibility of menu bar.
   * @param show
   */
  showMenuBar(show: boolean): void

  /**
   * Sets visibility of input bar.
   * @param show
   */
  showAlgebraInput(show: boolean): void

  /**
   * Sets visibility of reset icon.
   * @param show
   */
  showResetIcon(show: boolean): void

  /**
   * Enables or disables right click features.
   * @param enable
   */
  enableRightClick(enable: boolean): void

  /**
   * Enables or disables dragging object labels
   * @param enable
   */
  enableLabelDrags(enable: boolean): void

  /**
   * Enables or disables zooming and dragging the view using mouse or keyboard
   * @param enable
   */
  enableShiftDragZoom(enable: boolean): void

  /**
   * Enables or disables CAS features(both the view and commands).
   * @param enable
   */
  enableCAS(enable: boolean): void

  /**
   * Enables or disables the 3D view.
   * @param enable
   */
  enable3D(enable: boolean): void

  /**
   * Changes the open views, see {@link https://wiki.geogebra.org/en/SetPerspective_Command SetPerspective Command} for the string interpretation.
   * @param perspective
   */
  setPerspective(perspective: string): void

  /**
   * Change width of the applet(in pixels).
   * @param width
   */
  setWidth(width: number): void

  /**
   * Change height of the applet(in pixels).
   * @param height
   */
  setHeight(height: number): void

  /**
   * Change width and height of the applet(in pixels).
   * @param width
   * @param height
   */
  setSize(width: number, height: number): void

  /**
   * Update the applet after scaling by external CSS.
   */
  recalculateEnvironments(): void

  /**
   * Get state of the equation editor in algebra view(or in evaluator applet).
   * Returns JSON object with content and optional fields(caret for graphing app, eval and latex for evaluator app)
   */
  getEditorState(): GeogebraEditorState

  /**
   * Set state of the equation editor in algebra view(or in evaluator applet).
   * The argument should be a JSON(object or string) with content and optional caret field.
   * @param state
   */
  setEditorState(state: GeogebraEditorState): void

  /**
   * Get the graphics options for euclidian view specified by viewId.
   * It returns a JSON(object or string) with rightAngleStyle, pointCapturing, grid, gridIsBold, gridType, bgColor, gridColor, axesColor, axes, gridDistance
   * @param viewId
   */
  getGraphicsOptions(viewId: 1 | 2 | -1): GeogebraGraphicsOptions

  /**
   * Set the graphics options for euclidian view specified by viewId.The second argument should be a JSON(object or string) with optional fields with rightAngleStyle, pointCapturing, grid, gridIsBold, gridType, bgColor, gridColor, axesColor, axes, gridDistance
   * @param viewId
   * @param options
   */
  setGraphicsOptions(viewId: 1 | 2 | -1, options: Partial<GeogebraGraphicsOptions>): void

  /**
   * Set the options for the algebra view.
   * The argument should be a JSON(object or string) with field sortBy
   * @param options
   */
  setAlgebraOptions(options: { sortBy: any }): void

  //#endregion

  //#region Event Listeners

  /**
   * Registers a JavaScript function as an add listener for the applet's construction.
   * Whenever a new object is created in the GeoGebraApplet's construction, the JavaScript function `JSFunctionName`
   * is called using the name of the newly created object as its single argument.
   * @example
   * // First, register a listening JavaScript function:
   * ggbApplet.registerAddListener("myAddListenerFunction");
   * // When an object "A" is created, the GeoGebra Applet will call the Javascript function myAddListenerFunction("A");
   * @param JSFunctionName
   */
  registerAddListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Removes a previously registered add listener, see {@link registerAddListener}
   * @param JSFunctionName
   */
  unregisterAddListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Registers a JavaScript function as a remove listener for the applet's construction.
   * Whenever an object is deleted from the GeoGebraApplet's construction, the JavaScript function `JSFunctionName`
   * is called using the name of the deleted object as its single argument.
   *
   * Note: when a construction is cleared, remove is not called for every single object, see {@link registerClearListener}.
   * @example
   * // First, register a listening JavaScript function:
   * ggbApplet.registerRemoveListener("myRemoveListenerFunction");
   * // When the object "A" is deleted, the GeoGebra Applet will call the Javascript function myRemoveListenerFunction("A");
   * @param JSFunctionName
   */
  registerRemoveListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Removes a previously registered remove listener, see {@link registerRemoveListener}
   * @param JSFunctionName
   */
  unregisterRemoveListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Registers a JavaScript function as a update listener for the applet's construction.
   * Whenever any object is updated in the GeoGebraApplet's construction, the JavaScript function `JSFunctionName`
   * is called using the name of the updated object as its single argument.
   * Note: when you only want to listen for the updates of a single object use {@link registerObjectUpdateListener} instead.
   * @example
   * // First, register a listening JavaScript function:
   * ggbApplet.registerUpdateListener("myUpdateListenerFunction");
   * // When the object "A" is updated, the GeoGebra Applet will call the Javascript function myUpdateListenerFunction("A");
   * @param JSFunctionName
   */
  registerUpdateListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Removes a previously registered update listener, see {@link registerUpdateListener}
   * @param JSFunctionName
   */
  unregisterUpdateListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Registers a JavaScript function as a click listener for the applet's construction.
   * Whenever any object is clicked in the GeoGebraApplet's construction, the JavaScript function `JSFunctionName`
   * is called using the name of the updated object as its single argument.
   *
   * Note: when you only want to listen for the updates of a single object use {@link registerObjectClickListener} instead.
   * @param JSFunctionName
   */
  registerClickListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * Removes a previously registered click listener, see {@link registerClickListener}
   * @param JSFunctionName
   */
  unregisterClickListener(JSFunctionName: string | ((name: string) => void)): void

  /**
   * @summary Registers a JavaScript function as an update listener for a single object.
   * @description
   * Whenever the object with the given name is updated, the JavaScript function `JSFunctionName`
   * is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function,
   * the old value is replaced.
   *
   * Note: all object updated listeners are unregistered when their object is removed or the construction is cleared, see {@link registerRemoveListener} and {@link registerClearListener}.
   *
   * Note: an object update listener will still work after an object is renamed.
   *
   * @example
   * // First, register a listening JavaScript function:
   * ggbApplet.registerObjectUpdateListener("A", "myAupdateListenerFunction");
   * // Whenever the object A is updated, the GeoGebra Applet will call the Javascript function myAupdateListenerFunction();
   *
   * @param objName
   * @param JSFunctionName
   */
  registerObjectUpdateListener(objName: string, JSFunctionName: string | (() => void)): void

  /**
   * Removes a previously registered object update listener of the object with the given name, see {@link registerObjectUpdateListener}.
   * @param objName
   */
  unregisterObjectUpdateListener(objName: string): void

  /**
   * @summary Registers a JavaScript function as a click listener for a single object.
   * @description
   * Whenever the object with the given name is clicked, the JavaScript function `JSFunctionName`
   * is called using the name of the updated object as its single argument.
   * If objName previously had a mapping JavaScript function, the old value is replaced.
   *
   * Note: all object click listeners are unregistered when their object is removed or the construction is cleared, see {@link registerRemoveListener} and {@link registerClearListener}.
   *
   * Note: an object click listener will still work after an object is renamed.
   *
   * @example
   * // First, register a listening JavaScript function:
   * ggbApplet.registerObjectClickListener("A", "myAclickListenerFunction");
   * // Whenever the object A is clicked, the GeoGebra Applet will call the Javascript function myAclickListenerFunction();
   * @param objName
   * @param JSFunctionName
   */
  registerObjectClickListener(objName: string, JSFunctionName: string | (() => void)): void

  /**
   * Removes a previously registered object click listener of the object with the given name, see {@link registerObjectClickListener}.
   * @param objName
   */
  unregisterObjectClickListener(objName: string): void

  /**
   * @summary Registers a JavaScript function as a rename listener for the applet's construction.
   * @description
   * Whenever an object is renamed in the GeoGebraApplet's construction, the JavaScript function `JSFunctionName`
   * is called using the old name and the new name of the renamed object as its two arguments.
   * @example
   * //  First, register a listening JavaScript function:
   * ggbApplet.registerRenameListener("myRenameListenerFunction");
   * // When an object "A" is renamed to "B", the GeoGebra Applet will call the Javascript function myRenameListenerFunction("A", "B");
   * @param objName
   * @param JSFunctionName
   */
  registerRenameListener(
    objName: string,
    JSFunctionName: string | ((oldName: string, newName: string) => void),
  ): void

  /**
   * Removes a previously registered rename listener, see {@link registerRenameListener}.
   * @param objName
   */
  unregisterRenameListener(objName: string): void

  /**
   * @summary Registers a JavaScript function as a clear listener for the applet's construction.
   * @description
   * Whenever the construction in the GeoGebraApplet is cleared (i.e. all objects are removed), the JavaScript function `JSFunctionName`
   * is called using no arguments.
   *
   * Note: all update listeners are unregistered when a construction is cleared.
   * See {@link registerUpdateListener} and {@link registerRemoveListener}.
   *
   * @example
   * // First, register a listening JavaScript function:
   * ggbApplet.registerClearListener("myClearListenerFunction");
   * // When the construction is cleared(i.e.after reseting a construction or opening a new construction file),
   * // the GeoGebra Applet will call the Javascript function myClearListenerFunction();
   * @param JSFunctionName
   */
  registerClearListener(JSFunctionName: string | (() => void)): void

  /**
   * Removes a previously registered clear listener, see {@link registerClearListener}.
   * @param JSFunctionName
   */
  unregisterClearListener(JSFunctionName: string | (() => void)): void

  /**
   * Registers a listener that is called(with no arguments) every time an undo point is created.
   * @param JSFunctionName
   */
  registerStoreUndoListener(JSFunctionName: string | (() => void)): void

  /**
   * Removes previously registered listener for storing undo points, see {@link registerStoreUndoListener}.
   * @param JSFunctionName
   */
  unregisterStoreUndoListener(JSFunctionName: string | (() => void)): void

  /**
   * @summary Registers a JavaScript function as a generic listener for the applet's construction.
   * @description
   * The listener receives events as JSON objects of the form `{ type: "setMode", target: "", argument: "2" }`
   * where,
   *  - `target` is the label of the construction element related to the event(if applicable),
   *  - `argument` provides additional information based on the event type(e.g.the mode number for setMode event).
   * @param JSFunctionName
   */
  registerClientListener(JSFunctionName: string | ClientListener): void

  /**
   * Removes previously registered client listener, see {@link registerClientListener}.
   * @param JSFunctionName
   */
  unregisterClientListener(JSFunctionName: string | ClientListener): void

  //#endregion

  //#region GeoGebra's File format

  /**
   * Evaluates the given XML string and changes the current construction.
   *
   * Note: the construction is NOT cleared before evaluating the XML string.
   * @param xmlString
   */
  evalXML(xmlString: string): void

  /**
   * Evaluates the given XML string and changes the current construction.
   *
   * Note: the construction is cleared before evaluating the XML string. This method could be used to load constructions.
   * @param xmlString
   */
  setXML(xmlString: string): void

  /**
   * Returns the current construction in GeoGebra's XML format. This method could be used to save constructions.
   */
  getXML(): string

  /**
   * Returns the GeoGebra XML string for the given object, i.e.only the < element > tag is returned.
   * @param objName
   */
  getXML(objName: string): string

  /**
   * For a dependent GeoElement objName the XML string of the parent algorithm and all its output objects is returned.
   * For a free GeoElement objName "" is returned.
   * @param objName
   */
  getAlgorithmXML(objName: string): string

  /**
   * Gets the current construction as JSON object including the XML and images.
   */
  getFileJSON(): string

  /**
   * Sets the current construction from a JSON(object or string) that includes XML and images(try {@link getFileJSON} for the precise format)
   * @param content
   */
  setFileJSON(content: object): string

  /**
   * Gets the current construction as a base64 - encoded.ggb file.
   */
  getBase64(): string

  /**
   * Gets the current construction as a base64 - encoded.ggb file asynchronously, passes as parameter to the `callback` function when ready.
   * The `callback` function should take one parameter(the base64 string).
   * @param callback
   */
  getBase64(callback: (base64: string) => void): string

  /**
   * Sets the current construction from a base64 - encoded.ggb file.
   * If `onLoad` function is specified, it is called after the file is loaded.
   * @param base64
   * @param onLoad
   */
  setBase64(base64: string, onLoad?: () => void): void

  //#endregion

  //#region Miscellaneous

  /**
   * Returns the version of GeoGebra.
   */
  getVersion(): string

  /**
   * Removes the applet and frees up memory.
   */
  remove(): void

  //#endregion
}

interface GeogebraEditorState {
  content: any
  caret?: any
  eval?: any
  latex?: any
}

interface GeogebraGraphicsOptions {
  rightAngleStyle: any
  pointCapturing: any
  grid: any
  gridIsBold: any
  gridType: any
  bgColor: any
  gridColor: any
  axesColor: any
  axes: any
  gridDistance: any
}

export type ClientListener = (event: ClientEventTypes) => void
type ClientEventTypes =
  | AddMacroEvent
  | AddPolygonEvent
  | AddPolygonCompleteEvent
  | AlgebraPanelSelectedEvent
  | DeleteGeosEvent
  | DeselectEvent
  | DragEndEvent
  | DropdownClosedEvent
  | DropdownItemFocusedEvent
  | DropdownOpenedEvent
  | EditorKeyTypedEvent
  | EditorStartEvent
  | EditorStopEvent
  | ExportEvent
  | MouseDownEvent
  | MovedGeosEvent
  | MovingGeosEvent
  | OpenDialogEvent
  | OpenMenuEvent
  | PasteElmsEvent
  | PasteElmsCompleteEvent
  | PerspectiveChangeEvent
  | RedoEvent
  | RelationToolEvent
  | RenameMacroEvent
  | SelectEvent
  | SetModeEvent
  | ShowNavigationBarEvent
  | ShowStyleBarEvent
  | SidePanelClosedEvent
  | SidePanelOpenedEvent
  | TablePanelSelectedEvent
  | ToolsPanelSelectedEvent
  | UndoEvent
  | UpdateStyleEvent
  | ViewChanged2DEvent
  | ViewChanged3DEvent

/**
 * Client event when new macro is added.
 */
interface AddMacroEvent {
  type: 'addMacro'
  /**
   * Name of the newly added macro.
   */
  argument: string
}

/**
 * Client event when polygon construction started.
 */
interface AddPolygonEvent {
  type: 'addPolygon'
}

/**
 * Client event when polygon construction finished.
 */
interface AddPolygonCompleteEvent {
  type: 'addPolygonComplete'
  /**
   * Label of the new polygon.
   */
  target: string
}

/**
 * Client event in Graphing / Geometry apps when algebra tab selected in sidebar.
 */
interface AlgebraPanelSelectedEvent {
  type: 'algebraPanelSelected'
}

/**
 * Client event when multiple objects deleted
 */
interface DeleteGeosEvent {
  type: 'deleteGeos'
}

/**
 * Client event when one or all objects removed from selection.
 */
interface DeselectEvent {
  type: 'deselect'
  /**
   * The selected object name (for single object) or null (deselect all)
   */
  target: string | null
}

/**
 * Client event when mouse drag ended.
 */
interface DragEndEvent {
  type: 'dragEnd'
  target: string
}

/**
 * Client event on dropdown list closed.
 */
interface DropdownClosedEvent {
  type: 'dropdownClosed'
  /**
   * Name of the dropdown list.
   */
  target: string
  /**
   * Index of the selected item (0 based)
   */
  index: number
}

/**
 * Client event on dropdown list item focused using mouse or keyboard.
 */
interface DropdownItemFocusedEvent {
  type: 'dropdownItemFocused'
  /**
   * Name of the dropdown list.
   */
  target: string
  /**
   * Index of the selected item (0 based)
   */
  index: number
}

/**
 * Client event on 	dropdown list opened.
 */
interface DropdownOpenedEvent {
  type: 'dropdownOpened'
  /**
   * Name of the dropdown list.
   */
  target: string
}

/**
 * Client event on key typed in editor (Algebra view of any app or standalone Evaluator app).
 */
interface EditorKeyTypedEvent {
  type: 'editorKeyTyped'
}

/**
 * Client event when user moves focus to the editor (Algebra view of any app or standalone Evaluator app).
 */
interface EditorStartEvent {
  type: 'editorStart'
  /**
   * Object label if editing existing object.
   */
  target?: string
}

/**
 * Client event when user (Algebra view of any app or standalone Evaluator app)
 */
interface EditorStopEvent {
  type: 'editorStop'
  /**
   * Object label if editing existing object.
   */
  target?: string
}

/**
 * Client event when export started.
 */
interface ExportEvent {
  type: 'export'
  /**
   * JSON encoded array including export format
   */
  argument: any
}

/**
 * CLient event on mouse down.
 */
interface MouseDownEvent {
  type: 'mouseDown'
  x: number
  y: number
  hits: string[]
}

/**
 * Client event when multiple objects move ended.
 */
interface MovedGeosEvent {
  type: 'movedGeos'
  /**
   * The labels of objects moved.
   */
  argument: string[]
}

/**
 * Client event when multiple objects are being moved.
 */
interface MovingGeosEvent {
  type: 'movingGeos'
  /**
   * The labels of objects being moved.
   */
  argument: string[]
}

/**
 * Client event when dialog is opened (currently just for export dialog)
 */
interface OpenDialogEvent {
  type: 'openDialog'
  /**
   * Dialog ID.
   */
  argument: string
}

/**
 * Client event when main menu or one of its submenus were open
 */
interface OpenMenuEvent {
  type: 'openMenu'
  /**
   * submenu ID.
   */
  argument: string
}

/**
 * Client event on start pasting multiple objects.
 */
interface PasteElmsEvent {
  type: 'pasteElms'
  /**
   * XML string containing the pasted objects.
   */
  argument: string
}

/**
 * Client event on pasting multiple objects ended.
 */
interface PasteElmsCompleteEvent {
  type: 'pasteElmsComplete'
}

/**
 * Client event	perspective changed (e.g. a view was opened or closed).
 */
interface PerspectiveChangeEvent {
  type: 'perspectiveChange'
}

/**
 * Client event when redo button is pressed.
 */
interface RedoEvent {
  type: 'redo'
}

/**
 * Client event when relation tool used.
 */
interface RelationToolEvent {
  type: 'relationTool'
  /**
   * HTML description of the object relation.
   */
  argument: string
}

/**
 * Client event when custom tool was renamed.
 */
interface RenameMacroEvent {
  type: 'renameMacro'
  /**
   * String tuple with [old name, new name]
   */
  argument: [string, string]
}

/**
 * Client event on object added to selection.
 */
interface SelectEvent {
  type: 'select'
  /**
   * Selected object label.
   */
  target: string
}

/**
 * Client event when app mode changed (e.g. a tool was selected).
 */
interface SetModeEvent {
  type: 'setMode'
  /**
   * Mode number (see toolbar reference for details)
   */
  argument: number
}

/**
 * Client event when navigation bar visibility changed.
 */
interface ShowNavigationBarEvent {
  type: 'showNavigationBar'
  argument: boolean
}

/**
 * Client event when style bar visibility changed.
 */
interface ShowStyleBarEvent {
  type: 'showStyleBar'
  argument: boolean
}

/**
 * Client event when side panel (where algebra view is in Graphing Calculator) closed.
 */
interface SidePanelClosedEvent {
  type: 'sidePanelClosed'
}

/**
 * Client event when side panel (where algebra view is in Graphing Calculator) opened.
 */
interface SidePanelOpenedEvent {
  type: 'sidePanelOpened'
}

/**
 * Client event when table of values panel selected.
 */
interface TablePanelSelectedEvent {
  type: 'tablePanelSelected'
}

/**
 * Client event when tools panel selected.
 */
interface ToolsPanelSelectedEvent {
  type: 'toolsPanelSelected'
}

/**
 * Client event on undo pressed.
 */
interface UndoEvent {
  type: 'undo'
}

/**
 * Client event on object style changed.
 */
interface UpdateStyleEvent {
  type: 'updateStyle'
  /**
   * Label of object whose style changed.
   */
  target: string
}

/**
 * Client event when graphics view dimensions changed by zooming or panning.
 */
interface ViewChanged2DEvent {
  type: 'viewChanged2D'
  /**
   * Horizontal pixel position of point (0,0).
   */
  xZero: number
  /**
   * Vertical pixel position of point (0,0),
   */
  yZero: number
  /**
   * Ratio pixels / horizontal units.
   */
  xscale: number
  /**
   * Ratio pixels / vertical units.
   */
  yscale: number
  /**
   * Graphics view number (1 or 2)
   */
  viewNo: 1 | 2
}

/**
 * 3D view dimensions changed by zooming or panning.
 */
interface ViewChanged3DEvent {
  type: 'viewChanged3D'
  xZero: number
  yZero: number
  scale: number
  yscale: number
  viewNo: number
  zZero: number
  zscale: number
  xAngle: number
  zAngle: number
}
