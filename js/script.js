const api_url = "https://randomuser.me/api/?results=12&nat=us";
const ul = document.getElementById("employees");
const modal_bg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");
const close_bg = document.querySelector(".close-bg");

let master_list = [];
fetch(api_url)
.then(res=>res.json())
.then(data=>peopleParse(data.results));

/*-------main functions------------------ */
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

}

function onInspectPerson(e){
    if(e.target.id !== "employees"){
        let person = e.target;
        while(person.className!=="person"){
            person=person.parentElement;
        }
        person_id = person.id;
        const html = modalHTML(master_list[person_id]);
        modal.insertAdjacentHTML("beforeend", html);
        modal_bg.classList.add("bg-active");
    }

}

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

function onClose(e){
    modal_bg.classList.remove("bg-active");
    const children = modal.children.length-1;
    
    for(let i = 0; i < children;i++){
        modal.removeChild(modal.lastChild);
    }
}
/*
    ----------------helper function------------------------
*/
function getdob(dob){
    const regex = /^(\d{4})-(\d{2})-(\d{2}).*$/;
    return dob.replace(regex, "$2/$3/$1");
}
function getphone(phone){
    const regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/
    return phone.replace(regex,"($1) $2-$3");

}


ul.addEventListener("click",onInspectPerson);
close_bg.addEventListener("click", onClose);
