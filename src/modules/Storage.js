// Storage.js
export default class Storage {
    static saveToLocal(key, data) {
      localStorage.setItem(key, JSON.stringify(data));

      // {"ad":"Davud"}
    }
  
    static getFromLocal(key) {
      return JSON.parse(localStorage.getItem(key)) || [];
    }
  
    static saveToSession(key, data) {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  
    static getFromSession(key) {
      return JSON.parse(sessionStorage.getItem(key)) || [];
    }
  }
  