import {expect} from 'src/external/chai.js'
import {pt}  from 'src/client/graphics.js'

var lively = window.lively; var it = window.it

describe('Register Event Listeners', function() {
  var target = document.createElement("div");
  var target2 = document.createElement("div");
  var type = "click";
  var listener = function hello() { } ;
  var listener2 = function hello2() { return 3} ;
  var domain = "selection";
  var oldListeners;

  before(() => {
    oldListeners = lively.eventListeners;
  })
  
  after(() => {
    lively.eventListeners = oldListeners;
  });

  it('should register events when adding events',  () => {
    lively.eventListeners = [];
    lively.addEventListener(domain, target, type, listener) ;
    expect(lively.eventListeners).length(1);
  });
  
  it('should unregister events of a domain',  () => {
    var removedCalled = false
    lively.eventListeners = [];
    var target1 = document.createElement("div");
    target1.removeEventListener = () => {
      removedCalled = true
    }
    
    lively.addEventListener(domain, target1, type, listener);
    lively.addEventListener("domain2", target2, type, listener);
    expect(lively.eventListeners).length(2);
    lively.removeEventListener(domain, undefined, undefined, undefined); 
    expect(lively.eventListeners).length(1);
    expect(removedCalled).to.be.true()
  });

  it('should unregister events of a target',  () => {
    lively.eventListeners = [];
    lively.addEventListener(domain, target, type, listener)
    lively.addEventListener(domain, target2, type, listener);
    expect(lively.eventListeners).length(2);
    lively.removeEventListener(undefined, target2, undefined, undefined); 
    expect(lively.eventListeners).length(1);
  });
  
    
  it('should unregister events of a type',  () => {
    lively.eventListeners = [];
    lively.addEventListener(domain, target, type, listener);
    lively.addEventListener(domain, target, "mousedown", listener);
    expect(lively.eventListeners).length(2);
    lively.removeEventListener(undefined, undefined, "click", undefined); 
    expect(lively.eventListeners).length(1);
  });

  it('should unregister events of a listener',  () => {
    lively.eventListeners = [];
    lively.addEventListener(domain, target, type, listener);
    lively.addEventListener(domain, target, type, listener2);
    expect(lively.eventListeners).length(2);
    lively.removeEventListener(undefined, undefined, undefined, listener2); 
    expect(lively.eventListeners).length(1);
  });

  it('should unregister events of a listener and domain',  () => {
    lively.eventListeners = [];
    lively.addEventListener(domain, target, type, listener);
    lively.addEventListener(domain, target, type, listener2);
    lively.addEventListener(domain, target, "mousedown", listener2);
    expect(lively.eventListeners).length(3);
    lively.removeEventListener(domain, undefined, undefined, listener2); 
    expect(lively.eventListeners).length(1);
  });

});


describe('Position API', function() {
  
  describe('getPosition', function() {

    it('should return plain numbers in getter', () => {
      expect(lively.getPosition(document.querySelector('body')).x).to.be.a('number')
    })


    it('should return transform of a svg path', () => {
      var div = document.createElement("div")
      div.innerHTML = `<svg>
    <path transform='translate(100 200)' d='M 0 0 L 100 100'></path>
  </svg>`
      var path = div.querySelector("path")
      expect(lively.getPosition(path).x).to.equal(100)
    })
    
    it('should return 0,0 of a svg path with no transform', () => {
      var div = document.createElement("div")
      div.innerHTML = `<svg>
    <path transform='' d='M 0 0 L 100 100'></path>
  </svg>`
      var path = div.querySelector("path")
      expect(lively.getPosition(path).x).to.equal(0)
    })
  })
  
  describe('setPosition', function() {

    it('should set transform of a svg path', () => {
      var div = document.createElement("div")
      div.innerHTML = `<svg>
    <path transform="translate(0 0)" d='M 0 0 L 100 100'></path>
  </svg>`
      var path = div.querySelector("path")
      lively.setPosition(path, pt(100,200))
      expect(lively.getPosition(path).x).to.equal(100)
    })
    
    
    it('should set transform of a svg path with no transform', () => {
      var div = document.createElement("div")
      div.innerHTML = `<svg>
    <path d='M 0 0 L 100 100'></path>
  </svg>`
      var path = div.querySelector("path")
      // var t = path.transform.baseVal.consolidate()
      
      // t.setTranslate(100,300)
      
      // path.getAttribute("transform")
      // var p = new DOMPoint(0, 0)
      // p.matrixTransform(t)
      // t = path.transform.baseVal.consolidate().matrix
      
      
      lively.setPosition(path, pt(100,200))
      
      expect(lively.getPosition(path).x).to.equal(100)
    })
  })
  
  
})
 

describe('getTotalGlobalBounds', function() {
  
  it('return global bounds of an element', () => {
    var element = document.createElement("div");
    lively.setGlobalPosition(element, pt(0,0));
    //lively.setExtent(element, pt(100,100))
    this.sut = element;
    document.body.appendChild(this.sut);
    var child = document.createElement("div");
    element.appendChild(child);

    lively.setPosition(child, pt(200,300));
    lively.setExtent(child, pt(300,400));

    var result= lively.getTotalGlobalBounds(element);

expect(result.bottomRight().toString()).to.equal(lively.getGlobalBounds(child).bottomRight().toString());
  })
    
  after("cleanup", () => {
    this.sut && this.sut.remove()
  });
})
 


  
  