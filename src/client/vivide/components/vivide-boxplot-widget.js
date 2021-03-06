import VivideMultiSelectionWidget from 'src/client/vivide/components/vivide-multi-selection-widget.js';
import MultiSelection from 'src/client/vivide/multiselection.js';
import { uuid, getTempKeyFor, fileName, hintForLabel, listAsDragImage, textualRepresentation } from 'utils';

export default class VivideBoxplotWidget extends VivideMultiSelectionWidget {
  get multiSelectionConfig() {
    return [this.innerPlot, {
      selector: 'g.selectable-group',
      onSelectionChanged: selection => this.selectionChanged(selection),
      keyCodePrev: 37,
      keyCodeNext: 39
    }];
  }

  get innerPlot() { return this.get('#d3-boxplot'); }

  async initialize() {
    this.windowTitle = "VivideBoxplotWidget";
  }

  dataForDOMNode(group) {
    return group.__vivideObjectAccessor__;
  }

  display(model, config) {
    super.display(model, config);

    let preparedData = model.map(m => {
      let label = m.properties.map(prop => prop.label).find(label => label) || textualRepresentation(m.object);
      let dataPoints = m.properties.map(prop => prop.dataPoints).find(dataPoints => dataPoints) || [];
      
      if(!dataPoints) {
        lively.error('No dataPoints property given for ' + label);
      }

      return {
        label,
        dataPoints,
        __vivideObjectAccessor__: m.object
      }
    })
    
    lively.success(config, 'BLUB')
    this.innerPlot.display(preparedData, Object.assign({}, ...config));
    let groups = this.innerPlot.getAllSubmorphs('g.selectable-group');
    groups.forEach(g => this.multiSelection.addItem(g));
    groups.forEach(g => this.addDragEventTo(g));
  }
  
  livelyExample() {
    this.display([{
      dataPoints: [1,2,1,2,3,4],
      label: "hello"
    }, {
      dataPoints: [2,3,4,5,4,3,4,5,4,3,2,3,4,5],
      label: "world"
    }], {});
  }
}