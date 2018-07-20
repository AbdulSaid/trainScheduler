$(document).ready(function() {
  // initialize firebase
  var config = {
    apiKey: 'AIzaSyDQfNtZ0D4JdrbtmxbB8HhbFtkNNNjahrE',
    authDomain: 'trainschedulerbootcamp.firebaseapp.com',
    databaseURL: 'https://trainschedulerbootcamp.firebaseio.com',
    // projectId: 'trainschedulerbootcamp',
    storageBucket: 'trainschedulerbootcamp.appspot.com'
    // messagingSenderId: '998185072638'
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  console.log(database);

  // creating variables
  var trainName = '';
  var destination = '';
  var firstTrainTime = '';
  var frequency = '';
  var keyHolder = '';
  var getKey = '';

  // var dataRef = database ... not sure yet

  //button for adding trains
  $('#submitButton').on('click', function(event) {
    event.preventDefault();

    trainName = $('#inputTrainName')
      .val()
      .trim();
    destination = $('#inputDestination')
      .val()
      .trim();
    firstTrainTime = moment(
      $('#inputTrainTime')
        .val()
        .trim(),
      'HH:mm'
    ).format('X');
    frequency = $('#inputFrequency')
      .val()
      .trim();

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // adds train data to the database
    keyHolder = database.ref().push({
      TrainName: trainName,
      Destination: destination,
      FirstTrainTime: firstTrainTime,
      Frequency: frequency
      // dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // clears all the textboxes
    $('#inputTrainName').val('');
    $('#inputDestination').val('');
    $('#inputTrainTime').val('');
    $('#inputFrequency').val('');
  });

  //add information to firebase
  database.ref().on(
    'child_added',
    function(snapshot) {
      var sv = snapshot.val();

      console.log(snapshot.val().TrainName);
      console.log(snapshot.val().Destination);
      console.log(snapshot.val().FirstTrainTime);
      console.log(snapshot.val().Frequency);

      //store everything in variables
      var newTrainName = snapshot.val().name;
      var newDestination = snapshot.val().Destination;
      var newFirstTrainTime = snapshot.val().FirstTrainTime;
      var newFrequency = snapshot.val().Frequency;

      //convert first time into a unix time
      var newFirstTrainTimeConvert = moment
        .unix(newFirstTrainTime)
        .format('HH:mm');
      console.log(newFirstTrainTimeConvert);

      var timeRemainder =
        moment().diff(moment.unix(newFirstTrainTime), 'minutes') % newFrequency;

      var minutes = newFrequency - timeRemainder;

      var nextTrainArrival = moment()
        .add(minutes, 'm')
        .format('hh:mm A');

      // Test for correct times and info
      console.log(minutes);
      console.log(nextTrainArrival);
      console.log(moment().format('hh:mm A'));
      console.log(nextTrainArrival);
      console.log(moment().format('X'));

      //append to the html
      $('.table').append(
        '<tr>' +
          '<td>' +
          newTrainName +
          '</td>' +
          '<td>' +
          newDestination +
          '</td>' +
          '<td>' +
          newFrequency +
          '</td>' +
          '<td>' +
          nextTrainArrival +
          '</td>' +
          '<td>' +
          minutes +
          '</td>' +
          '<td>' +
          "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" +
          '</td>'
      );
    },
    function(errorObject) {
      console.log('Errors handled: ' + errorObject.code);
    }
  );

  $('body').on('click', '.remove-train', function() {
    $(this)
      .closest('tr')
      .remove();
    getKey = $(this)
      .parent()
      .parent()
      .attr('id');
    database.child(getKey).remove();
  });
});
