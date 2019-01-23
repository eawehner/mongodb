//function to pull articles from MongoDB database and display them on the index page
function pullAllArticles() {
    $.getJSON("/articles", function(data) {
        for (i=0; i < data.length; i++) {

            //writing the HTML for each article from the database
            var articleHTML = "<div class='article' data-id='" + data[i]._id + "'><a href='" + data[i].link + "' target='_blank'><h3>" + data[i].headline +"</h3></a>";

            //using a for loop to check the value for the excitement value and displaying the appropriate button
            if (data[i].isExcited) {
                articleHTML += "<p><span class='exciteLine' id='" + data[i]._id + "'>This <i>is</i> an exciting story!</span></p>";
                articleHTML += "<p><button class='exciteButton' id='" + data[i]._id + "' data-id='" + data[i]._id + "' data-value='false'>I'm not Excited...</button></p></div>";
            } else {
                articleHTML += "<p><span class='exciteLine' id='" + data[i]._id + "'>This is <i>not</i> an exciting story...</span></p>";
                articleHTML += "<p><button class='exciteButton' id='" + data[i]._id + "' data-id='" + data[i]._id + "' data-value='true'>I'm Excited!!</button></p></div>";
            }

            //adding the individual article to the article list div
            $(".articleList").prepend(articleHTML);
        };
    });
};

//function to pull only the exciting articles from the MongoDB database and display them on the index page
function pullExcitingArticles() {
    $.getJSON("/exciting", function(data) {
        for (i=0; i < data.length; i++) {

            //writing the HTML for each article from the database
            var articleHTML = "<div class='article' data-id='" + data[i]._id + "'><a href='" + data[i].link + "' target='_blank'><h3>" + data[i].headline +"</h3></a>";

            //if there's saved excitement records (ie. people keep hitting the excited/not excited button), show the number of records as a 'controversy score'. however, current feature seems to only record the  length of IDs saved
            if (data[i].excitement) {
                var excitementNum = data[i].excitement.length;
                articleHTML += "<br /> Controversy score: " + excitementNum + "!";
            }

            articleHTML += "</div>";

            $(".articleList").prepend(articleHTML);
        };
    });
};

pullAllArticles();

//change excitement value when the "I'm Excited!!/I'm not Excited..." buttons are clicked.
$(document).on("click", ".exciteButton", function(event) {
    var buttonId = $(this).attr("data-id");
    var buttonValue = $(this).attr("data-value");

    var spanSelector = "span#" + buttonId;

    console.log(buttonId);
    console.log(buttonValue);

    if (buttonValue) {
        $(this).attr("data-value", false);
        $(this).text("I'm not Excited...");
        $(spanSelector).text("This is <i>not</i> an exciting story...");
    } else {
        $(this).attr("data-value", true);
        $(this).text("I'm Excited!!");
        $(spanSelector).text("This <i>is</i> an exciting story!");
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


//exciting button will show only the stories where the excitement value is true when clicked
$(document).on("click", "#excitingArticles", function(event) {
    $(".articleList").empty();

    pullExcitingArticles();
});

//the all articles button will show all articles again
$(document).on("click", "#allArticles", function(event) {
    $(".articleList").empty();

    pullAllArticles();
});
