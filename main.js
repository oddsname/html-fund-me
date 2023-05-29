import './style.css'

const connectMetamask = async () => {
    //only for metamask
    if(typeof window.ethereum !== "undefined") {
        return await window.ethereum.request({
                method: "eth_requestAccounts"
        });
    }

    return false;
}

document.querySelector('button')
    .addEventListener('click', async function (e) {
        e.preventDefault();

        if(await connectMetamask()) {
            e.target.innerHTML = "Connected";
        } else {
            e.target.innerHTML = "Please install metamask";
        }
    })

