// Initialize Firebase
var config = {
    apiKey: "AIzaSyDW10JDvahYzg9RMiLIclFotpCb0VCo34U",
    authDomain: "rps-firebase-9f6a5.firebaseapp.com",
    databaseURL: "https://rps-firebase-9f6a5.firebaseio.com",
    projectId: "rps-firebase-9f6a5",
    storageBucket: "rps-firebase-9f6a5.appspot.com",
    messagingSenderId: "861432141558"
};
firebase.initializeApp(config);
	// Get a reference to the database service
	var database = firebase.database();

	var p1Wins;
	var p1Losses;
	var p1Name;
	var p1Choice;

	var p2Wins;
	var p2Losses;
	var p2Name;
	var p2Choice;

	var playerTurn;
	var whoAmI = "none";

	var theme = 1;

	// Using .on("value", function(snapshot)) syntax will retrieve the data
    database.ref().on("value", function(snapshot) {

    	// Determine which player's turn it is.
    	if(snapshot.val().db_playerTurn !== undefined) {
    		playerTurn = snapshot.val().db_playerTurn;
    	}
    	// If the database doesn't know whose turn it is, create it
    	else {
    		database.ref().update({
    			db_playerTurn: 1
    		});
    	}

		// If db_player1 has a name, display p1Stats
		if(snapshot.val().db_p1Name !== undefined) {
			$("#player1Name").text(snapshot.val().db_p1Name);
			$("#player1LblWins").text("Wins: " + snapshot.val().db_p1Wins);
			$("#player1LblLosses").text("Losses: " + snapshot.val().db_p1Losses);
		}
		// If player 2 just logged out, don't let p1 play yet
		else if(snapshot.val().db_p1Name === undefined && snapshot.val().db_p2Name !== undefined) {
			$("#p2c1").text(" ");
			$("#p2c2").text(" ");
			$("#p2c3").text(" ");
			$("#gameStats").text("Waiting for a new opponent...");
			$("#player1Name").text("Empty Seat");
			$("#player1LblWins").text(" ");
			$("#player1LblLosses").text(" ");
		}
		else {
			$("#player1Name").text("Empty Seat");
			$("#player1LblWins").text(" ");
			$("#player1LblLosses").text(" ");
		}

		// If db_player2 has a name, display p2Stats
		if(snapshot.val().db_p2Name !== undefined) {
			$("#player2Name").text(snapshot.val().db_p2Name);
			$("#player2LblWins").text("Wins: " + snapshot.val().db_p2Wins);
			$("#player2LblLosses").text("Losses: " + snapshot.val().db_p2Losses);
		}
		// If player 1 just logged out, don't let p2 play yet
		else if(snapshot.val().db_p2Name === undefined && snapshot.val().db_p1Name !== undefined) {
			$("#p1c1").text(" ");
			$("#p1c2").text(" ");
			$("#p1c3").text(" ");
			$("#gameStats").text("Waiting for a new opponent...");
			$("#player2Name").text("Empty Seat");
			$("#player2LblWins").text(" ");
			$("#player2LblLosses").text(" ");
		}
		else {
			$("#player2Name").text("Empty Seat");
			$("#player2LblWins").text(" ");
			$("#player2LblLosses").text(" ");
		}

		// if Both players are active
		if(snapshot.val().db_p1Name !== undefined && snapshot.val().db_p2Name !== undefined) {
			// if db_playerTurn === 1
			if(snapshot.val().db_playerTurn === 1) {
				if(whoAmI === "player1") {
					// let player1 choose
					$(".player1Rock").text("Rock");
					$(".player1Paper").text("Paper");
					$(".player1Scissors").text("Scissors");
					$("#gameStats").text("Choose your weapon!");
					$("#p2c1").text(" ");
				}
				else {
					$("#gameStats").text("Waiting for Player 1 to choose");
					$("#p1c1").text(" ");
					$("#p2c1").text(" ");
				}
			}
			// else if db_playerTurn === 2
			else if(snapshot.val().db_playerTurn === 2) {
				if(whoAmI === "player2") {
					// let player2 choose
					$(".player2Rock").text("Rock");
					$(".player2Paper").text("Paper");
					$(".player2Scissors").text("Scissors");
					$("#gameStats").text("Choose your weapon!");
					$("#p1c1").text(" ");
				}
				else {
					$("#gameStats").text("Waiting for Player 2 to choose");
					$("#p1c1").text(" ");
					$("#p2c1").text(" ");
				}
			}
			// else
			else if(snapshot.val().db_playerTurn === 0) {
				// Display all results
				p1Choice = snapshot.val().db_p1Choice;
				p2Choice = snapshot.val().db_p2Choice;
				$("#p1c1").text(p1Choice);
				$("#p2c1").text(p2Choice);

				if(theme === 1) {
					var imgStyle = "3d";
					theme++;
				}
				else if(theme === 2) {
					var imgStyle = "icon";
					theme++;
				}
				else if(theme === 3) {
					var imgStyle = "real";
					theme++;
				}
				else {
					var imgStyle = "bathroom";
					theme = 1;
				}

				$("#p1Image").html('<img src="assets/images/' + imgStyle + p1Choice + '.png" alt="' + p1Choice + '" class="img img-responsive" />');
				$("#p2Image").html('<img src="assets/images/' + imgStyle + p2Choice + '.png" alt="' + p2Choice + '" class="img img-responsive" />');

				// If player 1 wins
				if((p1Choice === "Rock" && p2Choice === "Scissors") || (p1Choice === "Paper" && p2Choice === "Rock") || (p1Choice === "Scissors" && p2Choice === "Paper")) {
					$("#gameStats").text("Player 1 wins!");
					// Only update the database 1 time
					if(whoAmI === "player1") {
						p1Wins = snapshot.val().db_p1Wins;
						p1Wins++;
						p2Losses = snapshot.val().db_p2Losses;
						p2Losses++;
						playerTurn = 3;
						database.ref().update({
							db_p1Wins: p1Wins,
							db_p2Losses: p2Losses,
							db_playerTurn: playerTurn
						});
					}
				}
				// Else if player 2 wins
				else if((p2Choice === "Rock" && p1Choice === "Scissors") || (p2Choice === "Paper" && p1Choice === "Rock") || (p2Choice === "Scissors" && p1Choice === "Paper")) {
					$("#gameStats").text("Player 2 wins!");
					// Only update the database 1 time
					if(whoAmI === "player1") {
						p2Wins = snapshot.val().db_p2Wins;
						p2Wins++;
						p1Losses = snapshot.val().db_p1Losses;
						p1Losses++;
						playerTurn = 3;
						database.ref().update({
							db_p2Wins: p2Wins,
							db_p1Losses: p1Losses,
							db_playerTurn: playerTurn
						});
					}
				}
				// Else (draw)
				else {
					$("#gameStats").text("It's a draw!")
				}
				// setTimeout for 3 seconds & reset playerturn to 1
				setTimeout(resetPlayerTurn, 1000 * 5);
			}
		}

	    // if a new user arrives & no p1, user can become p1
		if(whoAmI === "none" && snapshot.val().db_p1Name === undefined) {
			drawPlayerNameInput("player1");
			resetPlayerTurn();
		}
		// If a new user arrives & p1 exists but no p2, user can become p2
		else if(whoAmI === "none" && snapshot.val().db_p2Name === undefined) {
			drawPlayerNameInput("player2");
			resetPlayerTurn();
		}
		// If both p1 & p2 exist, user can spectate until a spot becomes available
		else if(whoAmI === "none") {
			drawPlayerNameDisplay();
        }
        //Set the local variable of player 1's choice
        p1Choice = snapshot.val().db_p1Choice;
    //If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    }, function(errorObject){
        // console.log will print the error if there is one present
        console.log("Thre read failed: " + errorObject.code);
    });
    

