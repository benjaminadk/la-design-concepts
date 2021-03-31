let textKey = {
'799294': 'Custom Text Ninja',
'799299': 'Does Not Matter If There Are Many Nodes',
'799301': 'Whatever We Want Here',
'799219': 'Yes Its TRUE'
}
let nodes = document.querySelectorAll('.wlb-item')

for(let node of nodes) {
   for(let property in textKey) {
      if(node.dataset.pid === property) {
         node.querySelector('.wlb-speech-bubble').textContent = textKey[property]
      }
   }
}