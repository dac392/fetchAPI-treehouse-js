const api_url = "https://randomuser.me/api/?results=12&nat=us";
const ul = document.getElementById("employees");
const modal_bg = document.querySelector(".modal-bg");
const modal = document.querySelector(".modal");

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
        modal.id = `${person_id}`;
        modal_bg.classList.add("bg-active");
    }

}

function onModalClick(e){
    if(e.target.classList.length===1){
        onClose(e);
    }else if(e.target.classList[1]==="next"){
        onNextPerson(e);
    }else if(e.target.classList[1]==="previous"){
        onPreviousPerson(e);
    }
}
function onClose(e){
    modal_bg.classList.remove("bg-active");
    modal.id = "";
    const children = modal.children.length-3;
    
    for(let i = 0; i < children;i++){
        modal.removeChild(modal.lastChild);
    }
}
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
function getdob(dob){
    const regex = /^(\d{4})-(\d{2})-(\d{2}).*$/;
    return dob.replace(regex, "$2/$3/$1");
}
function getphone(phone){
    const regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/
    return phone.replace(regex,"($1) $2-$3");

}


ul.addEventListener("click",onInspectPerson);
modal.addEventListener("click", onModalClick);
