import { JSDOM } from 'jsdom';
JSDOM.fromURL("http://localhost:3000", {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  dom.window.addEventListener("error", (event) => {
    console.error("PAGE ERROR:", event.error);
  });
  dom.window.console.log = (...args) => console.log('PAGE LOG:', ...args);
  dom.window.console.error = (...args) => console.error('PAGE ERROR LOG:', ...args);
  
  setTimeout(() => {
    console.log("Body length:", dom.window.document.body.innerHTML.length);
  }, 3000);
});
