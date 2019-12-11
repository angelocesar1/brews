let searchBtn = document.getElementById("searchBtn");
let searchBar = document.getElementById("searchBar");
let beerName = document.getElementById("name");
let beerStyle = document.getElementById("beerstyle");
let abv = document.getElementById("abv");
let isRetired = document.getElementById("isRetired");
let beerDesc = document.getElementById("beerDesc");
let foodPairings = document.getElementById("foodPairings");
let foodList = document.getElementById("food-pairing-list")
let label = document.getElementById("label");
// search bar functionality

let searchResult = [];


// const testPassInfo = data => {
//     beer = data;
// }

// testPassInfo()


searchBtn.addEventListener("click", () => {

    let searchData = searchBar.value

    // old code:
    // for (i = 0; i < beer.length; i++) {
    //     if (searchBar.value === beer[i].name) {
    //         name.innerHTML = `Beer Name: ${beer[i].nameDisplay}`;
    //         beerstyle.innerHTML = `Type of Beer: ${beer[i].style.name} `;
    //         abv.innerHTML = `Alc %: ${beer[i].abv}%`;
    //         isRetired.innerHTML = `Is Retired: ${beer[i].isRetired}`;
    //         beerDesc.innerHTML = `Description ${beer[i].description}`;
    //         foodPairings.innerHTML = `Food Pairings: ${beer[i].foodPairings}`;
    //         showBeerResults()
    //     }
    // }

    async function getBeer() {
        let response = await fetch(fakesandboxURL);
        let beer = await response.json();

        beer.forEach(item => {
            // console.log({
            //     name: item.name
            // })
            if (searchData === item.name) {
                beerName.innerHTML = item.name
                beerStyle.innerHTML = item.style.name;
                abv.innerHTML = `${item.abv}%`

                if (item.hasOwnProperty("labels")) {
                    label.src = item.labels.medium
                    // console.log("THIS IS A TEST")
                } else if (item.labels === undefined) {
                    // console.log("FAIL")
                    label.src = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.frenchtoastsunday.com%2Fwp-content%2Fuploads%2F2015%2F02%2FBeer-icon-1.png&f=1&nofb=1"
                }

                if (item.hasOwnProperty("description")) {
                    beerDesc.innerHTML = item.description
                    // console.log("DESC PASS")
                } else if (item.description === undefined) {
                    // console.log("FAIL")

                    let desc = document.getElementById("descInfo")

                    desc.style.display = "none";
                }

                if (item.isRetired != "Y") {
                    isRetired.innerHTML = `Beer is still in production!`
                } else { isRetired.innerHTML = `Beer is no longer in production` }

                if (item.hasOwnProperty("foodPairings")) {
                    foodList.innerHTML = item.foodPairings
                } else if (item.foodPairings === undefined) {
                    foodPairings.style.display = "none";
                }

                showBeerResults()
            }
        })
    }
    getBeer()
});
