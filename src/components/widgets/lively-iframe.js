import Morph from 'src/components/widgets/lively-morph.js';

export default class LivelyIFrame extends Morph {
  async initialize(txt) {
      this.windowTitle = "iFrame Browser"
      var i = this.shadowRoot.querySelector("#input");
      i.onchange = () => this.get(i.value);
      
      if (!this.getAttribute("src")) {
        this.setURL("//lively-kernel.org/")    
      }
    
    }
  
  get(txt) {
      var i = this.shadowRoot.querySelector("#input");
      this.shadowRoot.querySelector("#frame").src = i.value;
    }
  
  setURL(url){
      this.setAttribute("src", url)
       this.shadowRoot.querySelector("#input").value = url
       this.shadowRoot.querySelector("#frame").src = url;
    }
}
