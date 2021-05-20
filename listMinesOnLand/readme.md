 * Both files needs to be in the same repository.
 * Open with any (text) editor the 'getMinesOnLand.html' and edit setMiner() and setLandOwner() to your needs.
 * Close the editor and just run getMinesOnLand.html in your desired browser (it was developed with Chrome). Drag the html file and drop to the browser. 
 * The html will call a function from the javascript which makes a request to aleienworlds api -> https://github.com/Alien-Worlds/alienworlds-api
 * The javascript reads the response and filters out the relavant data: 
    1) time of the mine (in server time, not your local time!)
    2) and the amount in TLM 


* The values are then shown on the page.
* The last line is the overall sum of TLM of all of your mines on the given land. 
* This tool shows 'only' last 999 mines - this is an API limit
