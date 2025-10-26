const addNewTabForm = document.getElementById('add-new-tab-form')
const newTabUrl = document.getElementById('new-tab-url')
const newTabName = document.getElementById('new-tab-name')
const newTabBgColor = document.getElementById('new-tab-color')

// const closeModalBtl = document.getElementsByClassName("close")[0];
// // When the user clicks on <span> (x), close the modal
// closeModalBtl.onclick = function() {
//   addNewTabModal.style.display = "none";
// }

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

    const addNewTabModal = document.getElementById("add-new-tab-modal");
    addNewTabModal.style.display = "none";

    location.reload()
})
