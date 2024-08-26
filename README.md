To use the application you must load the folder into a code editor such as VScode in the terminal if not already navigated to the folders' path navigate there.

Once there, run the command "npm install --force"

You will need to go through the code and add your API keys if you want to run the project yourself, the APIs being used are TMDB and the YouTube API. As well as firebase info for realtime database and registering users and links to these places.

This will reinstall the required packages to allow the application to run. *note you may need to run npm fund too, just in case, I had to do this once when testing to make sure everything was working not sure why though, but it should be fine without running, if it doesn't run on the ng serve, try it and it should fix it*

Once that has finished installing run "ng serve" to start a localhost server where you can view the application on your browser via the localhost link it generates you typically: "http://localhost:4200/" if no other localhost servers are running, if it's not that link it will say in the terminal where you ran the "ng serve" command.


Or you can go to this link as it's uploaded to the internet: https://assignment2-45537.web.app/


Once you have loaded up the application, you will be on a page where you can search for a movie and see trending movies which are filtered by genre each page has the next set of movies there are 20 different movies per page on trending which are on a carousel with 3 rows and on all other pages the movies are 4 rows as there are 20 results per page. 


You can create an account so you can set services you have to find movies you want to watch easier or you can use the application without the use of this and just search for movies via searching, trending, and by genre. Having an account also allows you to have a watch list so you can set movies you want to add so you can view them later.


The movie details page is extensive and filled with data from multiple endpoints using rxjs to combine the data, some data can be hidden if the API response is null or 0 (some data is just set to 0 if it's null) this is to keep it clean looking so there aren't null values or empty areas where expecting data. In the movie details page, there is a part of more details where there is a cast, if you click on a cast member it will redirect you to another page where it shows all the movies that the actor has acted in where you can then view those movie details too. As some actors have acted in hundreds of movies, I opted to put them into a carousel sorted by genre like the trending page and put lazy loading on it so hundreds of movies aren't loading at once. (This I am quite proud of) 


Every page has some form of animation being utilised, in the details page scss is used to apply a hover on the actor cards to give more depth and not just bland actor cards there.


On the movie details page, there are two drop-down angular components to keep the details more clean, so the page isn't cluttered.


It should be noted at the bottom of the page there are buttons that allow you to navigate between the pages of movies. This fully functions, it remembers what page it's on for each component, swapping component will reset the page number as you're effectively changing the page. For example, if you're on trending and you go to page 3 and view the details of a movie and come off those details, you'll still be on page 3, if you then go to search for a movie the page you're on will go back to 1 and if you go back to trending you'll be back on page 1 as you're returning to the page from another.


The application is fully responsive too, it works on all screen sizes including the smallest phone in the developer tools on Chrome, Opera GX and others...


The application also accounts for reviews that don't leave a rating, these reviews are not counted when getting the average rating. All reviews are still gathered and shown, but only the ratings are filtered out when calculating the average rating, this is so the actual average is calculated correctly without outliers skewing the the actual average.


The application also gets the most relevant trailers to show, in combination with the TMDB API, the YouTube API is being utilised to get the exact trailer title and the channel it came from to give a more accurate output, *channel name* trailer: *Title of trailer with the link to it embedded in the title*


BUGS:

There is only one bug that I can find and that is if you change which services you have and then refresh the page and then go to view a movie it says you have none selected until you refresh the page again, however, you can change them freely and it will update correctly if you don't refresh the account page at least it's along these lines it's quite fiddly to get it to happen. All I know is it's by refreshing pages after changing services, if you play around with refreshing you'll see the issue occur, I can't get it to occur 100% of the time so debugging is fairly difficult, but other than that 0 bugs that I could find to report.
