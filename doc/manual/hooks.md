# Hooks 

Lively components (HTML elements) can implement hooks to better integrate into the environment.

## livelyInspect

Allows to customize the [lively-inspector](search://name=lively-inspector.js).

```javascript
class Selection {
  livelyInspect(contentNode, inspector) {
    var selection = <div class="element"><i>selection</i></div>
    contentNode.appendChild(selection)
    this.nodes.forEach(ea => {
      selection.appendChild(inspector.display(ea, false, null, this));
    })
  }
}
```

## livelyHalo

To customize the 
<script><a href={lively4url + '/src/components/halo/lively-halo.js'}>lively halo tool</a></script>.