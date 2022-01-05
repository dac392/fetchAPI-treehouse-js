const api_url = "https://randomuser.me/api/?results=1";
const main = document.querySelector("main");

fetch(api_url)
.then(res=>res.json())
.then(data=>peopleParse(data.results));

function peopleParse(people_list){
    
    for(let i = 0; i<people_list.length; i++){
        const cur_person = people_list[i];
        let html = `<div class="person">`;

        html+=`<img src="${cur_person.picture.thumbnail}" alt="${cur_person.name.first} ${cur_person.name.last}">`
        html+=`<div class="info">`;
        html+=`<h5>${cur_person.name.first} ${cur_person.name.last}</h5>`;
        html+=`<p>${cur_person.email}</p>`
        html+=`<p>${cur_person.location.city}, ${cur_person.location.state}</p>`
        html+=`</div>`;

        html+=`</div>`;

        main.insertAdjacentHTML("beforeend",html);


    }

}

function generatePerson(person){}