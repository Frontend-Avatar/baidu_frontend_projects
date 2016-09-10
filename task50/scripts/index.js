// var data1 = {
//     hey: 'jude'
// }

// $(document).ready(function() {
//     DataBase.open('quizDB', 'quizes', refreshQuizes);


//     $('#clear').click(function() {
//         DataBase.clear('quizDB');
//     });

//     $('#add').click(function() {
//         // addData(data1);
//         addJSONdata();
//     });

//     $('#delete').click(function() {
//         DataBase.delete();
//     });

//     $('#get').click(function() {
//         DataBase.fetchItem('quiz', 1463981525374, function(item) {
//             console.log(item);
//             return false;
//         });
//     });

//     function refreshQuizes() {
//         var quizes = [];
//         DataBase.fetchAllItems('quizes', function(items) {
//             for (var i = 0, length = items.length; i < length; i++) {
//                 var item = items[(length - 1 - i)];
//                 quizes.push(item.data);
//             }
//             new app.QuizListView(quizes);
//         });
//     }

//     function addJSONdata() {
//         console.log('click add');
//         // $.getJSON('./test.json', function(data){
//         //     debugger
//         //     var obj = data;
//         //     DataBase.addItem('quizes', data.data[1], function(){
//         //         document.write('Add Items OK!');
//         //     });
//         // })
//         $.ajax({
//             type: 'GET',
//             url: 'test.json',
//             dataType: 'json',
//             error: function(e) {
//                 console.log('error occurs');
//             },
//             success: function(result) {
//                 var obj = result.data;
//                 for (var i = 0; i < obj.length; i++) {
//                     DataBase.addItem('quizes', obj[i], function() {
//                         console.log('Add Items Ok!');
//                     })
//                 }
//             }
//         })
//     }

//     function addData(data) {
//         console.log('add item');
//         DataBase.addItem('quizes', data, function() {
//             document.write('Item added');
//         })
//     }
// });
$(function() {
    App.init();
})