window.players.display('showplayers', (data) => {
    console.log(data);
    document.getElementById("list").innerHTML = '';
    data.forEach(element => {
        let node = document.createElement('p');
        node.innerHTML = element;
        document.getElementById("list").appendChild(node);
    });
})

document.getElementById('start-reading').addEventListener('click', async () => {
    console.log("Button clicked!");
    await window.reading.start();
    document.getElementById('start-reading').setAttribute('disabled', 'true');
});