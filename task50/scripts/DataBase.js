/*
 * @Author: dontry
 * @Date:   2016-05-21 10:25:35
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-05-22 21:43:43
 */


// var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
//     IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
//     IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.OIDBKeyRange || window.msIDBKeyRange,
//     dbVersion = 1;


var dbVersion = 1;

var DataBase = (function() {
    var myDB = {};
    var dataStore = null;
    var dataBaseName = '';

    myDB.open = function(dbName, storageName, callback) {
        var request = indexedDB.open(dbName, dbVersion);
        dataBaseName = dbName;

        request.onupgradeneeded = function(evt) {
            var db = evt.target.result;

            evt.target.transaction.onerror = function(evt) {
                console.log('Something bad happened while trying to open:' + evt.target.errorCode);
            };

            if (db.objectStoreNames.contains(storageName)) {
                db.deleteObjectStore(storageName);
            }

            var store = db.createObjectStore(storageName, {
                keyPath: 'timestamp'
            });
        };

        request.onsuccess = function(evt) {
            dataStore = evt.target.result;

            dataStore.onversionchange = function() {
                dataStore.close();
            };

            callback();
        };

        request.onerror = function(evt) {
            console.log('Something bad happened while trying to open:' + evt.target.errorCode);
        };
    };

    myDB.clear = function(storageName) {
        var db = dataStore;
        var transaction = db.transaction([storageName], 'readwrite');
        transaction.objectStore(storageName).clear();
    };

    myDB.delete = function() {
       var request = indexedDB.deleteDatabase(dataBaseName);

      request.onerror = function(event) {
        console.log("Error deleting database.");
      };
       
      request.onsuccess = function(event) {
        console.log("Database deleted successfully");
          
        console.log(request.result); // should be null
      };
    };

    myDB.fetchAllItems = function(storageName, callback) {
        var db = dataStore;
        var transaction = db.transaction([storageName], 'readwrite');
        var objStore = transaction.objectStore(storageName);

        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = objStore.openCursor(keyRange);
        var items = [];

        transaction.oncomplete = function(evt) {
            callback(items);
        };

        cursorRequest.onsuccess = function(evt) {
            var result = evt.target.result;

            if (!!result === false) {
                return;
            }

            items.push(result.value);

            result.continue();
        };

        cursorRequest.onerror = function(evt) {
            console.log('Something bad happened while trying to open:' + evt.target.errorCode);
        };
    };

    myDB.addItem = function(storageName, data, callback) {
        var db = dataStore;
        var transaction = db.transaction([storageName], 'readwrite');

        var objStore = transaction.objectStore(storageName);

        var timestamp = new Date().getTime();

        var item = {
            'data': data,
            'timestamp': timestamp
        };

        var request = objStore.put(item);

        transaction.onerror = function(evt) {
            console.log('Something bad happened while trying to open:' + evt.target.errorCode);
        };

        request.onsuccess = function(evt) {
            console.log('Saved with id ', evt.result);
            callback(item);
        };

        request.onerror = function(evt) {
            console.log('Something bad happened while trying to open:' + evt.target.errorCode);
        };
    };

    myDB.fetchItem = function(storageName, key, callback) {
        var db = dataStore;
        var transaction = db.transaction([storageName], 'readwrite');
        var objStore = transaction.objectStore(storageName);
        var request = objStore.get(key);

        request.onerror = function(evt) {
            console.log('Something bad happened while trying to open:' + evt.target.errorCode);
        };

        request.onsuccess = function(evt) {
            var item = evt.target.result;
            callback(item);
        };
    };
    return myDB;
})();
