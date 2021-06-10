
//  CREATE TAMPLATES FOR BOTH ORGANIC AND SPONSORED RECOMMENDATION 
//  ACCORDING TO THE ASSIGNMENT REQUIREMENTS 

const SPONSORED_TEMPLATE = function(imageUrl, linkUrl, header, brand) { 
    return `
    <div class=rec id='my_widget_div'>
        <a id='my_widget_anchor' class='link' target='_blank' href=${linkUrl}>
            <img id='my_widget_img' class='img' src=${imageUrl}></img>
        </a>
        <div class=details>
            <h2 id="my_widget_header"> ${header} |</h2>          
            <span id="my_widget_brand"> ${brand} </span>
        </div>
    </div>
`};

const ORGANIC_TEMPLATE = function(imageUrl, linkUrl, header) { 
    return `
    <div class=rec_box id='my_widget_div'>
        <a id='my_widget_anchor' class='link' target='_self' href=${linkUrl}>
            <img id='my_widget_img' class='img' src=${imageUrl}></img>
        </a>
        <h2> ${header} </h2>
    </div>
`};


//CREATE THE RECOMMENDATION AND SEND IT TO THE RIGHT TEMPLATE

function createRecommendationSponsored(thumbnail, url, name, brand) {
    let rec_box=document.createElement("div");
    rec_box.className = "rec_box"; 
    const html = SPONSORED_TEMPLATE(thumbnail, url, name, brand);
    rec_box.innerHTML = html;
    document.getElementById('my_widget').appendChild(rec_box);
}

function createRecommendationOrganic(thumbnail, url, name) {
    let rec_box=document.createElement("div"); 
    rec_box.className = "rec_box"; 
    const html = ORGANIC_TEMPLATE(thumbnail, url, name);
    rec_box.innerHTML = html;
    document.getElementById('my_widget').appendChild(rec_box);
}

// INITIALIZE FUNCTION GETS VARIABLES FROM ANY WEBSITE
// THE FUNCTION CREATE THE API REQUEST 
// AND SEND THE RETURNED ARGUMENTS FROM JSON TO THE CREATE RECOMMENDATION FUNCTION

function initializeRecommendations(appType, appKey, count, sourceId, sourceType) {
    const paramters = new URLSearchParams();
    paramters.append('app.type', appType);
    paramters.append('app.apikey', appKey);
    paramters.append('count', count);
    paramters.append('source.id', sourceId);
    paramters.append('source.type', sourceType);

    const postPromise = fetch(`http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?${paramters.toString()}`);

    postPromise
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(data => {
            // console.log(data.list);
            if(!data || !data.length){          
                for(let i=0; i<data.list.length; i++){

                    // Some URLs from the API are invalid and return 404. Here I am handling it by 
                    // fetching the image url and checking response in order to hide recommendations
                    // without images.
                    
                    fetch(data.list[i].thumbnail[0].url).then(response => {
                        if (response.status !== 200) {
                            return;
                        }
                        if(data.list[i].origin === "sponsored"){
                            createRecommendationSponsored(data.list[i].thumbnail[0].url, data.list[i].url, data.list[i].name, data.list[i].branding);
                        }
                        else if (data.list[i].origin === "organic"){
                            createRecommendationOrganic(data.list[i].thumbnail[0].url, data.list[i].url, data.list[i].name);
                        }
                    }).catch(err => {
                        // We want to ignore 4XX errors.
                        console.log('some data is missing');
                    });
                }
            }
        }).catch((err) => {
            console.log('error');
        });
}

//TEST FUNCTION TO CHECK IF PARAMETERS RETURN AS AEXPECTED AND NOT EMPTY
// DIDNT USE UNIT TEST FREMEWORKS BECAUSE ASKED TO USE ONLY VANILLA JS
// THE FUNCTION CAN BE CHANGE FOR ORGANIC AND OTHERS, ITS ONLY A TEMPLATE 


function testOrganicTemplate() {
    createRecommendationSponsored('balh', 'google.com', 'Nitzan', 'Dagan');
    if (document.getElementById('my_widget_img') === null) {
        console.error("Test failed.");
        return;
    }

    if (document.getElementById('my_widget_img').getAttribute('src') !== 'balh') {
        console.error("Test failed.");
        return;
    }   
    
    if (document.getElementById('my_widget_anchor').getAttribute('href') !== 'google.com') {
        console.error("Test failed.");
        return;
    }   

    if (document.getElementById('my_widget_header') === null || document.getElementById('my_widget_header') !== 'Nitzan'){
        console.error("Test failed.");
        return;
    }   

    if (document.getElementById('my_widget_brand') === null || document.getElementById('my_widget_brand') !== 'Dagan'){
        console.error("Test failed.");
        return;
    }   

    console.log('Test succeeded.');
}






               


