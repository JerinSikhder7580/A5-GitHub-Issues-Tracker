const allButtons = document.querySelectorAll(".toggleBtn")
const handleActive = (id) => {
    for (let btn of allButtons) {
        if (btn.id !== id) {
            btn.classList.remove("bg-primary", "text-white")

        }
    }

    const activeButton = document.getElementById(id)

    activeButton.classList.add("bg-primary", "text-white")

    fetchHomeData(activeButton)

}

// RENDER HOME SECTION
const dataCount = document.getElementById("data-count")
let allData
const fetchHomeData = (activeButton) => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            console.log(data.data)
            allData = data.data
            if (!activeButton) {
                dataCount.innerText = data.data.length

                renderHomePage(data.data)
            }
            else if (activeButton.id === "all") {
                dataCount.innerText = data.data.length
                renderHomePage(data.data)
            }
            else if (activeButton.id === "open") {
                const filteredData = data.data.filter((data) => data.status === "open")
                dataCount.innerText = filteredData.length
                renderHomePage(filteredData)

            }
            else if (activeButton.id === "close") {
                const filteredData = data.data.filter((data) => data.status === "closed")
                dataCount.innerText = filteredData.length
                renderHomePage(filteredData)
            }


        })
}
fetchHomeData()
const showLabels = (labels) => {
    let sticker = []

    for (let label of labels) {
        if (label === "bug") {
            sticker.push('<span class="text-red-500 bg-red-200 px-2 py-[6px] text-xs rounded-full"><i class="fa-solid fa-bug mr-1"></i>Bug</span>')
        }
        else if (label === "help wanted") {
            sticker.push('<span class="bg-[#FFF8DB] text-[#D97706] border border-[#FDE68A] rounded-full px-2 py-[6px]  text-xs"><i class="fa-solid fa-crosshairs mr-1"></i>help wanted</span>')
        }
        else {
            sticker.push(`<span class="bg-[#DEFCE8] text-[#00A96E] border border-[#BBF7D0] rounded-full px-2 py-[6px]  text-xs"><i class="fa-solid fa-crosshairs mr-1"></i>${label}</span>`)

        }

    }
    return sticker

}


const renderHomePage = async (allData) => {
    const cardMother = document.getElementById("card-container-home")
    cardMother.innerHTML = ""

    const openCloseIcon = (status) => {
        // console.log(status)
        if (status === "open") {
            return "./assets/Open-Status.png"
        }
        else if (status === "closed") {
            return "./assets/close.png"
        }

    }
    const priorityColor = (data) => {
        if (data === "high") {
            return "text-red-500 bg-red-200 "
        }
        else if (data === "medium") {
            return "text-[#F59E0B] bg-[#FFF6D1]"
        }
        else if (data === "low") {
            return "text-[#9CA3AF] bg-[#EEEFF2]"
        }
    }






    for (let data of allData) {

        const divTag = document.createElement("div")
        divTag.classList.add("flex", "flex-col", "border-t-3", "rounded", "shadow")
        divTag.onclick = () => handleModal(data.id)
        if (data.status === "open") {
            divTag.classList.add("border-t-green-600")
        }
        else if (data.status === "closed") {
            divTag.classList.add("border-t-purple-500")
        }

        divTag.innerHTML = `

                    <div class=" p-4 flex flex-col h-full">
                        <div class="flex justify-between mb-3">
                            <img src="${openCloseIcon(data.status)}" alt="">
                            <span class="${priorityColor(data.priority)} py-1 px-6 rounded-full text-xs">${data.priority.toUpperCase()}</span>
                        </div>
                        <h1 class="text-sm font-semibold">${data.title}</h1>
                        <p class="text-xs text-[#64748B] my-2">${data.description}</p>
                        <div class="flex-1"></div>
                        <div class="flex justify-between  items-center flex-wrap sm:flex-nowrap space-y-1 sm:space-y-0">

       
                            ${showLabels(data.labels).join('')}
                        </div>

                    </div>
                    <div class="flex-1"></div>


                    <div class="border-t border-t-[#E4E4E7] p-4">
                        <span class="block text-[#64748B]">#1 by ${data.author}</span>
                        <span class="text-[#64748B]">${new Date(data.updatedAt).toLocaleDateString()}</span>
                    </div>


        `
        cardMother.appendChild(divTag)
    }
}

// SEARCH SECTION....................................................................................................................................................................................................
const handleSearch = () => {
    const search = document.getElementById("search").value.toLowerCase()

    if (!search) {
        console.log("i am triggering")
        return fetchHomeData()

    }


    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${search}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.data)
            renderHomePage(data.data)
            dataCount.innerText = data.data.length
        })



}

// Modal 
const handleModal = (id) => {

    const priorityColor = (data)=>{
        if(data === "high"){
            return "bg-red-500"
        }
        else if(data === "medium"){
            return "bg-yellow-500 "
        }
        else if(data === "low"){
            return "bg-gray-300"
        }
    }


    const modalData = allData.find((data) => data.id === id)
    // console.log(modalData)
    const modalContainer = document.getElementById("modal-container")
    modalContainer.innerHTML = `
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box space-y-5">

            <div class="*:mr-2">
                <h1 class="font-bold text-2xl">${modalData.title}</h1>
                <span class="bg-green-600 text-white p-1 rounded-full text-sm px-3">${modalData.status}</span>.
                <span class="text-gray-500 text-sm">Opened by ${modalData.author}</span>.
                <span class="text-gray-500 text-sm">${new Date(modalData.createdAt).toLocaleDateString()}</span>

            </div>
            <div class="py-3">
               ${showLabels(modalData.labels).join(" ")}
            </div>
            <p class="text-gray-500 text-base">${modalData.description}</p>
            <div class="flex gap-20 bg-[#F8FAFC] p-5 rounded-md">
                <div>
                    <span class="text-base text-gray-500">Assignee:</span>
                    <h1>${modalData.assignee}</h1>
                </div>
                <div>
                    <span class="text-base text-gray-500">Priority:</span>
                    <span class=" ${priorityColor(modalData.priority)} text-center text-white  px-2 py-[6px] text-xs rounded-full block">${modalData.priority.toUpperCase()}</span>
                </div>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-primary outline-none">Close</button>
                </form>
            </div>
        </div>
    </dialog>`
    document.getElementById('my_modal_5').showModal()

}