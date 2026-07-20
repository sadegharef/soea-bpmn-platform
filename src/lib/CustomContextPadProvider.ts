export default function CustomContextPadProvider(contextPad: any, eventBus: any, translate: any) {
  contextPad.registerProvider(this);
  
  this.getContextPadEntries = function(element: any) {
    return function(entries: any) {
      entries['add.comment'] = {
        group: 'edit',
        className: 'bpmn-icon-discussion',
        title: translate('Comments'),
        action: {
          click: function(event: any, element: any) {
            eventBus.fire('commentsPanel.toggle', { element: element });
          }
        }
      };
      
      // Optionally remove the default edit entry if needed
      // delete entries['replace'];
      
      return entries;
    };
  };
}

CustomContextPadProvider.$inject = [
  'contextPad',
  'eventBus',
  'translate'
];

export const customContextPadModule = {
  __init__: [ 'customContextPadProvider' ],
  customContextPadProvider: [ 'type', CustomContextPadProvider ]
};
