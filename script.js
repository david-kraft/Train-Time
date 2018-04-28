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

        // Assume the following situations.

        // (TEST 1)
        // First Train of the Day is 3:00 AM
        // Assume Train comes every 3 minutes.
        // Assume the current time is 3:16 AM....
        // What time would the next train be...? (Use your brain first)
        // It would be 3:18 -- 2 minutes away

        // (TEST 2)
        // First Train of the Day is 3:00 AM
        // Assume Train comes every 7 minutes.
        // Assume the current time is 3:16 AM....
        // What time would the next train be...? (Use your brain first)
        // It would be 3:21 -- 5 minutes away


        // ==========================================================

        // Solved Mathematically
        // Test case 1:
        // 16 - 00 = 16
        // 16 % 3 = 1 (Modulus is the remainder)
        // 3 - 1 = 2 minutes away
        // 2 + 3:16 = 3:18

        // Solved Mathematically
        // Test case 2:
        // 16 - 00 = 16
        // 16 % 7 = 2 (Modulus is the remainder)
        // 7 - 2 = 5 minutes away
        // 5 + 3:16 = 3:21

        // Assumptions
        var tFrequency = 3;

        // Time is 3:30 AM
        var firstTime = "03:30";

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Add each train's data into the table
        $("#table-content").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    });

});/* End document ready */