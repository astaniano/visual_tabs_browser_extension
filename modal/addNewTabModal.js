const addNewTabModal = document.getElementById("add-new-tab-modal");

const addNewTabForm = document.getElementById('add-new-tab-form')
const newTabUrl = document.getElementById('new-tab-url')
const newTabName = document.getElementById('new-tab-name')
const newTabBgColor = document.getElementById('new-tab-color')

// const closeModalBtl = document.getElementsByClassName("close")[0];
// // When the user clicks on <span> (x), close the modal
// closeModalBtl.onclick = function() {
//   addNewTabModal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === addNewTabModal) {
    addNewTabModal.style.display = "none";
  }
}

function appendNewTabBtn(visualTabsContainer) {
    const addNewTabBtn = document.createElement("button")

    addNewTabBtn.innerText = "+";
    addNewTabBtn.classList.add('link')
    addNewTabBtn.classList.add('add-new-link-btn')
    addNewTabBtn.addEventListener('click', () => {
      addNewTabModal.style.display = "block";
    })

    visualTabsContainer.appendChild(addNewTabBtn)
}

addNewTabForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (
      !newTabUrl.value.startsWith('http') &&
      !newTabUrl.value.startsWith('file:///')
    ) {
        alert('Invalid URL')
        return
    }
    const newVisualTab = {
        url: newTabUrl.value,
        displayName: newTabName.value,
        bgColor: newTabBgColor.value
    }

    const tabsFromStore = await getTabsFromStore()
    const arrOfTabs = JSON.parse(tabsFromStore)
    arrOfTabs.push(newVisualTab)
    const updatedTabsAsString = JSON.stringify(arrOfTabs, null, 2)

    await saveTabsToStore(updatedTabsAsString)

    newTabUrl.value = ''
    newTabName.value = ''

    // TODO: refresh page here
})
