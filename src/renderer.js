const fields = ['PLAYER','TAG', 'WS', 'FKDR', 'WLR'];

window.players.display('showplayers', (data) => {
    let table = document.getElementById("main-table");
    table.innerHTML = ''; // reset table
    let headrow = document.createElement('tr');
    fields.forEach(e => {
        headrow.innerHTML += `<th>${e}</th>`;
    })
    table.appendChild(headrow);

    data.forEach(element => {
        let node = document.createElement('tr');
        fields.forEach(e => {
            if(e === 'PLAYER') node.innerHTML += `<td>${element}</td>`
            else node.innerHTML += `<td>...</td>`
        })
        table.appendChild(node);
    });
})

document.getElementById('start-reading').addEventListener('click', async () => {
    console.log("Button clicked!");
    await window.reading.start();
    document.getElementById('start-reading').setAttribute('disabled', 'true');
});