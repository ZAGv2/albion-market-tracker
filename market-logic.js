// market-logic.js
let currentFileData = {};

// Wait for the page to load before running the initial fetch
window.onload = () => {
    fetch('main_categories.json')
        .then(res => res.json())
        .then(data => {
            const main = document.getElementById('main-menu');
            if (main) {
                main.innerHTML = '<option value="">Select Category</option>';
                data.categories.forEach(cat => {
                    main.innerHTML += `<option value="${cat.file}">${cat.name}</option>`;
                });
            }
        })
        .catch(err => console.error("Could not load main_categories.json", err));
};

async function loadSubCategoryFile(fileName) {
    const subMenu = document.getElementById('sub-menu');
    const itemMenu = document.getElementById('item-menu');
    const display = document.getElementById('display');

    subMenu.innerHTML = '<option value="">--</option>';
    subMenu.disabled = true;
    itemMenu.innerHTML = '<option value="">--</option>';
    itemMenu.disabled = true;
    if (display) display.classList.add('hidden');

    if (!fileName) return;

    try {
        const res = await fetch(fileName);
        currentFileData = await res.json();

        subMenu.innerHTML = '<option value="">Select Sub-Category</option>';
        Object.keys(currentFileData).forEach(key => {
            subMenu.innerHTML += `<option value="${key}">${key}</option>`;
        });
        subMenu.disabled = false;
    } catch (err) {
        console.error("Error loading " + fileName, err);
    }
}

function fillItemMenu() {
    const subKey = document.getElementById('sub-menu').value;
    const itemMenu = document.getElementById('item-menu');
    const display = document.getElementById('display');

    itemMenu.innerHTML = '<option value="">Select Item</option>';
    if (display) display.classList.add('hidden');

    if (!subKey || !currentFileData[subKey]) {
        itemMenu.disabled = true;
        return;
    }

    currentFileData[subKey].forEach(item => {
        itemMenu.innerHTML += `<option value="${item.id}" data-name="${item.n}">${item.n}</option>`;
    });
    itemMenu.disabled = false;
}

function updateView() {
    const itemMenu = document.getElementById('item-menu');
    const id = itemMenu.value;
    
    if (!id) {
        if (document.getElementById('display')) document.getElementById('display').classList.add('hidden');
        return;
    }

    const name = itemMenu.options[itemMenu.selectedIndex].getAttribute('data-name');
    const tier = document.getElementById('tier').value;
    const enc = document.getElementById('enchant').value;
    const qual = document.getElementById('quality').value;

    const fullID = `${tier}_${id}${enc > 0 ? '@' + enc : ''}`;
    
    const display = document.getElementById('display');
    if (display) {
        display.classList.remove('hidden');
        document.getElementById('final-name').innerText = name;
        document.getElementById('final-sub').innerText = document.getElementById('sub-menu').value;
        document.getElementById('t-tag').innerText = tier;
        document.getElementById('render').src = `https://render.albiononline.com/v1/item/${fullID}.png?quality=${qual}`;
    }
}

