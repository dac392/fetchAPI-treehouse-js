const api_url = "https://randomuser.me/api/?results=12&nat=us";
const ul = document.getElementById("employees");
const modal_bg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");
const header = document.querySelector("header");
const no_results_msg = document.querySelector(".no-results");
let master_list = [];
let names_list = [];
fetch(api_url)
.then(res=>res.json())
.then(data=>peopleParse(data.results));

/*-------main functions------------------ */
/* insearts the search components into the header */
function insertSearch(){
    const label = setUp("label", "className", "student-search");
    label.htmlFor = "search";
 
    const span = setUp("span", "textContent", "Search by name");
 
    const input = setUp("input", "id", "search");
    input.placeholder = "Search by Name...";
 
    const button = setUp("button", "type", "button");
    const img = setUp("img", "src", "img/icn-search.svg");
    img.alt = "Search icon";
    button.append(img);
    
    label.append(span);
    label.append(input);
    label.append(button);
 
    header.append(label);
 }
 /* search functionality. This is for sure the messiest function here */
 function search(e){
     console.log(ul);
    const regex = new RegExp(e.target.value, "ig");
    let filtered = [];
    
    for(let names_index = 0; names_index<names_list.length; names_index++){
        let regExTest = regex.test(names_list[names_index]);
        if(!regExTest){
            ul.children[names_index+1].classList.add("hide");
            filtered.push(names_list[names_index]);
        }else if(ul.children[names_index+1].classList.contains("hide")){
            ul.children[names_index+1].classList.remove("hide");
        }
    }

    const no_res = filtered.length === names_list.length;
    if(no_res){
        ul.firstElementChild.classList.remove("hide");
    }else if(!ul.firstElementChild.classList.contains("hide")){
        ul.firstElementChild.classList.add("hide");
    }



 }
 /* populates a quick reference to names in order of apearence for easier searching */
 function makeNamesList(people_obj){
    for(let i = 0; i < people_obj.length; i++){
        names_list.push(`${people_obj[i].name.first} ${people_obj[i].name.last}`);
    }
 }
/* "parses" the results from fetch and makes individual person <li> objects*/
function peopleParse(people_list){
    master_list = people_list;
    for(let i = 0; i<people_list.length; i++){
        const cur_person = people_list[i];
        let html = `<li class="person" id="${i}">`;

        html+=`<img src="${cur_person.picture.large}" alt="${cur_person.name.first} ${cur_person.name.last}">`;
        html+=`<div class="info">`;
        html+=`<h5>${cur_person.name.first} ${cur_person.name.last}</h5>`;
        html+=`<p>${cur_person.email}</p>`
        html+=`<p>${cur_person.location.city}, ${cur_person.location.state}</p>`
        html+=`</div>`;

        html+=`</li>`;

        ul.innerHTML+=html;
    }
    makeNamesList(people_list);

}
/* functionality for when clicking on a person's card */
function onInspectPerson(e){
    if(e.target.id !== "employees"){
        let person = e.target;
        while(person.className!=="person"){
            person=person.parentElement;
        }
        person_id = person.id;
        const html = modalHTML(master_list[person_id]);
        modal.insertAdjacentHTML("beforeend", html);
        modal.id = `${person_id}`;
        modal_bg.classList.add("bg-active");
    }

}
/* chooses the functionality depending on the target clicked. close, next, or previous */
function onModalClick(e){
    if(e.target.classList.length===1){
        onClose(e);
    }else if(e.target.classList[1]==="next"){
        onNextPerson(e);
    }else if(e.target.classList[1]==="previous"){
        onPreviousPerson(e);
    }
}
/* closes the inspect modal */
function onClose(e){
    modal_bg.classList.remove("bg-active");
    modal.id = "";
    const children = modal.children.length-3;
    
    for(let i = 0; i < children;i++){
        modal.removeChild(modal.lastChild);
    }
}
/* adds next person funcionality from within the modal view */
function onNextPerson(e){
    const id = parseInt(modal.id);
    modal.id = (id+1===master_list.length)? `0`:`${id+1}`;
    const children = modal.children.length-3;
    for(let i = 0; i < children;i++){
        modal.removeChild(modal.lastChild);
    }
    html = modalHTML(master_list[modal.id]);
    modal.insertAdjacentHTML("beforeend", html);

}
/* adds previous person funcionality from within the modal view */
function onPreviousPerson(e){
    const id = parseInt(modal.id);
    modal.id = (id===0)? `${master_list.length-1}`:`${id-1}`;
    const children = modal.children.length-3;
    for(let i = 0; i < children;i++){
        modal.removeChild(modal.lastChild);
    }
    html = modalHTML(master_list[modal.id]);
    modal.insertAdjacentHTML("beforeend", html);
}


/*
    ----------------helper function------------------------
*/
/* returns the html string containing the complete modal information */
function modalHTML(person_obj){
    const dob_f = getdob(person_obj.dob.date);
    const phone_f = getphone(person_obj.cell);

    let html =`<img src="${person_obj.picture.large}" alt="${person_obj.name.first} ${person_obj.name.last}">`;
    html+=`<h5>${person_obj.name.first} ${person_obj.name.last}</h5>`;
    html+=`<p>${person_obj.email}</p>`
    html+=`<p>${person_obj.location.city}, ${person_obj.location.state}</p>`
    html+= `<div class="hr"></div>`;
    html+= `<p>${phone_f}</p>`
    html+= `<p>${person_obj.location.street.number} ${person_obj.location.street.name}, ${person_obj.location.city}, ${person_obj.location.state}, ${person_obj.location.postcode}</p>`;
    html+= `<p>Birthday: ${dob_f}</p>`;
    
    return html;
}
/* a small set up that only insert seach should be using */
function setUp(elementName, property, value){
    const el = document.createElement(elementName);
    el[property] = value;
    return el;
 }
/* reutrns a correctly formated dob */
function getdob(dob){
    const regex = /^(\d{4})-(\d{2})-(\d{2}).*$/;
    return dob.replace(regex, "$2/$3/$1");
}
/* reutrns a correctly formated cell number */
function getphone(phone){
    const regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/
    return phone.replace(regex,"($1) $2-$3");

}

/* 
=======================
    main function
=======================
*/
insertSearch()
ul.addEventListener("click",onInspectPerson);
modal.addEventListener("click", onModalClick);
header.addEventListener("keyup", search);
