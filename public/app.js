//pull articles from MongoDB database and display them on the index page
$.getJSON("/articles", function(data) {
    for (i=0; i < data.length; i++) {

        //writing the HTML for each article from the database
        var articleHTML = "<div class='article' data-id='" + data[i]._id + "'><a href='" + data[i].link + "'><h3>" + data[i].headline +"</h3></a>";

        //using a for loop to check the value for the excitement value and displaying the appropriate button
        if (data[i].isExcited) {
            articleHTML += "<p>This <i>is</i> an exciting story!";
            articleHTML += "<button class='exciteButton' id='#" + data[i]._id + "' data-id='" + data[i]._id + "' data-value='false'>I'm not Excited...</button></p>";
        } else {
            articleHTML += "<p>This is <i>not</i> an exciting story...";
            articleHTML += "<button class='exciteButton' id='#" + data[i]._id + "' data-id='" + data[i]._id + "' data-value='true'>I'm Excited!!</button></p>";
        }

        //adding the individual article to the article list div
        $(".articleList").prepend(articleHTML);
    }
});


//change excitement value when the "I'm Excited!!/I'm not Excited..." buttons are clicked.
$(document).on("click", ".exciteButton", function(event) {
    var buttonId = $(this).attr("data-id");
    var buttonValue = $(this).attr("data-value");

    console.log(buttonId);
    console.log(buttonValue);

    if (buttonValue) {
        $(this).attr("data-value", false);
        $(this).text("I'm not Excited...");
    } else {
        $(this).attr("data-value", true);
        $(this).text("I'm Excited!!");
    }

    $.ajax({
       method: "POST",
       url: "/articles/" + buttonId,
       data: {
         isExcited: buttonValue
       }
    })
    .then(function(data) {
        console.log(data);
    });
});


//create button that when clicked will show only the stories where the excitement value is true