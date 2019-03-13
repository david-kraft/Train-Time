// A $( document ).ready() block.
$(document).ready(function () {
    console.log("Ready!");

    var database = firebase.database();

    // Button for adding trains
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // Grabs user input
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var firstTrain = $("#first-train-input").val().trim();
        var trainFrequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            first: firstTrain,
            frequency: trainFrequency
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log("newTrain.name" + newTrain.name);
        console.log("newTrain.destination" + newTrain.destination);
        console.log("newTrain.first" + newTrain.first);
        console.log("newTrain.frequency" + newTrain.frequency);

        // Clears all of the form text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

        var firstTrain = moment(firstTrain, "HH.mm")
    });

    // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().first;
        var trainFrequency = childSnapshot.val().frequency;

        console.log(trainName);
        console.log(trainDestination);
        console.log(firstTrain);
        console.log(trainFrequency);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        // Minutes Until Train
        var tMinutesTilTrain = trainFrequency - tRemainder;
        console.log("MINUTES TIL TRAIN: " + tMinutesTilTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTilTrain, "minutes").format("hh:mm");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Add each train's data into the table
        $("#table-content").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    });

});/* End document ready */
