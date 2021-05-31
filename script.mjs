"use strict";
import * as data from './data.mjs';

//for global variables
const app = {
    nasaKey: "DEMO_KEY"
}

async function showAllRovers(rovers) {

    //create buttons
    let roverDiv = document.querySelector("#roverDiv");
    let output = "";

    for (let i = 0; i < rovers.length; i++) {
        output += `<div class="roverItem"><button type="button" id="${rovers[i].Name}Button" class="btn btn-outline-light btn-lg"
        >${rovers[i].Name}</button>
        </div>`;
    }
    roverDiv.innerHTML = output;

    //make buttons functional: buttons toggle div
    for (let i = 0; i < rovers.length; i++) {

        document.querySelector(`#${rovers[i].Name}Button`).addEventListener("click", function () {

            if (document.querySelector(`#${rovers[i].Name}InfoDiv`) === null) {
                showRoverInfo(rovers[i].Name);
                document.querySelector(`#${rovers[i].Name}Button`).innerHTML = "Stäng";
            }
            else {
                document.querySelector(`#${rovers[i].Name}InfoDiv`).remove();
                document.querySelector(`#${rovers[i].Name}Button`).innerHTML = `${rovers[i].Name}`;
            }
        });
    }
}

async function showRoverInfo(name) {

    function findRover(name) {
        for (let r of data.rovers) {
            if (r.Name === name)
                return r;
        }
    }

    let rover = findRover(name);

    let manifestResponse = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover.Name}?api_key=${app.nasaKey}`);
    let manifest = await manifestResponse.json();

    //create div with information from fetches
    let roverInfoDiv = document.createElement("div");
    roverInfoDiv.setAttribute("id", `${rover.Name}InfoDiv`)
    roverInfoDiv.innerHTML = `<p class="roverFacts">Drönaren heter ${rover.Name}, ${rover.Description}, och väger ${rover.Weight} kilo. Den lämnade Jorden ${manifest.photo_manifest.launch_date}.</p>`;

    //create button to show pics
    document.querySelector(`#${rover.Name}Button`).insertAdjacentElement("afterend", roverInfoDiv);
    let showPicButtonDiv = document.createElement("div");
    showPicButtonDiv.innerHTML = `<button type="button" id="${name}PicsButton" class="btn btn-outline-light btn-sm"
    >Visa bilder från ${name}</button>`;

    document.querySelector(`#${name}InfoDiv`).insertAdjacentElement("beforeend", showPicButtonDiv);

    //make buttons functional: buttons toggle div
    document.querySelector(`#${name}PicsButton`).addEventListener("click", function () {

        if (document.querySelector(`#${name}picDiv`) === null) {
            showRoverPics(name);
            document.querySelector(`#${name}PicsButton`).innerHTML = "Stäng";
        }
        else {
            document.querySelector(`#${name}picDiv`).remove();
            document.querySelector(`#${name}PicsButton`).innerHTML = `Visa bilder från ${name}`;
        }
    });
}

async function showRoverPics(name) {

    //fetch data
    let picResponse = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?api_key=${app.nasaKey}`);
    let pictures = await picResponse.json();

    //create div
    let picDiv = document.createElement("div");
    picDiv.setAttribute("id", `${name}picDiv`)
    picDiv.setAttribute("class", `picDiv`)
    let picOutput = `<h3>${name}s senaste bilder från Mars:</h3>`;

    // 3 pic maximum
    for (let i = 0; i < 3; i++) {
        if (pictures.latest_photos[i] !== undefined) {
            picOutput += `<a href="${pictures.latest_photos[i].img_src}" target="_blank" rel="noopener noreferrer">
            <img src= ${pictures.latest_photos[i].img_src} alt="En av de senaste bilderna från drönaren"
             class="img-thumbnail"></a>`;
        }
    }

    picDiv.innerHTML = picOutput;
    document.querySelector(`#${name}PicsButton`).insertAdjacentElement("afterend", picDiv);
}

async function showAllInfos(infos) {

    let infoDiv = document.querySelector("#infoDiv");
    let output = "";

    for (let i = 0; i < infos.length; i++) {
        output +=
            `<div id= "infoItem${i + 1}">
        <a href=${infos[i].Link} target="_blank" rel="noopener noreferrer">${infos[i].Title}</a>
        <p>${infos[i].Description}</p>
        </div>`;
    }
    infoDiv.innerHTML = output;
}

; (async function init() {

    //these two create the initial view

    showAllRovers(data.rovers);
    showAllInfos(data.infos);
})();