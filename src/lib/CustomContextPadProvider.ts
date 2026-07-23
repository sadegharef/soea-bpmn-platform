export default function CustomContextPadProvider(contextPad: any, eventBus: any, translate: any) {
  contextPad.registerProvider(this);

  this.getContextPadEntries = function(element: any) {
    return function(entries: any) {
      
      entries['element.details'] = {
        group: 'edit',
        html: '<div class="entry" title="Details" style="display:flex; align-items:center; justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>',
        title: translate('Details'),
        action: {
          click: function(event: any, element: any) {
            eventBus.fire('details.open', { element: element });
          }
        }
      };

      entries['element.comments'] = {
        group: 'edit',
        html: '<div class="entry" title="Comments" style="display:flex; align-items:center; justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>',
        title: translate('Comments'),
        action: {
          click: function(event: any, element: any) {
            eventBus.fire('comments.open', { element: element });
          }
        }
      };

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
