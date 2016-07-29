import lively from 'src/client/lively.js'
import Morph from './Morph.js'

import * as nodes from 'src/client/morphic/node-helpers.js';
import * as events from 'src/client/morphic/event-helpers.js';

import selecting from 'src/client/morphic/selecting.js'


/*
 * Halo, the container for HaloItems
 */

export default class Halo extends Morph {

  initialize() {
    Halo.halo = $(this)
    Halo.halo.hide()
    window.HaloService = Halo
    this.registerBodyDragAndDrop()
  }
  
  registerBodyDragAndDrop() {
    document.body.draggable="true"
    lively.addEventListener("Halo", document.body, "dragstart", evt => this.onBodyDragStart(evt))
    lively.addEventListener("Halo", document.body, "drag", evt => this.onBodyDrag(evt))
    lively.addEventListener("Halo", document.body, "dragend", evt => this.onBodyDragEnd(evt))
  }
  
  onBodyDragStart(evt) {
    if (this.selection) this.selection.remove()
    
    this.selection = lively.components.createComponent("lively-selection")
    this.selectionOffset = events.globalPosition(evt)
    lively.components.openIn(document.body, this.selection).then(comp => {
      comp.style.backgroundColor = 'rgba(100,100,100,0.3)'
      comp.style.width = "100px"
      comp.style.height = "100px"
      comp.style.position = "absolute"
      nodes.setPosition(comp,  this.selectionOffset)
    })
    lively.showPoint(events.globalPosition(evt))
    console.log("drag start")
  }
  
  onBodyDrag(evt) {
    // lively.showPoint(events.globalPosition(evt))
    nodes.setExtent(this.selection, events.globalPosition(evt).subPt(this.selectionOffset))
    
    console.log("drag")
  } 
  
  onBodyDragEnd(evt) {
    lively.showPoint(events.globalPosition(evt))
    console.log("drag end")
  }
    
  
  showHalo(target, path) {
    var bounds = target.getBoundingClientRect()
    var offset = {
      top: bounds.top +  $(document).scrollTop(), 
      left: bounds.left +  $(document).scrollLeft()}
        
    // viewport coordinates
    var scrollTop = Math.abs($(document).scrollTop());
    var scrollLeft = Math.abs($(document).scrollLeft());

    // make sure halo respects left and top viewport boundary
    var offsetTop = Math.max(offset.top - 30, scrollTop);
    var offsetLeft = Math.max(offset.left - 30, scrollLeft);
    var offsetTopDiff = offsetTop - offset.top;
    var offsetLeftDiff = offsetLeft - offset.left;
    offset.top = offsetTop;
    offset.left = offsetLeft;

    // make sure halo respects right and bottom viewport boundary
    var width = $(target).outerWidth() - offsetLeftDiff + 30;
    var height = $(target).outerHeight() - offsetTopDiff + 30;
    var offsetBottom = Math.min(offset.top + height, scrollTop + $(window).height());
    var offsetRight = Math.min(offset.left + width, scrollLeft + $(window).width());
    width = offsetRight - offsetLeft;
    height = offsetBottom - offsetTop;

    // set position and dimensions of halo
    $(this).show();
    $(this).offset(offset);
    $(this).outerWidth(width);
    $(this).outerHeight(height);
  }
  
  static showHalos(target, path) {
    this.target = $(target);
    this.halo[0].showHalo(target, path)
  }
  
  
  static hideHalos() {
    if (this.areHalosActive())
      this.halosHidden = Date.now()
    this.halo.offset({left:0, top: 0});
    this.halo.hide()
  }

  static areHalosActive() {
    return this.halo && this.halo.is(":visible");
  }
}
