import { is } from "bpmn-js/lib/util/ModelUtil";

export default function CustomContextPadProvider(contextPad: any, modeling: any, elementRegistry: any, eventBus: any) {
  contextPad.registerProvider(this);

  this.getContextPadEntries = function(element: any) {
    return function(entries: any) {
      // Add info icon to open properties panel
      entries['open.properties'] = {
        group: 'edit',
        className: 'bpmn-icon-info',
        title: 'مشاهده ویژگی‌ها (جزئیات)',
        action: {
          click: function(event: any, element: any) {
            // Dispatch a custom event that our React app can listen to
            eventBus.fire('propertiesPanel.toggle', { element: element });
          }
        }
      };
      return entries;
    };
  };
}

CustomContextPadProvider.$inject = [
  'contextPad',
  'modeling',
  'elementRegistry',
  'eventBus'
];
