const allButtons = document.querySelectorAll(".toggleBtn")
const handleActive = (id) => {
    for (let btn of allButtons) {
        if (btn.id !== id) {
            btn.classList.remove("bg-primary", "text-white")

        }
    }

    const activeButton = document.getElementById(id)

    activeButton.classList.add("bg-primary", "text-white")

}

// RENDER HOME SECTION
const fetchHomeData = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            console.log(data.data)
            renderHomePage(data.data)
        })
}
fetchHomeData()

const renderHomePage = async (allData) => {
    const cardMother = document.getElementById("card-container-home")
    cardMother.innerHTML = ""

    const openCloseIcon = (status) => {
        console.log(status)
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



    for (let data of allData) {

        const divTag = document.createElement("div")
        divTag.classList.add("flex", "flex-col", "border-t-3", "rounded", "shadow")
        if (data.priority === "high" || data.priority === "medium") {
            divTag.classList.add("border-t-green-600")
        }
        else if (data.priority === "low") {
            divTag.classList.add("border-t-purple-500")
        }

        divTag.innerHTML = `

                    <div class="p-4 flex flex-col h-full">
                        <div class="flex justify-between mb-3">
                            <img src="${openCloseIcon(data.status)}" alt="">
                            <span class="${priorityColor(data.priority)} py-1 px-6 rounded-full text-xs">${data.priority.toUpperCase()}</span>
                        </div>
                        <h1 class="text-sm font-semibold">${data.title}</h1>
                        <p class="text-xs text-[#64748B] my-2">${data.description}</p>
                        <div class="flex-1"></div>
                        <div class="flex justify-between  items-center">

       
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

// OPEN SECTION....................................................................................................................................................................................................